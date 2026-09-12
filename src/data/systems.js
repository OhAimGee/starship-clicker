// Exploration : archétypes de systèmes stellaires.
//
// `generateSystems()` (dans src/game/exploration.js) instancie une liste de
// systèmes à partir de ces archétypes, en faisant croître la défense et les
// récompenses avec l'index. Conquérir un système exige `fleetPower >=
// defenseRating` ; il verse ensuite une fraction de ses récompenses par seconde.

export const SYSTEM_NAMES = [
  'Alpha Centauri',
  'Véga',
  'Arcturus',
  'Sirius',
  'Proxima',
  'Bételgeuse',
  'Rigel',
  'Altaïr',
  'Aldébaran',
  'Spica',
  'Polaris',
  'Canopus',
  'Capella',
  'Deneb',
  'Procyon',
  'Fomalhaut',
  'Antarès',
  'Régulus',
  'Bellatrix',
  'Mizar',
  'Alcyone',
];

export const ADVANCED_SYSTEM_NAMES = [
  'Nexus d’Andromède',
  'Colonie Kepler-442',
  'Avant-poste Gliese 667C',
  'Station HD 40307',
  'Havre de Tau Ceti',
  'Forteresse Wolf 1061',
  'Empire TRAPPIST-1',
  'Portail Proxima b',
  'Sanctuaire K2-18',
  'Citadelle TOI-715',
  'Oméga du Centaure',
  'Sagittaire A*',
  'Nébuleuse X-7',
  'Cœur de Matière Noire',
  'Bastion de Kepler-186',
  'Passage de 55 Cancri',
  'Nid de LHS 1140',
  'Faille de Ross 128',
  'Dôme de TOI-700',
  'Confins de GJ 1214',
];

// bonus : multiplicateur appliqué à la récompense de base de chaque ressource.
export const SYSTEM_ARCHETYPES = [
  {
    id: 'mining',
    bonus: { metal: 2.2, energy: 0.7 },
  },
  {
    id: 'energetic',
    bonus: { energy: 2.6, metal: 0.7 },
  },
  {
    id: 'crystalline',
    bonus: { crystals: 3, energy: 1, metal: 1 },
  },
  {
    id: 'balanced',
    bonus: { energy: 1.3, metal: 1.3, crystals: 1.2, influence: 1.4 },
  },
  {
    id: 'hostile',
    bonus: { energy: 1.8, metal: 1.8, crystals: 1.8, antimatter: 1.5 },
    defenseMult: 1.5,
  },
  {
    id: 'diplomatic',
    bonus: { influence: 2.4, energy: 0.9, metal: 0.9 },
  },
  {
    id: 'volatile',
    bonus: { antimatter: 1.6, energy: 1.4, metal: 0.6 },
    defenseMult: 1.3,
  },
];

export const ADVANCED_ARCHETYPES = [
  {
    id: 'antimatterComplex',
    bonus: { antimatter: 5, crystals: 2 },
    defenseMult: 2,
  },
  {
    id: 'quantumStation',
    bonus: { energy: 3, crystals: 2.5, antimatter: 2 },
    defenseMult: 1.8,
  },
  {
    id: 'galacticFortress',
    bonus: { metal: 4, influence: 3 },
    defenseMult: 2.5,
  },
  {
    id: 'tradeHub',
    bonus: { energy: 2, metal: 2, crystals: 2, influence: 2.5 },
    defenseMult: 1.2,
  },
  {
    id: 'cosmicLab',
    bonus: { crystals: 4, antimatter: 3, darkMatter: 0.5 },
    defenseMult: 1.5,
  },
  {
    id: 'voidBastion',
    bonus: { darkMatter: 3, quantumEnergy: 2, antimatter: 1.5 },
    defenseMult: 2.2,
  },
  {
    id: 'darkNexus',
    bonus: { darkMatter: 4, quantumEnergy: 3, energy: 1.5 },
    defenseMult: 2.8,
  },
];

/**
 * Niveau de joueur requis pour accéder au système d'index `index` (voir
 * `game/leveling.js`) — plus un système est loin dans la liste, plus il
 * faut avoir combattu pour y accéder. Croissance volontairement douce (un
 * niveau tous les 2 systèmes) : la plupart des systèmes proches restent
 * atteignables tôt, seuls les plus lointains exigent un vrai palier.
 */
export function requiredLevelForIndex(index) {
  return Math.floor(index / 2);
}

export const EXPLORATION = {
  basicCount: 8,
  advancedCount: 6,
  // récompense de base pour le système d'index i (0-based)
  baseReward: (i) => ({
    energy: (i + 1) * 60,
    metal: (i + 1) * 30,
    crystals: (i + 1) * 12,
    influence: Math.ceil((i + 1) * 1.5),
  }),
  advancedBaseReward: (i) => ({
    energy: (i + 1) * 90,
    metal: (i + 1) * 45,
    crystals: (i + 1) * 22,
    antimatter: Math.ceil((i + 1) / 2),
    influence: Math.ceil((i + 1) / 2),
  }),
  baseDefense: (i) => (i + 1) * 12,
  advancedBaseDefense: (i) => (i + 1) * 22,
};
