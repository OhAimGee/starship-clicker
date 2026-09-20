// Générateurs automatiques.
//
// Chaîne de conversion : chaque générateur DÉPENSE une ressource (`costResource`)
// pour en PRODUIRE une autre (`resource`). Toute ressource non-énergie possède
// au moins une source (l'ancien jeu laissait « influence » sans générateur, ce
// qui pouvait bloquer l'accès à certaines technos).
//
// Coût du n-ième exemplaire : round(baseCost * costGrowth ** count).
// `rate` = production par seconde et par exemplaire.
// `unlock` : { resource, total } => visible quand `totalProduced[resource] >=
// total` ; { tech } => visible quand la techno est recherchée. Absent = dès le
// départ. Les déblocages sont monotones (jamais re-verrouillés).
//
// La courbe vise un temps de retour sur investissement de quelques minutes en
// début de partie, qui s'allonge doucement par palier (validé par simulation :
// première ascension ~2h20 de jeu optimisé, la suivante ~40 min).

export const GENERATORS = [
  // — Palier 1 : socle énergétique ————————————————————————————————
  {
    id: 'solarPanel',
    resource: 'energy',
    costResource: 'energy',
    baseCost: 15,
    costGrowth: 1.15,
    rate: 0.5,
    tier: 1,
  },
  {
    id: 'miningDrone',
    resource: 'metal',
    costResource: 'energy',
    baseCost: 50,
    costGrowth: 1.15,
    rate: 0.3,
    tier: 1,
  },

  // — Palier 2 : cristaux & meilleure énergie ——————————————————————
  {
    id: 'crystalExtractor',
    resource: 'crystals',
    costResource: 'metal',
    baseCost: 150,
    costGrowth: 1.15,
    rate: 0.2,
    tier: 2,
    unlock: { resource: 'metal', total: 40 },
  },
  {
    id: 'fusionReactor',
    resource: 'energy',
    costResource: 'crystals',
    baseCost: 400,
    costGrowth: 1.15,
    rate: 5,
    tier: 2,
    unlock: { resource: 'crystals', total: 25 },
  },
  {
    id: 'stellarForge',
    resource: 'metal',
    costResource: 'crystals',
    baseCost: 900,
    costGrowth: 1.15,
    rate: 3,
    tier: 2,
    unlock: { resource: 'crystals', total: 80 },
  },

  // — Palier 3 : antimatière & influence ——————————————————————————
  {
    id: 'antimatterGenerator',
    resource: 'antimatter',
    costResource: 'crystals',
    baseCost: 3000,
    costGrowth: 1.16,
    rate: 0.1,
    tier: 3,
    unlock: { resource: 'crystals', total: 400 },
  },
  {
    id: 'senateArchive',
    resource: 'influence',
    costResource: 'crystals',
    baseCost: 2500,
    costGrowth: 1.17,
    rate: 0.05,
    tier: 3,
    unlock: { resource: 'crystals', total: 400 },
  },
  {
    // Deuxième source d'influence, payée en métal : une autre chaîne que les
    // Archives du Sénat (cristaux).
    id: 'embassy',
    resource: 'influence',
    costResource: 'metal',
    baseCost: 9000,
    costGrowth: 1.16,
    rate: 0.12,
    tier: 3,
    unlock: { resource: 'influence', total: 8 },
  },
  {
    id: 'quantumHarvester',
    resource: 'antimatter',
    costResource: 'energy',
    baseCost: 6000,
    costGrowth: 1.15,
    rate: 0.6,
    tier: 3,
    unlock: { resource: 'antimatter', total: 20 },
  },
  {
    id: 'dimensionalRift',
    resource: 'crystals',
    costResource: 'antimatter',
    baseCost: 12000,
    costGrowth: 1.15,
    rate: 8,
    tier: 3,
    unlock: { resource: 'antimatter', total: 50 },
  },

  // — Palier 4 : matière noire, énergie quantique ————————————————————
  {
    id: 'darkMatterCollector',
    resource: 'darkMatter',
    costResource: 'antimatter',
    baseCost: 8000,
    costGrowth: 1.18,
    rate: 0.08,
    tier: 4,
    unlock: { tech: 'darkMatterPhysics' },
  },
  {
    id: 'quantumResonator',
    resource: 'quantumEnergy',
    costResource: 'darkMatter',
    baseCost: 12000,
    costGrowth: 1.18,
    rate: 0.2,
    tier: 4,
    unlock: { resource: 'darkMatter', total: 5 },
  },
  {
    // Influence payée en antimatière.
    id: 'treatyBureau',
    resource: 'influence',
    costResource: 'antimatter',
    baseCost: 15000,
    costGrowth: 1.17,
    rate: 0.5,
    tier: 4,
    unlock: { resource: 'influence', total: 120 },
  },
  {
    // Énergie quantique sans passer par la matière noire (le goulot du
    // Résonateur) : payée en antimatière.
    id: 'particleCollider',
    resource: 'quantumEnergy',
    costResource: 'antimatter',
    baseCost: 150000,
    costGrowth: 1.17,
    rate: 0.25,
    tier: 4,
    unlock: { resource: 'antimatter', total: 5000 },
  },
  {
    // Première utilisation de l'influence comme monnaie de construction :
    // des recherches interdites du Sénat produisent de la matière noire.
    id: 'forbiddenArchive',
    resource: 'darkMatter',
    costResource: 'influence',
    baseCost: 3000,
    costGrowth: 1.2,
    rate: 0.1,
    tier: 4,
    unlock: { resource: 'influence', total: 400 },
  },
  {
    id: 'voidHarvester',
    resource: 'energy',
    costResource: 'quantumEnergy',
    baseCost: 300000,
    costGrowth: 1.15,
    rate: 250,
    tier: 4,
    unlock: { resource: 'quantumEnergy', total: 10 },
  },
  {
    id: 'cosmicFurnace',
    resource: 'metal',
    costResource: 'quantumEnergy',
    baseCost: 400000,
    costGrowth: 1.15,
    rate: 180,
    tier: 4,
    unlock: { resource: 'quantumEnergy', total: 10 },
  },
  {
    id: 'realityEngine',
    resource: 'crystals',
    costResource: 'quantumEnergy',
    baseCost: 600000,
    costGrowth: 1.15,
    rate: 220,
    tier: 4,
    unlock: { resource: 'quantumEnergy', total: 25 },
  },

  // — Palier 5 : conversion de pointe (boucle fermée post-ascension) ————
  {
    id: 'hypermatterCondenser',
    resource: 'antimatter',
    costResource: 'quantumEnergy',
    baseCost: 8_000_000,
    costGrowth: 1.15,
    rate: 3000,
    tier: 5,
    unlock: { resource: 'quantumEnergy', total: 500 },
  },
  {
    id: 'voidLoom',
    resource: 'darkMatter',
    costResource: 'quantumEnergy',
    baseCost: 12_000_000,
    costGrowth: 1.15,
    rate: 40,
    tier: 5,
    unlock: { resource: 'quantumEnergy', total: 800 },
  },
  {
    // Le Tribunal siège au sommet : il se paie en énergie quantique.
    id: 'galacticTribunal',
    resource: 'influence',
    costResource: 'quantumEnergy',
    baseCost: 10_000_000,
    costGrowth: 1.15,
    rate: 20,
    tier: 5,
    unlock: { resource: 'quantumEnergy', total: 1000 },
  },
  {
    // Énergie ordinaire convertie en énergie quantique.
    id: 'zeroPointExtractor',
    resource: 'quantumEnergy',
    costResource: 'energy',
    baseCost: 5_000_000_000,
    costGrowth: 1.16,
    rate: 2,
    tier: 5,
    unlock: { resource: 'darkMatter', total: 400 },
  },
];

export const GENERATOR_IDS = GENERATORS.map((g) => g.id);
export const GENERATOR_BY_ID = Object.fromEntries(
  GENERATORS.map((g) => [g.id, g])
);
