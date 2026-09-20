// Simulation de bataille — le « combat vivant ».
//
// Fonction PURE et SEEDÉE : mêmes flottes + même graine ⇒ même bataille, même
// journal (l'aléa vient du seul `seededRng`). L'appelant (voir
// `Engine#resolvePlanetCombat`) tire une graine par engagement, applique le
// résultat tout de suite à l'état de jeu, puis l'interface REJOUE le journal
// round par round : fermer la fenêtre ne change jamais l'issue.
//
// Le calcul se fait par PILES de classe (jamais par vaisseau : une flotte peut
// compter des millions d'unités). À chaque round :
//  1. 0 à 2 événements aléatoires (data/combatEvents.js) ;
//  2. chaque vaisseau tire une fois, au hasard sur les piles adverses (au
//     prorata de leurs effectifs) ; un tir est esquivé ou touche, et fait
//     `attaque × efficacité` dégâts — le surplus au-delà des PV d'UN vaisseau
//     n'est qu'à moitié utile, ce qui gaspille les gros tirs sur les petites cibles ;
//  3. les dégâts sont appliqués simultanément aux réserves de PV des piles.
// Fin : un camp n'a plus de vaisseau, la flotte alliée se replie (sous
// `retreatThreshold`, plus entamée que l'ennemi), ou `maxRounds` est atteint.

import { CONFIG } from '../data/config.js';
import { SHIP_BY_ID } from '../data/fleet.js';
import { COMBAT_EVENTS } from '../data/combatEvents.js';
import { seededRng, binomial } from './rng.js';
import { fleetMultiplier, fleetDurabilityMultiplier } from './combat.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** Probabilité d'esquiver un tir, selon la taille de la cible. */
export function evasionOf(size) {
  const c = CONFIG.combat;
  return Math.max(c.evasionMin, c.evasionBase - c.evasionPerTier * size);
}

/** Efficacité d'un tir de calibre `size` sur un blindage `armor`. */
export function efficiency(size, armor) {
  const c = CONFIG.combat;
  return clamp(
    1 - c.armorPenaltyPerTier * Math.max(0, armor - size),
    c.minEfficiency,
    1
  );
}

/**
 * Piles alliées d'une allocation : attaque et PV de chaque vaisseau passent
 * par les multiplicateurs de flotte de la partie (la puissance de flotte
 * s'applique à l'attaque ET aux PV, voir `combat.js#fleetMultiplier`).
 * @param {Record<string, number>} allocation { shipId: nombre engagé }
 * @returns {{ id: string, count: number, attack: number, hp: number,
 *   size: number, armor: number }[]}
 */
export function allyFleetFromAllocation(state, allocation) {
  const m = fleetMultiplier(state);
  const durability = fleetDurabilityMultiplier(state);
  const out = [];
  for (const [id, count] of Object.entries(allocation)) {
    const ship = SHIP_BY_ID[id];
    if (!ship || !(count > 0)) continue;
    out.push({
      id,
      count,
      attack: ship.attack * m,
      hp: ship.hp * m * durability,
      size: ship.armorTier,
      armor: ship.armorTier,
    });
  }
  return out;
}

function makeUnit(side, kind, f) {
  const pool = f.count * f.hp;
  return {
    side,
    token: `${kind}:${f.id}`,
    id: f.id,
    size: f.size,
    armor: f.armor,
    attack: f.attack,
    hp: f.hp,
    n: f.count,
    n0: f.count,
    pool,
    pool0: pool,
    mod: { dmg: 1, evade: 0, fire: 1, vuln: 1 },
    incoming: 0,
    dodged: 0,
  };
}

/**
 * @param {{ id: string, count: number, attack: number, hp: number,
 *   size: number, armor: number }[]} allyFleet
 * @param {{ id: string, count: number, attack: number, hp: number,
 *   size: number, armor: number }[]} enemyFleet
 * @param {{ seed: number, profileId?: string|null, detail?: boolean }} opts
 *   `detail: false` saute la construction du journal (estimations
 *   Monte-Carlo) sans changer l'issue : les tirages ne dépendent pas de ce drapeau.
 * @returns {{
 *   seed: number, profileId: string|null,
 *   victory: boolean, outcome: 'victory'|'defeat'|'retreat'|'timeout',
 *   losses: Record<string, number>, destroyed: Record<string, number>,
 *   recovered: Record<string, number>, enemyLosses: Record<string, number>,
 *   start: { ally: {token: string, count: number}[], enemy: {token: string, count: number}[] },
 *   rounds: { n: number, lines: object[], allyHp: number, enemyHp: number,
 *     allyCount: number, enemyCount: number }[]
 * }}
 */
export function simulateBattle(
  allyFleet,
  enemyFleet,
  { seed, profileId = null, detail = true }
) {
  const c = CONFIG.combat;
  const rng = seededRng(seed);
  const allies = allyFleet.map((f) => makeUnit('ally', 'ship', f));
  const enemies = enemyFleet.map((f) => makeUnit('enemy', 'enemy', f));
  const units = [...allies, ...enemies];
  const camp = { ally: allies, enemy: enemies };
  const foeOf = (side) => (side === 'ally' ? 'enemy' : 'ally');
  const alive = (side) => camp[side].filter((u) => u.n > 0);
  const count = (side) => camp[side].reduce((sum, u) => sum + u.n, 0);
  const pool = (side) => camp[side].reduce((sum, u) => sum + u.pool, 0);
  const pool0 = (side) => camp[side].reduce((sum, u) => sum + u.pool0, 0);
  const hpFraction = (side) => {
    const total = pool0(side);
    return total > 0 ? pool(side) / total : 0;
  };

  const pick = (side, filter) => {
    const candidates = alive(side).filter(filter ?? (() => true));
    const total = candidates.reduce((sum, u) => sum + u.n, 0);
    let roll = rng() * total;
    for (const u of candidates) {
      roll -= u.n;
      if (roll <= 0) return u;
    }
    return candidates[candidates.length - 1];
  };
  const flags = {};
  const ctx = { rng, round: 0, flags, alive, pick, foeOf };

  const start = {
    ally: allies.map((u) => ({ token: u.token, count: u.n0 })),
    enemy: enemies.map((u) => ({ token: u.token, count: u.n0 })),
  };
  const rounds = [];
  let outcome = null;

  for (let round = 1; round <= c.maxRounds && !outcome; round++) {
    ctx.round = round;
    const lines = [];
    if (detail && round === 1) {
      lines.push({ id: 'intro', side: 'neutral', profile: profileId });
    }
    for (const u of units) {
      u.mod = { dmg: 1, evade: 0, fire: 1, vuln: 1 };
      u.incoming = 0;
      u.dodged = 0;
    }

    // 1. Événements aléatoires (0 à 2 par round).
    let slots = 0;
    if (rng() < c.eventChance) slots = rng() < c.secondEventChance ? 2 : 1;
    for (let i = 0; i < slots; i++) {
      const side = rng() < 0.5 ? 'ally' : 'enemy';
      const eligible = COMBAT_EVENTS.filter((e) => e.when(ctx, side));
      if (eligible.length === 0) continue;
      const total = eligible.reduce((sum, e) => sum + e.weight, 0);
      let roll = rng() * total;
      let event = eligible[eligible.length - 1];
      for (const e of eligible) {
        roll -= e.weight;
        if (roll <= 0) {
          event = e;
          break;
        }
      }
      const unit = event.apply(ctx, side);
      if (detail) lines.push({ id: event.id, side, unit: unit.token });
    }

    // 2. Tirs simultanés : un tir par vaisseau et par round.
    const salvos = (side) => {
      const attackers = alive(side);
      const targets = alive(foeOf(side));
      if (targets.length === 0) return;
      const targetWeight = targets.reduce((sum, u) => sum + u.n, 0);
      for (const a of attackers) {
        let shotsLeft = Math.round(a.n * a.mod.fire);
        if (shotsLeft <= 0) continue;
        const perShot = a.attack * a.mod.dmg * c.damageScale;
        let weightLeft = targetWeight;
        for (let i = 0; i < targets.length; i++) {
          const d = targets[i];
          const share =
            i === targets.length - 1
              ? shotsLeft
              : binomial(rng, shotsLeft, d.n / weightLeft);
          shotsLeft -= share;
          weightLeft -= d.n;
          if (share <= 0) continue;
          const evade = clamp(evasionOf(d.size) + d.mod.evade, 0, 0.9);
          const hits = binomial(rng, share, 1 - evade);
          d.dodged += share - hits;
          const damage = perShot * efficiency(a.size, d.armor) * d.mod.vuln;
          // Le surplus au-delà des PV d'UN vaisseau n'est qu'en partie utile.
          const useful =
            damage <= d.hp ? damage : d.hp + c.overkillSpill * (damage - d.hp);
          d.incoming += hits * useful;
        }
      }
    };
    salvos('ally');
    salvos('enemy');

    // 3. Dégâts appliqués d'un coup.
    const lost = new Map();
    for (const u of units) {
      if (u.n <= 0) continue;
      const before = u.n;
      u.pool = Math.max(0, u.pool - u.incoming);
      u.n = Math.ceil(u.pool / u.hp - 1e-9);
      if (u.n < before) lost.set(u, before - u.n);
    }

    if (detail) {
      for (const side of ['ally', 'enemy']) {
        const dodged = Math.round(
          camp[side].reduce((sum, u) => sum + u.dodged, 0)
        );
        if (dodged >= 1) lines.push({ id: 'dodged', side, n: dodged });
      }
      for (const side of ['enemy', 'ally']) {
        for (const u of camp[side]) {
          const n = lost.get(u);
          if (n) lines.push({ id: 'destroyed', side, unit: u.token, n });
        }
      }
    }

    // 4. Fin de bataille ?
    const allyLeft = count('ally');
    const enemyLeft = count('enemy');
    if (enemyLeft === 0 && allyLeft > 0) outcome = 'victory';
    else if (allyLeft === 0) outcome = 'defeat';
    else if (
      hpFraction('ally') < c.retreatThreshold &&
      hpFraction('ally') < hpFraction('enemy')
    ) {
      outcome = 'retreat';
    } else if (round === c.maxRounds) {
      outcome =
        hpFraction('ally') > hpFraction('enemy') ? 'victory' : 'timeout';
    }

    if (detail) {
      if (outcome)
        lines.push({
          id: 'outcome',
          side: 'neutral',
          outcome,
          profile: profileId,
        });
      rounds.push({
        n: round,
        lines,
        allyHp: hpFraction('ally'),
        enemyHp: hpFraction('enemy'),
        allyCount: allyLeft,
        enemyCount: enemyLeft,
      });
    }
  }

  const finalOutcome = outcome ?? 'timeout';
  const victory = finalOutcome === 'victory';

  // Pertes : les chantiers récupèrent une part des épaves (voir salvageRate).
  const salvage =
    victory || finalOutcome === 'retreat' ? c.salvageRate : c.salvageRateDefeat;
  const destroyed = {};
  const recovered = {};
  const losses = {};
  for (const u of allies) {
    const gone = u.n0 - u.n;
    if (gone <= 0) continue;
    const back = binomial(rng, gone, salvage);
    destroyed[u.id] = gone;
    if (back > 0) recovered[u.id] = back;
    if (gone - back > 0) losses[u.id] = gone - back;
  }
  const enemyLosses = {};
  for (const u of enemies) if (u.n0 - u.n > 0) enemyLosses[u.id] = u.n0 - u.n;

  return {
    seed,
    profileId,
    victory,
    outcome: finalOutcome,
    losses,
    destroyed,
    recovered,
    enemyLosses,
    start,
    rounds,
  };
}

/**
 * Estimation Monte-Carlo : `runs` batailles à graines dérivées de `seed`
 * (mêmes graines à chaque appel ⇒ estimation stable et quasi monotone quand
 * on ajoute des vaisseaux).
 * @returns {{ winChance: number, lossFraction: number }} chance de victoire
 *   et part moyenne de la puissance engagée perdue (épaves récupérées déduites)
 */
export function estimateBattle(
  allyFleet,
  enemyFleet,
  { runs = CONFIG.combat.estimateRuns, seed = 1 } = {}
) {
  if (allyFleet.length === 0) return { winChance: 0, lossFraction: 0 };
  const power = allyFleet.reduce((sum, f) => sum + f.count * f.attack, 0);
  const attackOf = Object.fromEntries(allyFleet.map((f) => [f.id, f.attack]));
  let wins = 0;
  let lost = 0;
  for (let i = 0; i < runs; i++) {
    const battle = simulateBattle(allyFleet, enemyFleet, {
      seed: seed + i * 7919,
      detail: false,
    });
    if (battle.victory) wins++;
    for (const [id, n] of Object.entries(battle.losses))
      lost += n * attackOf[id];
  }
  return {
    winChance: wins / runs,
    lossFraction: power > 0 ? lost / runs / power : 0,
  };
}

/** Chance de victoire seule (voir `estimateBattle`). */
export function estimateWinChance(allyFleet, enemyFleet, opts) {
  return estimateBattle(allyFleet, enemyFleet, opts).winChance;
}

/**
 * Pré-remplissage de la fenêtre d'allocation : la PLUS PETITE flotte qui vise
 * `target` de chances de victoire, en engageant les vaisseaux les moins
 * puissants d'abord (choix de la Fifty Update). Recherche dichotomique sur le
 * nombre de vaisseaux engagés dans cet ordre.
 *
 * Si même toute la flotte n'atteint pas la cible, `allocation` est la flotte
 * entière et `sufficient` vaut `false`.
 * @returns {{ allocation: Record<string, number>, sufficient: boolean }}
 */
export function safeAllocation(
  state,
  enemyFleet,
  { target = CONFIG.combat.winChanceTarget, seed = 1 } = {}
) {
  const owned = Object.entries(state.ships)
    .filter(([, s]) => s.count > 0)
    .sort(([a], [b]) => SHIP_BY_ID[a].attack - SHIP_BY_ID[b].attack);
  const total = owned.reduce((sum, [, s]) => sum + s.count, 0);
  if (total === 0) return { allocation: {}, sufficient: false };

  const prefix = (n) => {
    const allocation = {};
    let left = n;
    for (const [id, { count }] of owned) {
      const take = Math.min(count, left);
      if (take > 0) allocation[id] = take;
      left -= take;
      if (left <= 0) break;
    }
    return allocation;
  };
  const chance = (allocation) =>
    estimateWinChance(allyFleetFromAllocation(state, allocation), enemyFleet, {
      runs: CONFIG.combat.searchRuns,
      seed,
    });

  const everything = prefix(total);
  if (chance(everything) < target) {
    return { allocation: everything, sufficient: false };
  }
  let lo = 1;
  let hi = total;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (chance(prefix(mid)) >= target) hi = mid;
    else lo = mid + 1;
  }
  return { allocation: prefix(lo), sufficient: true };
}
