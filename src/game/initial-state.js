// Point de vérité unique de l'état de départ.
//
// Avant la refonte, cet objet était dupliqué à l'identique dans le constructeur
// ET dans `resetGame()` de `script.js` — les deux copies avaient déjà divergé
// (coûts d'améliorations de prestige, production de `realityEngine`…). Toute
// initialisation ou remise à zéro passe désormais par `createInitialState()`.

/** Version du schéma de sauvegarde. À incrémenter à chaque changement de forme
 *  de l'état qui nécessite une migration (voir `save.js`). */
export const SCHEMA_VERSION = 1;

/** @returns {object} un état de jeu neuf, sans aucune référence partagée. */
export function createInitialState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    savedAt: Date.now(),

    resources: {
      energy: 0,
      metal: 0,
      crystals: 0,
      antimatter: 0,
      influence: 0,
      darkMatter: 0,
      quantumEnergy: 0,
      ascensionPoints: 0,
    },
    clickPower: 1,
    totalEnergyGenerated: 0,
    civilizationLevel: 1,
    explorationProgress: 0,

    generators: {
      solarPanel: { count: 0, cost: 10, production: 1, resource: 'energy' },
      miningDrone: { count: 0, cost: 25, production: 1, resource: 'metal' },
      crystalExtractor: {
        count: 0,
        cost: 50,
        production: 1,
        resource: 'crystals',
        costResource: 'metal',
      },
      fusionReactor: {
        count: 0,
        cost: 100,
        production: 10,
        resource: 'energy',
        costResource: 'crystals',
      },
      antimatterGenerator: {
        count: 0,
        cost: 500,
        production: 1,
        resource: 'antimatter',
        costResource: 'crystals',
      },
      quantumHarvester: {
        count: 0,
        cost: 1000,
        production: 5,
        resource: 'antimatter',
        costResource: 'energy',
      },
      stellarForge: {
        count: 0,
        cost: 2000,
        production: 50,
        resource: 'metal',
        costResource: 'antimatter',
      },
      dimensionalRift: {
        count: 0,
        cost: 5000,
        production: 25,
        resource: 'crystals',
        costResource: 'antimatter',
      },
      darkMatterCollector: {
        count: 0,
        cost: 25000,
        production: 1,
        resource: 'darkMatter',
        costResource: 'antimatter',
      },
      quantumResonator: {
        count: 0,
        cost: 100000,
        production: 5,
        resource: 'quantumEnergy',
        costResource: 'darkMatter',
      },
      voidHarvester: {
        count: 0,
        cost: 500000,
        production: 100,
        resource: 'energy',
        costResource: 'quantumEnergy',
      },
      cosmicFurnace: {
        count: 0,
        cost: 1000000,
        production: 200,
        resource: 'metal',
        costResource: 'quantumEnergy',
      },
      realityEngine: {
        count: 0,
        cost: 5000000,
        production: 500,
        resource: 'crystals',
        costResource: 'quantumEnergy',
      },
    },

    upgrades: {
      clickUpgrade: { level: 0, cost: 15, multiplier: 1.5 },
      autoClicker: { count: 0, cost: 200, multiplier: 2 },
      prestigeMultiplier: { level: 0, cost: 1000, multiplier: 2.0 },
      quantumCore: { level: 0, cost: 50000, multiplier: 1.5 },
      darkMatterBooster: { level: 0, cost: 250000, multiplier: 3.0 },
      cosmicAscension: { level: 0, cost: 1000000, multiplier: 5.0 },
    },

    fleet: {
      fighters: {
        count: 0,
        cost: { energy: 150, metal: 75 },
        attack: 1,
        maintenance: 1,
      },
      cruisers: {
        count: 0,
        cost: { energy: 800, metal: 400, crystals: 50 },
        attack: 5,
        maintenance: 3,
      },
      dreadnoughts: {
        count: 0,
        cost: { energy: 3000, metal: 1500, crystals: 200, antimatter: 10 },
        attack: 25,
        maintenance: 10,
      },
      titans: {
        count: 0,
        cost: { energy: 10000, metal: 5000, crystals: 1000, antimatter: 50 },
        attack: 100,
        maintenance: 25,
      },
      motherships: {
        count: 0,
        cost: {
          energy: 50000,
          metal: 25000,
          crystals: 5000,
          antimatter: 200,
          influence: 10,
        },
        attack: 500,
        maintenance: 50,
      },
      worldBurners: {
        count: 0,
        cost: {
          energy: 250000,
          metal: 125000,
          crystals: 25000,
          antimatter: 1000,
          darkMatter: 5,
        },
        attack: 2500,
        maintenance: 100,
      },
      voidCrusaders: {
        count: 0,
        cost: {
          energy: 1000000,
          metal: 500000,
          crystals: 100000,
          antimatter: 5000,
          darkMatter: 25,
          quantumEnergy: 1,
        },
        attack: 10000,
        maintenance: 200,
      },
      realityShifters: {
        count: 0,
        cost: {
          energy: 5000000,
          metal: 2500000,
          crystals: 500000,
          antimatter: 25000,
          darkMatter: 100,
          quantumEnergy: 10,
        },
        attack: 50000,
        maintenance: 500,
      },
    },

    conqueredSystems: [],
    availableSystems: [],

    technologies: {
      advancedPropulsion: {
        unlocked: false,
        cost: { crystals: 200, antimatter: 5 },
        effect: 'Reduit le cout des vaisseaux de 20%',
      },
      quantumComputing: {
        unlocked: false,
        cost: { crystals: 500, antimatter: 15 },
        effect: 'Augmente la production de tous les generateurs de 50%',
      },
      neuralNetworks: {
        unlocked: false,
        cost: { crystals: 1000, antimatter: 50 },
        effect: 'Auto-ameliore les generateurs',
      },
      warpDrive: {
        unlocked: false,
        cost: { antimatter: 100, influence: 10 },
        effect: "Debloque l'exploration de nouveaux systemes",
      },
      energyEfficiency: {
        unlocked: false,
        cost: { energy: 50000, crystals: 300 },
        effect: 'Reduit la maintenance de la flotte de 30%',
      },
      hyperSpace: {
        unlocked: false,
        cost: { antimatter: 200, influence: 25 },
        effect: "Double les recompenses d'exploration",
      },
      nanotechnology: {
        unlocked: false,
        cost: { crystals: 2000, antimatter: 150 },
        effect: 'Les generateurs se reparent automatiquement',
      },
      artificialIntelligence: {
        unlocked: false,
        cost: { antimatter: 500, influence: 50 },
        effect: 'Optimise automatiquement la production',
      },
      darkMatterPhysics: {
        unlocked: false,
        cost: { antimatter: 2500, darkMatter: 1 },
        effect: 'Debloque la manipulation de la matiere noire',
      },
      quantumEntanglement: {
        unlocked: false,
        cost: { darkMatter: 10, quantumEnergy: 1 },
        effect: 'Production instantanee pour tous les generateurs',
      },
      voidTechnology: {
        unlocked: false,
        cost: { darkMatter: 50, quantumEnergy: 5 },
        effect: 'Acces aux technologies du vide cosmique',
      },
      realityManipulation: {
        unlocked: false,
        cost: { quantumEnergy: 25, ascensionPoints: 1 },
        effect: 'Controle de la realite - bonus x10 a tout',
      },
      cosmicAscension: {
        unlocked: false,
        cost: { quantumEnergy: 100, ascensionPoints: 5 },
        effect: 'Transcendance cosmique - prestige ameliore',
      },
    },

    prestige: {
      totalAscensions: 0,
      permanentBonuses: {
        clickMultiplier: 1,
        productionMultiplier: 1,
        fleetPowerMultiplier: 1,
      },
      lifetimeResources: {
        energy: 0,
        metal: 0,
        crystals: 0,
        antimatter: 0,
        influence: 0,
      },
    },

    eventSystem: {
      lastEventTime: 0,
      eventCooldown: 60000,
      activeEvent: null,
    },
  };
}
