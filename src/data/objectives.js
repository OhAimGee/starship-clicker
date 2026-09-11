// Objectifs de run. Un seul type pour l'instant (« conquérir tous les
// systèmes à portée »), dont la difficulté dépend du niveau de la faction
// choisie (`state.prestige.factions[id].level`, monte à chaque ascension).
// Volontairement minimal — pas un moteur de quêtes générique — mais pensé
// pour accueillir d'autres types d'objectif plus tard sans réécriture.

import { CONFIG } from './config.js';

export const OBJECTIVES = {
  conquerAll: {
    id: 'conquerAll',
    // nb de systèmes à conquérir pour compléter l'objectif de cette run
    systemCount: (level) =>
      CONFIG.run.baseSystems + Math.floor(level * CONFIG.run.systemsPerLevel),
    // multiplicateur appliqué à la défense des systèmes de cette run
    defenseGrowth: (level) => 1 + level * CONFIG.run.defenseGrowthPerLevel,
  },
};
