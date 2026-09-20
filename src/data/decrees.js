// Décrets du Sénat — des politiques à DOUBLE TRANCHANT, adoptées pour la run
// en échange d'influence (le premier vrai débouché de cette ressource).
//
// Le joueur dispose d'un nombre limité d'emplacements
// (`CONFIG.decrees.baseSlots`, +1 par technologie `decreeSlots`) : chaque
// décret adopté en occupe un, s'abroge gratuitement, et se paie de nouveau
// chaque fois qu'on le re-décrète. Changer de politique selon la situation
// (guerre, construction, exploration) coûte donc de l'influence.
//
// `effects` : vocabulaire « à niveaux » de `economy.js#applyLeveledEffect`,
// appliqué au niveau 1. `perLevel` peut être NÉGATIF : c'est le prix du décret
// (production, puissance de flotte…). Pour `shipCost` et `fleetMaintenance`,
// `perLevel` est la fraction RETIRÉE — positif = économie, négatif = surcoût.
// Un décret ne doit jamais être strictement meilleur qu'un autre : chacun
// avantage un axe et en pénalise un autre (garde-fou dans balance.test.js).
//
// État : `run.decrees` (ids adoptés, remis à zéro à chaque run).
// Texte : i18n `decree.<id>.name/desc`.

export const DECREES = [
  {
    // La flotte d'abord, l'économie ensuite.
    id: 'mobilization',
    cost: { influence: 30 },
    effects: [
      { type: 'fleetMultiplier', perLevel: 0.3 },
      { type: 'productionMultiplier', perLevel: -0.15 },
    ],
  },
  {
    // Une flotte peu chère à entretenir, mais moins puissante.
    id: 'austerity',
    cost: { influence: 30 },
    effects: [
      { type: 'fleetMaintenance', perLevel: 0.35 },
      { type: 'shipCost', perLevel: 0.15 },
      { type: 'fleetMultiplier', perLevel: -0.15 },
    ],
  },
  {
    id: 'warEconomy',
    cost: { influence: 40 },
    effects: [
      { type: 'productionMultiplier', perLevel: 0.25 },
      { type: 'fleetMaintenance', perLevel: -0.4 },
    ],
  },
  {
    // Coques épaisses, mais les colonies ne rapportent plus.
    id: 'martialLaw',
    cost: { influence: 40 },
    effects: [
      { type: 'fleetDurability', perLevel: 0.4 },
      { type: 'explorationIncome', perLevel: -0.5 },
    ],
  },
  {
    id: 'plunderRights',
    cost: { influence: 50 },
    effects: [
      { type: 'lootMultiplier', perLevel: 0.6 },
      { type: 'fleetDurability', perLevel: -0.15 },
    ],
  },
  {
    id: 'stateScience',
    cost: { influence: 50 },
    effects: [
      {
        type: 'resourceProductionMultiplier',
        resources: ['antimatter', 'darkMatter', 'quantumEnergy'],
        perLevel: 0.4,
      },
      {
        type: 'resourceProductionMultiplier',
        resources: ['metal', 'crystals'],
        perLevel: -0.15,
      },
    ],
  },
  {
    id: 'propaganda',
    cost: { influence: 30 },
    effects: [
      { type: 'clickMultiplier', perLevel: 0.75 },
      { type: 'fleetMultiplier', perLevel: -0.1 },
    ],
  },
  {
    id: 'freeTrade',
    cost: { influence: 40 },
    effects: [
      { type: 'explorationIncome', perLevel: 0.8 },
      { type: 'lootMultiplier', perLevel: -0.25 },
    ],
  },
];

export const DECREE_IDS = DECREES.map((d) => d.id);
export const DECREE_BY_ID = Object.fromEntries(DECREES.map((d) => [d.id, d]));
