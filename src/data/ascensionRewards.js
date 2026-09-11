// Récompenses d'Ascension (rare, New Game+) — voir `game/prestige.js#ascend`.
// Réutilise exactement le vocabulaire d'effet des compétences de faction/de
// l'arbre commun (`economy.js#applyLeveledEffect`) : aucun nouveau type
// d'effet. `perLevel` nettement plus généreux (une Ascension est rare :
// ~1 récompense gagnée par Ascension, contre plusieurs compétences achetées
// par run) — c'est ce qui doit se "sentir" comme la vraie récompense
// ultime. Chaque récompense est nivelable : la repiocher (le pool pondère
// vers les moins investies, voir `pickRewardOptions`) monte son niveau de 1,
// pour rester utile après plusieurs Ascensions.

export const ASCENSION_REWARDS = [
  {
    id: 'hyperProduction',
    effect: { type: 'productionMultiplier', perLevel: 0.5 },
  },
  {
    id: 'overcharge',
    effect: { type: 'clickMultiplier', perLevel: 0.6 },
  },
  {
    id: 'grandArmada',
    effect: { type: 'fleetMultiplier', perLevel: 0.5 },
  },
  {
    id: 'stockpile',
    effect: {
      type: 'resourceProductionMultiplier',
      resources: ['metal', 'crystals'],
      perLevel: 0.45,
    },
  },
  {
    id: 'quantumMastery',
    effect: {
      type: 'resourceProductionMultiplier',
      resources: ['darkMatter', 'quantumEnergy', 'antimatter'],
      perLevel: 0.45,
    },
  },
  {
    id: 'masterShipwrights',
    // réduit le coût des vaisseaux : perLevel = fraction retirée par niveau
    effect: { type: 'shipCost', perLevel: 0.15 },
  },
  {
    id: 'selfSufficientFleet',
    // réduit la maintenance : perLevel = fraction retirée par niveau
    effect: { type: 'fleetMaintenance', perLevel: 0.2 },
  },
  {
    id: 'primordialSpark',
    effect: {
      type: 'resourceProductionMultiplier',
      resources: ['energy'],
      perLevel: 0.5,
    },
  },
];

export const ASCENSION_REWARD_IDS = ASCENSION_REWARDS.map((r) => r.id);
export const ASCENSION_REWARD_BY_ID = Object.fromEntries(
  ASCENSION_REWARDS.map((r) => [r.id, r])
);
