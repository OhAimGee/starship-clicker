// État de départ, entièrement construit à partir des données de `src/data/`.
// L'état ne stocke QUE ce qui varie (compteurs, niveaux, flags). Les
// définitions (coûts, taux, effets) vivent dans les données.

import { RESOURCE_IDS } from '../data/resources.js';
import { GENERATOR_IDS } from '../data/generators.js';
import { SHIP_IDS } from '../data/fleet.js';
import { TECH_IDS } from '../data/technologies.js';
import { CLICK_UPGRADES, PRESTIGE_UPGRADES } from '../data/upgrades.js';

// v1 = schéma monolithique d'avant la refonte (généré par l'ancien script.js).
// v2 = schéma piloté par les données.
export const SCHEMA_VERSION = 2;

const zeroMap = (keys) => Object.fromEntries(keys.map((k) => [k, 0]));

/** @returns {object} un état neuf, sans référence partagée. */
export function createInitialState() {
  const now = Date.now();
  return {
    schemaVersion: SCHEMA_VERSION,
    savedAt: now,
    createdAt: now,
    lang: 'fr',

    resources: zeroMap(RESOURCE_IDS),
    totalProduced: zeroMap(RESOURCE_IDS), // cumul « à vie » (sert aux déblocages)
    totalClicks: 0,
    clickPowerBase: 1,
    civilizationLevel: 1,

    generators: Object.fromEntries(
      GENERATOR_IDS.map((id) => [id, { count: 0 }])
    ),
    ships: Object.fromEntries(SHIP_IDS.map((id) => [id, { count: 0 }])),
    clickUpgrades: Object.fromEntries(
      CLICK_UPGRADES.map((u) => [u.id, { level: 0 }])
    ),
    technologies: Object.fromEntries(
      TECH_IDS.map((id) => [id, { unlocked: false }])
    ),

    prestige: {
      ascensions: 0,
      upgrades: Object.fromEntries(
        PRESTIGE_UPGRADES.map((u) => [u.id, { level: 0 }])
      ),
      lifetime: { energy: 0 }, // énergie produite sur toutes les vies
    },

    exploration: {
      available: [],
      conquered: [],
      advancedUnlocked: false,
    },

    events: { lastAt: 0, accumMs: 0 },
  };
}
