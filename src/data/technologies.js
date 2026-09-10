// Arbre technologique. Achat unique (recherche). Les effets sont des
// modificateurs typés interprétés par le moteur (`src/game/economy.js`), au lieu
// des chaînes descriptives + `if (tech.unlocked)` éparpillés de l'ancien code.
//
// Types de modificateurs :
//   generatorProduction   { mult }                  production globale des générateurs
//   resourceProduction    { resource, mult }        production d'une ressource précise
//   shipCost              { mult }                   coût de construction des vaisseaux
//   fleetMaintenance      { mult }                   maintenance de la flotte
//   explorationIncome     { mult }                   revenu passif des systèmes conquis
//   clickPower            { mult }                   pouvoir de clic
//   autoBuyGenerators     {}                         auto-achat des générateurs
//   unlockAdvancedSystems {}                         débloque les systèmes avancés
//
// Les multiplicateurs de même type se cumulent en produit.

export const TECHNOLOGIES = [
  {
    id: 'advancedPropulsion',
    icon: '🚀',
    cost: { crystals: 500, antimatter: 10 },
    effects: [{ type: 'shipCost', mult: 0.85 }],
    unlock: { resource: 'antimatter', total: 5 },
  },
  {
    id: 'quantumComputing',
    icon: '💻',
    cost: { crystals: 1500, antimatter: 30 },
    effects: [{ type: 'generatorProduction', mult: 1.5 }],
    unlock: { resource: 'antimatter', total: 15 },
  },
  {
    id: 'neuralNetworks',
    icon: '🧠',
    cost: { crystals: 4000, antimatter: 80 },
    effects: [{ type: 'autoBuyGenerators' }],
    unlock: { resource: 'antimatter', total: 40 },
  },
  {
    id: 'warpDrive',
    icon: '🌌',
    cost: { antimatter: 150, influence: 15 },
    effects: [{ type: 'unlockAdvancedSystems' }],
    unlock: { resource: 'influence', total: 10 },
  },
  {
    id: 'energyEfficiency',
    icon: '🔋',
    cost: { energy: 80_000, crystals: 800 },
    effects: [{ type: 'fleetMaintenance', mult: 0.7 }],
    unlock: { resource: 'antimatter', total: 15 },
  },
  {
    id: 'hyperSpace',
    icon: '🌠',
    cost: { antimatter: 400, influence: 40 },
    effects: [{ type: 'explorationIncome', mult: 2 }],
    unlock: { resource: 'influence', total: 25 },
  },
  {
    id: 'nanotechnology',
    icon: '🔬',
    cost: { crystals: 6000, antimatter: 200 },
    effects: [{ type: 'generatorProduction', mult: 1.3 }],
    unlock: { resource: 'antimatter', total: 120 },
  },
  {
    id: 'artificialIntelligence',
    icon: '🤖',
    cost: { antimatter: 800, influence: 80 },
    effects: [{ type: 'generatorProduction', mult: 1.25 }],
    unlock: { resource: 'influence', total: 50 },
  },
  {
    id: 'darkMatterPhysics',
    icon: '🌑',
    cost: { antimatter: 5000, influence: 200 },
    effects: [{ type: 'resourceProduction', resource: 'darkMatter', mult: 2 }],
    unlock: { resource: 'antimatter', total: 2000 },
  },
  {
    id: 'quantumEntanglement',
    icon: '🔮',
    cost: { darkMatter: 20, quantumEnergy: 2 },
    effects: [
      { type: 'resourceProduction', resource: 'quantumEnergy', mult: 2 },
    ],
    unlock: { resource: 'darkMatter', total: 10 },
  },
  {
    id: 'voidTechnology',
    icon: '⚫',
    cost: { darkMatter: 80, quantumEnergy: 8 },
    effects: [{ type: 'generatorProduction', mult: 3 }],
    unlock: { resource: 'quantumEnergy', total: 5 },
  },
  {
    id: 'realityManipulation',
    icon: '✨',
    cost: { quantumEnergy: 40, ascensionPoints: 2 },
    effects: [
      { type: 'generatorProduction', mult: 5 },
      { type: 'clickPower', mult: 5 },
    ],
    unlock: { resource: 'ascensionPoints', total: 1 },
  },
];

export const TECH_IDS = TECHNOLOGIES.map((t) => t.id);
export const TECH_BY_ID = Object.fromEntries(
  TECHNOLOGIES.map((t) => [t.id, t])
);
