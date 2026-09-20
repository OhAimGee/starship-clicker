// Aides de combat : puissance engagée, pré-remplissage de l'allocation et
// multiplicateurs de flotte. La bataille elle-même (rounds, événements,
// pertes) est simulée par `battle.js`, avec une graine aléatoire par
// engagement — voir `Engine#resolvePlanetCombat`.

import { SHIP_BY_ID } from '../data/fleet.js';
import {
  prestigeMultipliers,
  factionMultipliers,
  runMultipliers,
  runSkillTreeMultipliers,
  ascensionRewardMultipliers,
} from './economy.js';

/** Toutes les sources de bonus de flotte de la partie en cours. */
function fleetSources(state) {
  return [
    prestigeMultipliers(state),
    factionMultipliers(state),
    runMultipliers(state),
    runSkillTreeMultipliers(state),
    ascensionRewardMultipliers(state),
  ];
}

/** Multiplicateur de puissance de flotte : s'applique à l'attaque ET aux PV
 * de chaque vaisseau (voir docs/ROADMAP.md — loi de Lanchester : c'est ce
 * qui garde « puissance ≥ défense » vrai en moyenne). */
export function fleetMultiplier(state) {
  return fleetSources(state).reduce((acc, m) => acc * m.fleet, 1);
}

/** Multiplicateur de PV seuls (effet `fleetDurability`), en plus de
 * `fleetMultiplier`. */
export function fleetDurabilityMultiplier(state) {
  return fleetSources(state).reduce((acc, m) => acc * m.fleetDurability, 1);
}

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
  return Math.floor(total * fleetMultiplier(state));
}

/**
 * Allocation minimale qui bat `defenseRating` sur le papier (puissance
 * engagée ≥ défense) — repli déterministe du pré-remplissage : la popup
 * d'allocation (voir `src/ui/fleet-allocation.js`) vise une chance de victoire
 * avec `battle.js#safeAllocation`. On parcourt les types
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
    if (
      committedFleetPower(state, { ...allocation, [id]: count }) < defenseRating
    ) {
      allocation[id] = count;
      continue;
    }
    // Ce type suffit à lui seul pour finir : plus petit n qui atteint la
    // défense (la puissance engagée croît avec n, donc dichotomie).
    let lo = 1;
    let hi = count;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      if (
        committedFleetPower(state, { ...allocation, [id]: mid }) >=
        defenseRating
      ) {
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
