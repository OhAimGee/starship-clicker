// Flotte spatiale. `attack` alimente la puissance de flotte (exploration).
// `maintenance` est payée en énergie chaque seconde ; en cas de déficit, une
// partie de la flotte est perdue (voir CONFIG.maintenanceAttritionRate).
//
// Coût du n-ième vaisseau : chaque ressource du coût est multipliée par
// CONFIG.shipCostGrowth ** count.
//
// Combat vivant (voir game/battle.js) :
//  - `hp` : points de structure d'UN vaisseau, = attaque × (3,2 + 0,12 × taille)
//    (règle testée, voir CONFIG.combat) : un petit vaisseau est peu cher et
//    fragile, un gros est cher et solide — mais à puissance égale, la même
//    quantité de PV « effectifs » (l'esquive des petits compense).
//  - `armorTier` (0-7) : taille du vaisseau. Il sert de calibre au tireur, de
//    blindage à la cible et fixe l'esquive : un petit calibre touche mal un
//    gros blindage, un gros tir gaspille une partie de sa puissance sur une
//    petite cible. Exprimé en palier (pas en valeur absolue) pour rester
//    insensible aux multiplicateurs de flotte.

export const SHIPS = [
  {
    id: 'fighters',
    cost: { energy: 200, metal: 100 },
    attack: 2,
    armorTier: 0,
    hp: 6,
    maintenance: 1,
    tier: 1,
  },
  {
    id: 'cruisers',
    cost: { energy: 1000, metal: 500, crystals: 60 },
    attack: 6,
    armorTier: 1,
    hp: 20,
    maintenance: 3,
    tier: 1,
    unlock: { resource: 'crystals', total: 40 },
  },
  {
    id: 'dreadnoughts',
    cost: { energy: 4000, metal: 2000, crystals: 250, antimatter: 12 },
    attack: 25,
    armorTier: 2,
    hp: 86,
    maintenance: 10,
    tier: 2,
    unlock: { resource: 'antimatter', total: 10 },
  },
  {
    id: 'titans',
    cost: { energy: 15000, metal: 7500, crystals: 1200, antimatter: 60 },
    attack: 110,
    armorTier: 3,
    hp: 392,
    maintenance: 25,
    tier: 2,
    unlock: { resource: 'antimatter', total: 80 },
  },
  {
    id: 'motherships',
    cost: {
      energy: 60000,
      metal: 30000,
      crystals: 6000,
      antimatter: 250,
      influence: 12,
    },
    attack: 550,
    armorTier: 4,
    hp: 2024,
    maintenance: 55,
    tier: 3,
    unlock: { resource: 'influence', total: 20 },
  },
  {
    id: 'worldBurners',
    cost: {
      energy: 300000,
      metal: 150000,
      crystals: 30000,
      antimatter: 1200,
      darkMatter: 6,
    },
    attack: 2800,
    armorTier: 5,
    hp: 10_640,
    maintenance: 110,
    tier: 4,
    unlock: { resource: 'darkMatter', total: 3 },
  },
  {
    id: 'voidCrusaders',
    cost: {
      energy: 1_200_000,
      metal: 600_000,
      crystals: 120_000,
      antimatter: 6000,
      darkMatter: 30,
      quantumEnergy: 2,
    },
    attack: 11_000,
    armorTier: 6,
    hp: 43_120,
    maintenance: 220,
    tier: 4,
    unlock: { resource: 'quantumEnergy', total: 5 },
  },
  {
    id: 'realityShifters',
    cost: {
      energy: 6_000_000,
      metal: 3_000_000,
      crystals: 600_000,
      antimatter: 30_000,
      darkMatter: 120,
      quantumEnergy: 12,
    },
    attack: 55_000,
    armorTier: 7,
    hp: 222_200,
    maintenance: 550,
    tier: 4,
    unlock: { resource: 'quantumEnergy', total: 30 },
  },
];

export const SHIP_IDS = SHIPS.map((s) => s.id);
export const SHIP_BY_ID = Object.fromEntries(SHIPS.map((s) => [s.id, s]));
