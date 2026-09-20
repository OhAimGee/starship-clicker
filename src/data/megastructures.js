// Mégastructures — les grands chantiers de la RUN (Boutique, section
// « Chantiers », débloquée par la technologie `megastructureEngineering`).
//
// Chaque mégastructure se construit par NIVEAUX successifs (`maxLevel`), payés
// avec plusieurs ressources à la fois : le niveau `n` (0-based) coûte
// `round(baseCost[res] × costGrowth ** n)`. Comme l'arbre de compétences de run
// (data/runSkills.js), leurs effets sont TEMPORAIRES : `run.megastructures`
// est remis à zéro par `startRun()`/`endRun()` — il faut tout rebâtir à chaque
// run, ce sont des accélérateurs de milieu de partie, pas du prestige.
//
// `effect` réutilise le vocabulaire « à niveaux » de `economy.js#
// applyLeveledEffect` (productionMultiplier, resourceProductionMultiplier,
// shipCost, fleetDurability…, plus `explorationIncome` et `lootMultiplier`
// apparus avec cette mise à jour), appliqué au niveau atteint.
//
// `unlock` (même forme que les générateurs) : la ligne apparaît « teasée »
// puis disponible quand le cumul de la ressource est atteint.
//
// Texte : i18n `megastructure.<id>.name/desc`.

export const MEGASTRUCTURES = [
  {
    // Énergie : la plus simple, la première qu'on bâtit.
    id: 'dysonSphere',
    maxLevel: 4,
    baseCost: { energy: 2_000_000, metal: 30_000, crystals: 2_000 },
    costGrowth: 2.4,
    effect: {
      type: 'resourceProductionMultiplier',
      resources: ['energy'],
      perLevel: 0.5,
    },
    unlock: { resource: 'energy', total: 300_000 },
  },
  {
    // Vaisseaux moins chers : rentable dès qu'on construit beaucoup de flotte.
    id: 'orbitalElevator',
    maxLevel: 3,
    baseCost: { metal: 60_000, crystals: 6_000 },
    costGrowth: 2.6,
    effect: { type: 'shipCost', perLevel: 0.08 },
    unlock: { resource: 'metal', total: 20_000 },
  },
  {
    id: 'worldForge',
    maxLevel: 4,
    baseCost: { energy: 3_000_000, crystals: 8_000, antimatter: 200 },
    costGrowth: 2.4,
    effect: {
      type: 'resourceProductionMultiplier',
      resources: ['metal', 'crystals'],
      perLevel: 0.4,
    },
    unlock: { resource: 'crystals', total: 5_000 },
  },
  {
    // Relance l'influence, qui alimente décrets, négociations et Archives.
    id: 'archivesNetwork',
    maxLevel: 4,
    baseCost: { crystals: 20_000, influence: 150 },
    costGrowth: 2.2,
    effect: {
      type: 'resourceProductionMultiplier',
      resources: ['influence'],
      perLevel: 0.6,
    },
    unlock: { resource: 'influence', total: 60 },
  },
  {
    // PV de toute la flotte (effet `fleetDurability`, voir game/combat.js).
    id: 'flagshipYard',
    maxLevel: 4,
    baseCost: { metal: 120_000, crystals: 10_000, antimatter: 500 },
    costGrowth: 2.5,
    effect: { type: 'fleetDurability', perLevel: 0.15 },
    unlock: { resource: 'antimatter', total: 300 },
  },
  {
    // Revenu passif des systèmes conquis.
    id: 'ringWorld',
    maxLevel: 3,
    baseCost: { crystals: 40_000, antimatter: 1_000, darkMatter: 10 },
    costGrowth: 3,
    effect: { type: 'explorationIncome', perLevel: 0.6 },
    unlock: { resource: 'darkMatter', total: 3 },
  },
];

export const MEGASTRUCTURE_IDS = MEGASTRUCTURES.map((m) => m.id);
export const MEGASTRUCTURE_BY_ID = Object.fromEntries(
  MEGASTRUCTURES.map((m) => [m.id, m])
);
