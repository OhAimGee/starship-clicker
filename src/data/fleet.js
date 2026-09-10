// Flotte spatiale. `attack` alimente la puissance de flotte (exploration).
// `maintenance` est payée en énergie chaque seconde ; en cas de déficit, une
// partie de la flotte est perdue (voir CONFIG.maintenanceAttritionRate).
//
// Coût du n-ième vaisseau : chaque ressource du coût est multipliée par
// CONFIG.shipCostGrowth ** count.

export const SHIPS = [
  {
    id: 'fighters',
    icon: '🛩️',
    cost: { energy: 200, metal: 100 },
    attack: 2,
    maintenance: 1,
    tier: 1,
  },
  {
    id: 'cruisers',
    icon: '🚀',
    cost: { energy: 1000, metal: 500, crystals: 60 },
    attack: 6,
    maintenance: 3,
    tier: 1,
    unlock: { resource: 'crystals', total: 40 },
  },
  {
    id: 'dreadnoughts',
    icon: '🛰️',
    cost: { energy: 4000, metal: 2000, crystals: 250, antimatter: 12 },
    attack: 25,
    maintenance: 10,
    tier: 2,
    unlock: { resource: 'antimatter', total: 10 },
  },
  {
    id: 'titans',
    icon: '⚔️',
    cost: { energy: 15000, metal: 7500, crystals: 1200, antimatter: 60 },
    attack: 110,
    maintenance: 25,
    tier: 2,
    unlock: { resource: 'antimatter', total: 80 },
  },
  {
    id: 'motherships',
    icon: '🛸',
    cost: {
      energy: 60000,
      metal: 30000,
      crystals: 6000,
      antimatter: 250,
      influence: 12,
    },
    attack: 550,
    maintenance: 55,
    tier: 3,
    unlock: { resource: 'influence', total: 20 },
  },
  {
    id: 'worldBurners',
    icon: '☄️',
    cost: {
      energy: 300000,
      metal: 150000,
      crystals: 30000,
      antimatter: 1200,
      darkMatter: 6,
    },
    attack: 2800,
    maintenance: 110,
    tier: 4,
    unlock: { resource: 'darkMatter', total: 3 },
  },
  {
    id: 'voidCrusaders',
    icon: '🌠',
    cost: {
      energy: 1_200_000,
      metal: 600_000,
      crystals: 120_000,
      antimatter: 6000,
      darkMatter: 30,
      quantumEnergy: 2,
    },
    attack: 11_000,
    maintenance: 220,
    tier: 4,
    unlock: { resource: 'quantumEnergy', total: 5 },
  },
  {
    id: 'realityShifters',
    icon: '🌌',
    cost: {
      energy: 6_000_000,
      metal: 3_000_000,
      crystals: 600_000,
      antimatter: 30_000,
      darkMatter: 120,
      quantumEnergy: 12,
    },
    attack: 55_000,
    maintenance: 550,
    tier: 4,
    unlock: { resource: 'quantumEnergy', total: 30 },
  },
];

export const SHIP_IDS = SHIPS.map((s) => s.id);
export const SHIP_BY_ID = Object.fromEntries(SHIPS.map((s) => [s.id, s]));
