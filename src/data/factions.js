// Factions — choisies au début d'une run, elles seules progressent (bonus de
// run + arbre de compétences propre débloqué entre les runs avec les points
// d'ascension). Les effets réutilisent exactement le vocabulaire déjà défini
// pour les technologies/améliorations de prestige (voir `economy.js` ->
// `applyLeveledEffect`) : aucun nouveau type d'effet n'est introduit.
//
// - `startBonuses` : effets toujours actifs dès le début de la run, comme si
//   le joueur possédait déjà 1 niveau de chacun (voir `factionMultipliers`).
// - `skillTree` : achetés entre deux runs avec `resources.ascensionPoints`
//   (même formule de coût que `PRESTIGE_UPGRADES` :
//   `round(baseCost * costGrowth ** level)`), niveau illimité.

export const FACTIONS = [
  {
    id: 'miningCollective',
    icon: 'metal',
    startBonuses: [
      {
        type: 'resourceProductionMultiplier',
        resources: ['metal', 'crystals'],
        perLevel: 0.25,
      },
    ],
    skillTree: [
      {
        id: 'deepCoreDrilling',
        baseCost: 1,
        costGrowth: 2,
        effect: {
          type: 'resourceProductionMultiplier',
          resources: ['metal'],
          perLevel: 0.3,
        },
      },
      {
        id: 'crystalRefining',
        baseCost: 2,
        costGrowth: 2.2,
        effect: {
          type: 'resourceProductionMultiplier',
          resources: ['crystals'],
          perLevel: 0.3,
        },
      },
      {
        id: 'massProduction',
        baseCost: 3,
        costGrowth: 2.5,
        effect: { type: 'productionMultiplier', perLevel: 0.15 },
      },
      {
        id: 'stellarSmelting',
        baseCost: 3,
        costGrowth: 2.3,
        effect: {
          type: 'resourceProductionMultiplier',
          resources: ['energy'],
          perLevel: 0.25,
        },
      },
      {
        id: 'bulkFreight',
        baseCost: 4,
        costGrowth: 2.4,
        // réduit le coût des vaisseaux : perLevel = fraction retirée par niveau
        effect: { type: 'shipCost', perLevel: 0.1 },
      },
    ],
  },
  {
    id: 'ironLegion',
    icon: 'fleet',
    startBonuses: [{ type: 'fleetMultiplier', perLevel: 0.2 }],
    skillTree: [
      {
        id: 'shipyards',
        baseCost: 1,
        costGrowth: 2,
        effect: { type: 'fleetMultiplier', perLevel: 0.25 },
      },
      {
        id: 'leanLogistics',
        baseCost: 2,
        costGrowth: 2.2,
        // réduit la maintenance : perLevel = fraction retirée par niveau
        effect: { type: 'fleetMaintenance', perLevel: 0.15 },
      },
      {
        id: 'rapidAssembly',
        baseCost: 2,
        costGrowth: 2.4,
        // réduit le coût des vaisseaux : perLevel = fraction retirée par niveau
        effect: { type: 'shipCost', perLevel: 0.12 },
      },
      {
        id: 'ironDiscipline',
        baseCost: 3,
        costGrowth: 2.3,
        effect: { type: 'clickMultiplier', perLevel: 0.2 },
      },
      {
        id: 'warReserves',
        baseCost: 4,
        costGrowth: 2.4,
        effect: {
          type: 'resourceProductionMultiplier',
          resources: ['metal'],
          perLevel: 0.25,
        },
      },
    ],
  },
  {
    id: 'quantumOrder',
    icon: 'quantumEnergy',
    startBonuses: [
      {
        type: 'resourceProductionMultiplier',
        resources: ['antimatter', 'darkMatter', 'quantumEnergy'],
        perLevel: 0.2,
      },
    ],
    skillTree: [
      {
        id: 'entangledFields',
        baseCost: 1,
        costGrowth: 2,
        effect: {
          type: 'resourceProductionMultiplier',
          resources: ['quantumEnergy'],
          perLevel: 0.4,
        },
      },
      {
        id: 'voidSight',
        baseCost: 2,
        costGrowth: 2.2,
        effect: { type: 'clickMultiplier', perLevel: 0.3 },
      },
      {
        id: 'ascendantMinds',
        baseCost: 3,
        costGrowth: 2.5,
        effect: { type: 'productionMultiplier', perLevel: 0.15 },
      },
      {
        id: 'darkResonance',
        baseCost: 3,
        costGrowth: 2.3,
        effect: {
          type: 'resourceProductionMultiplier',
          resources: ['darkMatter'],
          perLevel: 0.35,
        },
      },
      {
        id: 'fleetSingularity',
        baseCost: 4,
        costGrowth: 2.4,
        effect: { type: 'fleetMultiplier', perLevel: 0.15 },
      },
    ],
  },
];

export const FACTION_IDS = FACTIONS.map((f) => f.id);
export const FACTION_BY_ID = Object.fromEntries(FACTIONS.map((f) => [f.id, f]));
