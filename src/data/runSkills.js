// Arbre de compétences de RUN — commun (pas spécifique à une faction),
// acheté avec `run.skillPoints` (gagnés sur les nœuds "skillPoint" de la
// carte d'exploration). Effets **temporaires** : ils ne durent que la run en
// cours, `run.skillTree` étant remis à zéro à chaque `startRun()`/`endRun()`
// (voir `game/run.js#startRun`, `game/prestige.js#endRun`) comme le reste de
// `state.run`. Réutilise exactement le vocabulaire d'effet existant (voir
// `economy.js#applyLeveledEffect`) : aucun nouveau type d'effet. `perLevel`
// volontairement modeste (entre une compétence de faction et une récompense
// d'Ascension en impact par niveau) puisqu'il se ressent sur une run entière
// mais ne survit pas à sa fin.

export const RUN_SKILLS = [
  {
    id: 'overclockedThrusters',
    baseCost: 1,
    costGrowth: 1.7,
    effect: { type: 'fleetMultiplier', perLevel: 0.08 },
  },
  {
    id: 'scavengerProtocols',
    baseCost: 1,
    costGrowth: 1.7,
    effect: {
      type: 'resourceProductionMultiplier',
      resources: ['metal', 'crystals'],
      perLevel: 0.1,
    },
  },
  {
    id: 'rapidFire',
    baseCost: 1,
    costGrowth: 1.7,
    effect: { type: 'clickMultiplier', perLevel: 0.1 },
  },
  {
    id: 'fieldRepairs',
    baseCost: 1,
    costGrowth: 1.7,
    // réduit la maintenance : perLevel = fraction retirée par niveau
    effect: { type: 'fleetMaintenance', perLevel: 0.08 },
  },
  {
    id: 'streamlinedLogistics',
    baseCost: 1,
    costGrowth: 1.7,
    // réduit le coût des vaisseaux : perLevel = fraction retirée par niveau
    effect: { type: 'shipCost', perLevel: 0.06 },
  },
  {
    id: 'energyFocus',
    baseCost: 1,
    costGrowth: 1.7,
    effect: { type: 'productionMultiplier', perLevel: 0.06 },
  },
];

export const RUN_SKILL_IDS = RUN_SKILLS.map((s) => s.id);
export const RUN_SKILL_BY_ID = Object.fromEntries(
  RUN_SKILLS.map((s) => [s.id, s])
);
