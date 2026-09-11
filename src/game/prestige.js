// Ascension (prestige).

import { CONFIG } from '../data/config.js';
import { GENERATOR_IDS } from '../data/generators.js';
import { SHIP_IDS } from '../data/fleet.js';
import { RESOURCE_IDS } from '../data/resources.js';
import { regenerateSystems } from './exploration.js';

export function canAscend(state) {
  return state.resources.quantumEnergy >= CONFIG.ascension.quantumCost;
}

export function potentialPoints(state) {
  return Math.floor(
    state.resources.quantumEnergy / CONFIG.ascension.pointsDivisor
  );
}

/**
 * Effectue l'ascension : +points, +1 ascension, remise à zéro partielle.
 * Conservés : technologies recherchées, améliorations de prestige, points
 * d'ascension, systèmes conservés ? Non — l'exploration est réinitialisée.
 * @returns {{ points: number }}
 */
export function ascend(state) {
  const points = potentialPoints(state);

  state.prestige.lifetime.energy += state.totalProduced.energy;
  state.prestige.ascensions += 1;

  // Ressources : tout à zéro sauf les points d'ascension (on ajoute les gains).
  const keptAscensionPoints = state.resources.ascensionPoints + points;
  for (const res of RESOURCE_IDS) state.resources[res] = 0;
  state.resources.ascensionPoints = keptAscensionPoints;

  // Petit capital de redémarrage, proportionnel au nombre d'ascensions.
  for (const [res, amount] of Object.entries(CONFIG.ascension.restartGrant)) {
    state.resources[res] = amount * state.prestige.ascensions;
  }

  // Cumul « à vie » remis à zéro (les déblocages se refont — progression rapide
  // grâce aux bonus permanents).
  for (const res of RESOURCE_IDS) state.totalProduced[res] = 0;

  for (const id of GENERATOR_IDS) state.generators[id].count = 0;
  for (const id of SHIP_IDS) state.ships[id].count = 0;
  state.clickPowerBase = 1;
  state.clickUpgrades.clickPower.level = 0;
  state.clickUpgrades.autoClicker.count = 0;
  state.civilizationLevel = 1;

  state.run.exploration.conquered = [];
  // Les technos sont conservées : les systèmes avancés restent débloqués si
  // warpDrive a déjà été recherché.
  state.run.exploration.advancedUnlocked = !!state.technologies.warpDrive?.unlocked;
  regenerateSystems(state);

  state.events = { lastAt: 0, accumMs: 0 };

  return { points };
}
