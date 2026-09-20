// Résolution de combat — fonctions pures, aucun hasard (voir DÉCISIONS du
// plan « combat réel ») : les pertes dépendent d'une formule déterministe
// sur le ratio marge/puissance, pas d'un tirage. Un échec inflige aussi des
// pertes (plus lourdes qu'une victoire à ratio comparable) mais ne bloque
// jamais durablement la progression — c'est l'appelant (voir
// `Engine#resolvePlanetCombat`) qui garde la planète non conquise
// (retentable), pas cette fonction.

import { CONFIG } from '../data/config.js';
import { SHIP_BY_ID } from '../data/fleet.js';
import {
  prestigeMultipliers,
  factionMultipliers,
  runMultipliers,
  runSkillTreeMultipliers,
  ascensionRewardMultipliers,
} from './economy.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/**
 * Puissance de flotte engagée pour une allocation partielle — même formule
 * que `economy.js#fleetPower`, mais sommée sur `allocation` (un sous-
 * ensemble de la flotte possédée) plutôt que sur `state.ships` en entier.
 * @param {object} state
 * @param {Record<string, number>} allocation - { shipId: nombre engagé }
 */
export function committedFleetPower(state, allocation) {
  let total = 0;
  for (const [id, count] of Object.entries(allocation)) {
    if (!count) continue;
    total += count * SHIP_BY_ID[id].attack;
  }
  const prestige = prestigeMultipliers(state);
  const faction = factionMultipliers(state);
  const run = runMultipliers(state);
  const runSkill = runSkillTreeMultipliers(state);
  const ascensionR = ascensionRewardMultipliers(state);
  return Math.floor(
    total *
      prestige.fleet *
      faction.fleet *
      run.fleet *
      runSkill.fleet *
      ascensionR.fleet
  );
}

/**
 * Allocation minimale qui bat `defenseRating` — pré-remplissage de la popup
 * d'allocation (voir `src/ui/fleet-allocation.js`). On parcourt les types
 * possédés du plus faible au plus fort : chacun est engagé en totalité tant
 * que la puissance cumulée n'atteint pas la défense, puis, pour le type qui
 * l'atteint, on ne prend que le plus petit nombre suffisant. Les gros
 * vaisseaux ne sont donc engagés qu'en dernier recours (moins de pertes
 * coûteuses). `committedFleetPower` fait foi : multiplicateurs et arrondi
 * inclus.
 *
 * Si toute la flotte ne suffit pas, `allocation` est la flotte entière (le
 * comportement historique) et `sufficient` vaut `false`.
 * @param {object} state
 * @param {number} defenseRating
 * @returns {{ allocation: Record<string, number>, sufficient: boolean }}
 */
export function minimumAllocation(state, defenseRating) {
  const owned = Object.entries(state.ships)
    .filter(([, s]) => s.count > 0)
    .sort(([a], [b]) => SHIP_BY_ID[a].attack - SHIP_BY_ID[b].attack);

  const allocation = {};
  for (const [id, { count }] of owned) {
    if (committedFleetPower(state, { ...allocation, [id]: count }) < defenseRating) {
      allocation[id] = count;
      continue;
    }
    // Ce type suffit à lui seul pour finir : plus petit n qui atteint la
    // défense (la puissance engagée croît avec n, donc dichotomie).
    let lo = 1;
    let hi = count;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (committedFleetPower(state, { ...allocation, [id]: mid }) >= defenseRating) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }
    allocation[id] = lo;
    return { allocation, sufficient: true };
  }
  return { allocation, sufficient: false };
}

/**
 * Résout un combat (nœud `invade`/`conquest`) : `allocation` = la flotte
 * engagée sur ce nœud précis (`{ shipId: nombre }`), `defenseRating` = la
 * défense du nœud. Déterministe — mêmes entrées, mêmes pertes, toujours.
 * @returns {{ victory: boolean, committedPower: number, lossFraction: number,
 *   losses: Record<string, number> }}
 */
export function resolveBattle(state, allocation, defenseRating) {
  const committedPower = committedFleetPower(state, allocation);
  const victory = committedPower >= defenseRating;
  const c = CONFIG.combat;

  // Victoire : plus la marge est courte (defenseRating proche de
  // committedPower), plus la fraction perdue grimpe vers `winLossMax` ;
  // écrasante, elle retombe vers le plancher `winLossMin`.
  // Défaite : même logique sur le ratio inverse, mais avec des bornes plus
  // punitives — à engagement comparable, un échec coûte structurellement
  // plus cher qu'une victoire (voir DÉCISIONS du plan).
  const lossFraction = victory
    ? clamp((defenseRating / committedPower) * c.winLossMax, c.winLossMin, c.winLossMax)
    : clamp((committedPower / defenseRating) * c.loseLossMax, c.loseLossMin, c.loseLossMax);

  const losses = {};
  for (const [id, count] of Object.entries(allocation)) {
    if (!count) continue;
    let lost = Math.round(count * lossFraction);
    // Une petite flotte engagée doit risquer quelque chose de réel plutôt
    // que de voir sa perte arrondie systématiquement à 0.
    if (lost === 0 && lossFraction > c.minLossThreshold) lost = 1;
    if (lost > 0) losses[id] = Math.min(lost, count);
  }

  return { victory, committedPower, lossFraction, losses };
}
