// Résolution de combat — fonctions pures, aucun hasard (voir DÉCISIONS du
// plan « combat réel ») : les pertes dépendent d'une formule déterministe
// sur le ratio marge/puissance, pas d'un tirage. Un échec inflige aussi des
// pertes (plus lourdes qu'une victoire à ratio comparable) mais ne bloque
// jamais durablement la progression — c'est `nodemap.js#resolveNode` qui
// garde le nœud non résolu (retentable), pas cette fonction.

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
