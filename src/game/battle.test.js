import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import {
  simulateBattle,
  estimateBattle,
  estimateWinChance,
  safeAllocation,
  allyFleetFromAllocation,
} from './battle.js';
import {
  buildEnemyFleet,
  enemyProfileId,
  enemyFleetForPlanet,
  sizeForAttack,
} from './enemy-fleet.js';
import { seededRng, binomial } from './rng.js';
import { SHIP_BY_ID } from '../data/fleet.js';
import { ENEMY_PROFILE_IDS } from '../data/enemies.js';
import { COMBAT_EVENT_IDS } from '../data/combatEvents.js';

function makeState(factionId = 'miningCollective') {
  const s = createInitialState();
  startRun(s, factionId);
  return s;
}

/** Piles alliées « brutes » (multiplicateur de flotte = 1). */
const fleet = (spec) =>
  Object.entries(spec).map(([id, count]) => {
    const ship = SHIP_BY_ID[id];
    return {
      id,
      count,
      attack: ship.attack,
      hp: ship.hp,
      size: ship.armorTier,
      armor: ship.armorTier,
    };
  });
const power = (f) => f.reduce((sum, u) => sum + u.count * u.attack, 0);

describe('rng', () => {
  it('seededRng est déterministe et dans [0, 1)', () => {
    const a = seededRng(42);
    const b = seededRng(42);
    for (let i = 0; i < 50; i++) {
      const x = a();
      expect(x).toBe(b());
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });

  it('binomial : bornée, et de bonne moyenne à tous les régimes', () => {
    const rng = seededRng(7);
    for (const [n, p] of [
      [10, 0.3],
      [200, 0.5],
      [1000, 0.004],
      [1_000_000, 0.8],
    ]) {
      let sum = 0;
      const runs = 400;
      for (let i = 0; i < runs; i++) {
        const k = binomial(rng, n, p);
        expect(k).toBeGreaterThanOrEqual(0);
        expect(k).toBeLessThanOrEqual(n);
        sum += k;
      }
      const mean = sum / runs;
      expect(Math.abs(mean - n * p) / (n * p)).toBeLessThan(0.15);
    }
  });
});

describe('flottes ennemies', () => {
  it('le budget de défense est intégralement réparti : Σ count × attaque = defenseRating', () => {
    for (const profile of ENEMY_PROFILE_IDS) {
      for (const budget of [0.8, 2.5, 40, 1_500, 90_000, 5e6, 3e9]) {
        const enemy = buildEnemyFleet(budget, profile, 12345);
        const total = enemy.reduce((sum, u) => sum + u.count * u.attack, 0);
        expect(Math.abs(total - budget) / budget, `${profile} ${budget}`).toBeLessThan(1e-9);
        for (const u of enemy) {
          expect(u.count).toBeGreaterThanOrEqual(1);
          expect(u.hp).toBeGreaterThan(0);
          expect(u.size).toBeGreaterThanOrEqual(0);
          expect(u.size).toBeLessThanOrEqual(7);
        }
      }
    }
  });

  it('est déterministe (même graine, même flotte) et varie avec la graine', () => {
    const a = buildEnemyFleet(500, 'garrison', 1);
    expect(buildEnemyFleet(500, 'garrison', 1)).toEqual(a);
    expect(buildEnemyFleet(500, 'garrison', 2)).not.toEqual(a);
  });

  it('la taille d’une unité suit celle du vaisseau de puissance équivalente', () => {
    expect(sizeForAttack(0.1)).toBe(0);
    expect(sizeForAttack(SHIP_BY_ID.cruisers.attack)).toBeCloseTo(1, 9);
    expect(sizeForAttack(SHIP_BY_ID.titans.attack)).toBeCloseTo(3, 9);
    expect(sizeForAttack(1e12)).toBe(7);
    expect(sizeForAttack(1000)).toBeGreaterThan(sizeForAttack(100));
  });

  it('profil : les planètes hostiles sont tenues par la faune, le système 0 par l’Essaim', () => {
    expect(enemyProfileId({ index: 3 }, { id: '3-1', type: 'hostile' })).toBe('wilds');
    expect(enemyProfileId({ index: 0 }, { id: '0-1', type: 'invaded' })).toBe('swarm');
    const profiles = new Set();
    for (let i = 1; i < 60; i++) {
      profiles.add(enemyProfileId({ index: i }, { id: `${i}-0`, type: 'invaded' }));
    }
    expect(profiles).toEqual(new Set(['swarm', 'garrison']));
  });

  it('la flotte d’une planète change à chaque phase, mais pas d’un appel à l’autre', () => {
    const system = { index: 4 };
    const planet = { id: '4-1', type: 'invaded', defenseRating: 300, phasesWon: 0 };
    const first = enemyFleetForPlanet(system, planet);
    expect(enemyFleetForPlanet(system, planet)).toEqual(first);
    expect(enemyFleetForPlanet(system, { ...planet, phasesWon: 1 })).not.toEqual(first);
  });
});

describe('simulateBattle', () => {
  const ally = fleet({ cruisers: 40 });
  const enemy = buildEnemyFleet(power(ally) / 1.2, 'garrison', 9);

  it('est déterministe : mêmes flottes et même graine, même bataille', () => {
    const a = simulateBattle(ally, enemy, { seed: 1234, profileId: 'garrison' });
    const b = simulateBattle(ally, enemy, { seed: 1234, profileId: 'garrison' });
    expect(a).toEqual(b);
    const c = simulateBattle(ally, enemy, { seed: 999, profileId: 'garrison' });
    expect(c.rounds).not.toEqual(a.rounds);
  });

  it('le drapeau `detail` ne change jamais l’issue', () => {
    for (let seed = 1; seed <= 30; seed++) {
      const full = simulateBattle(ally, enemy, { seed });
      const lean = simulateBattle(ally, enemy, { seed, detail: false });
      expect(lean.outcome).toBe(full.outcome);
      expect(lean.losses).toEqual(full.losses);
      expect(lean.rounds).toEqual([]);
    }
  });

  it('conserve les vaisseaux : pertes ≤ engagés, détruits = pertes + récupérés', () => {
    const mixed = fleet({ fighters: 30, cruisers: 12, dreadnoughts: 3 });
    const foe = buildEnemyFleet(power(mixed), 'swarm', 5);
    for (let seed = 1; seed <= 40; seed++) {
      const b = simulateBattle(mixed, foe, { seed });
      for (const u of mixed) {
        const lost = b.losses[u.id] ?? 0;
        const back = b.recovered[u.id] ?? 0;
        expect(lost).toBeLessThanOrEqual(u.count);
        expect(lost + back).toBe(b.destroyed[u.id] ?? 0);
        expect(b.destroyed[u.id] ?? 0).toBeLessThanOrEqual(u.count);
      }
    }
  });

  it('un journal cohérent : rounds numérotés, PV en [0,1], événements connus, dernière ligne = issue', () => {
    const b = simulateBattle(ally, enemy, { seed: 77, profileId: 'garrison' });
    expect(b.rounds.length).toBeGreaterThan(1);
    b.rounds.forEach((r, i) => {
      expect(r.n).toBe(i + 1);
      expect(r.allyHp).toBeGreaterThanOrEqual(0);
      expect(r.allyHp).toBeLessThanOrEqual(1.0001);
      expect(r.enemyHp).toBeGreaterThanOrEqual(0);
      expect(r.enemyHp).toBeLessThanOrEqual(1.0001);
      for (const line of r.lines) {
        if (line.unit) expect(line.unit).toMatch(/^(ship|enemy):/);
        if (!['intro', 'dodged', 'destroyed', 'outcome'].includes(line.id)) {
          expect(COMBAT_EVENT_IDS).toContain(line.id);
        }
      }
    });
    expect(b.rounds[0].lines[0].id).toBe('intro');
    const last = b.rounds.at(-1).lines.at(-1);
    expect(last).toMatchObject({ id: 'outcome', outcome: b.outcome });
  });

  it('se termine toujours (plafond de rounds) et l’issue est cohérente avec les effectifs', () => {
    for (let seed = 1; seed <= 60; seed++) {
      const b = simulateBattle(ally, enemy, { seed });
      expect(b.rounds.length).toBeLessThanOrEqual(40);
      expect(['victory', 'defeat', 'retreat', 'timeout']).toContain(b.outcome);
      expect(b.victory).toBe(b.outcome === 'victory');
      const last = b.rounds.at(-1);
      if (b.outcome === 'victory') expect(last.enemyCount).toBe(0);
      if (b.outcome === 'defeat') expect(last.allyCount).toBe(0);
    }
  });

  it('gère des flottes de plusieurs millions de vaisseaux sans exploser', () => {
    const huge = fleet({ fighters: 3_000_000, cruisers: 1_000_000 });
    const foe = buildEnemyFleet(power(huge) / 3, 'swarm', 3);
    const b = simulateBattle(huge, foe, { seed: 5 });
    expect(b.victory).toBe(true);
  });
});

describe('équilibrage : « puissance ≥ défense » reste vrai en moyenne', () => {
  const RUNS = 80;
  const rate = (spec, profile, ratio) => {
    const a = fleet(spec);
    const foe = buildEnemyFleet(power(a) / ratio, profile, 21);
    return estimateWinChance(a, foe, { runs: RUNS, seed: 3 });
  };
  const SPECS = [
    { fighters: 100 },
    { cruisers: 40 },
    { titans: 8 },
    { fighters: 50, cruisers: 20, dreadnoughts: 4 },
  ];

  it('très supérieur ⇒ victoire quasi certaine ; très inférieur ⇒ défaite quasi certaine', () => {
    for (const profile of ENEMY_PROFILE_IDS) {
      for (const spec of SPECS) {
        expect(rate(spec, profile, 2.5), `${profile} ${JSON.stringify(spec)} ×2,5`).toBeGreaterThanOrEqual(0.95);
        expect(rate(spec, profile, 0.5), `${profile} ${JSON.stringify(spec)} ×0,5`).toBeLessThanOrEqual(0.1);
      }
    }
  });

  it('la chance de victoire croît avec la puissance engagée', () => {
    for (const profile of ENEMY_PROFILE_IDS) {
      const chances = [0.7, 1, 1.3, 1.8].map((r) => rate({ cruisers: 40 }, profile, r));
      for (let i = 1; i < chances.length; i++) {
        expect(chances[i], profile).toBeGreaterThanOrEqual(chances[i - 1] - 0.05);
      }
    }
  });

  it('un multiplicateur de flotte ×k vaut un ennemi ÷k : il s’applique à l’attaque ET aux PV', () => {
    const a = fleet({ cruisers: 40 });
    const boosted = a.map((u) => ({ ...u, attack: u.attack * 3, hp: u.hp * 3 }));
    const foe = buildEnemyFleet(power(a) / 1.3, 'garrison', 4);
    const foe3 = buildEnemyFleet((power(a) / 1.3) * 3, 'garrison', 4);
    const base = estimateWinChance(a, foe, { runs: 150, seed: 8 });
    const scaled = estimateWinChance(boosted, foe3, { runs: 150, seed: 8 });
    expect(Math.abs(base - scaled)).toBeLessThan(0.2);
  });

  it('les gros vaisseaux perdent moins de vaisseaux… et le nombre engagé compte', () => {
    // Même puissance : 100 chasseurs (200) vs 2 cuirassés (50 × ... ) — on ne
    // compare pas les issues mais la granularité : peu de gros vaisseaux =
    // pertes par paliers, beaucoup de petits = pertes diffuses.
    const small = fleet({ fighters: 200 });
    const big = fleet({ dreadnoughts: 16 });
    const foe = buildEnemyFleet(power(small) / 1.5, 'garrison', 2);
    const s = simulateBattle(small, foe, { seed: 4 });
    const g = simulateBattle(big, foe, { seed: 4 });
    const lostSmall = Object.values(s.destroyed).reduce((a, b) => a + b, 0);
    const lostBig = Object.values(g.destroyed).reduce((a, b) => a + b, 0);
    expect(lostSmall).toBeGreaterThan(lostBig);
  });
});

describe('estimateBattle / safeAllocation', () => {
  it('estimateBattle : chance et pertes, stable pour une même graine', () => {
    const a = fleet({ cruisers: 40 });
    const foe = buildEnemyFleet(power(a) / 1.5, 'swarm', 2);
    const one = estimateBattle(a, foe, { runs: 60, seed: 5 });
    expect(estimateBattle(a, foe, { runs: 60, seed: 5 })).toEqual(one);
    expect(one.winChance).toBeGreaterThan(0.5);
    expect(one.lossFraction).toBeGreaterThan(0);
    expect(one.lossFraction).toBeLessThan(1);
    expect(estimateBattle([], foe)).toEqual({ winChance: 0, lossFraction: 0 });
  });

  it('safeAllocation : la plus petite flotte qui atteint la cible, petits vaisseaux d’abord', () => {
    const s = makeState();
    s.ships.fighters.count = 300;
    s.ships.cruisers.count = 60;
    const foe = buildEnemyFleet(120, 'swarm', 11);
    const { allocation, sufficient } = safeAllocation(s, foe, { target: 0.8, seed: 2 });
    expect(sufficient).toBe(true);
    // Ordre « moins puissants d'abord » : jamais de croiseurs tant que les chasseurs ne sont pas tous engagés.
    if (allocation.cruisers) expect(allocation.fighters).toBe(300);
    const chance = estimateWinChance(allyFleetFromAllocation(s, allocation), foe, { runs: 200, seed: 2 });
    expect(chance).toBeGreaterThan(0.7);
    // Minimale : un vaisseau en moins de la dernière pile fait retomber sous la cible (à la marge du bruit près).
    const lastId = Object.keys(allocation).at(-1);
    if (allocation[lastId] > 3) {
      const fewer = { ...allocation, [lastId]: Math.floor(allocation[lastId] * 0.5) };
      const worse = estimateWinChance(allyFleetFromAllocation(s, fewer), foe, { runs: 200, seed: 2 });
      expect(worse).toBeLessThan(chance);
    }
  });

  it('flotte insuffisante : toute la flotte, marquée insuffisante ; sans vaisseau : vide', () => {
    const s = makeState();
    s.ships.fighters.count = 5;
    const foe = buildEnemyFleet(1e6, 'garrison', 3);
    expect(safeAllocation(s, foe)).toEqual({ allocation: { fighters: 5 }, sufficient: false });
    const empty = makeState();
    expect(safeAllocation(empty, foe)).toEqual({ allocation: {}, sufficient: false });
  });

  it('multiplicateurs : la puissance de flotte s’applique à l’attaque et aux PV des piles alliées', () => {
    const legion = makeState('ironLegion'); // +20 % de puissance de flotte
    const [pile] = allyFleetFromAllocation(legion, { fighters: 10 });
    expect(pile.attack).toBeCloseTo(SHIP_BY_ID.fighters.attack * 1.2, 9);
    expect(pile.hp).toBeCloseTo(SHIP_BY_ID.fighters.hp * 1.2, 9);
    legion.run.skillTree.reinforcedHulls.level = 3;
    const [tough] = allyFleetFromAllocation(legion, { fighters: 10 });
    expect(tough.attack).toBeCloseTo(pile.attack, 9);
    expect(tough.hp).toBeGreaterThan(pile.hp);
  });
});
