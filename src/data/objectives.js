// Objectifs de run. La difficulté dépend du niveau de la faction choisie
// (`state.prestige.factions[id].level`, monte à chaque ascension). Les
// premiers niveaux utilisent des objectifs rapides (puissance de flotte,
// ressources amassées) qui ne demandent ni vaisseau ni exploration ; les
// niveaux supérieurs basculent sur la conquête de systèmes via la carte à
// nœuds — voir `game/run.js#pickObjective` pour la sélection par niveau.
// Volontairement minimal — pas un moteur de quêtes générique — mais pensé
// pour accueillir d'autres types d'objectif plus tard sans réécriture.

import { CONFIG } from './config.js';

export const OBJECTIVES = {
  conquerAll: {
    id: 'conquerAll',
    // nb de systèmes à conquérir pour compléter l'objectif de cette run
    target: (level) =>
      CONFIG.run.baseSystems + Math.floor(level * CONFIG.run.systemsPerLevel),
    // multiplicateur appliqué à la défense des systèmes de cette run
    defenseGrowth: (level) => 1 + level * CONFIG.run.defenseGrowthPerLevel,
  },
  conquerOne: {
    id: 'conquerOne',
    target: () => 1,
    defenseGrowth: (level) => 1 + level * CONFIG.run.defenseGrowthPerLevel,
  },
  reachFleetPower: {
    id: 'reachFleetPower',
    target: (level) =>
      Math.round(
        CONFIG.run.fleetPowerObjectiveBase *
          (1 + level * CONFIG.run.fleetPowerObjectivePerLevel)
      ),
  },
  gatherResources: {
    id: 'gatherResources',
    resource: CONFIG.run.resourceObjectiveResource,
    target: (level) =>
      Math.round(
        CONFIG.run.resourceObjectiveBase *
          (1 + level * CONFIG.run.resourceObjectivePerLevel)
      ),
  },
};
