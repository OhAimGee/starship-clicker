// Améliorations.
//
// - `click` : améliorations du pouvoir de clic, achetées en énergie, niveau
//   illimité. `cost(l) = round(baseCost * costGrowth ** level)`.
// - `prestige` : achetées en points d'ascension (✨), effet permanent qui
//   survit à l'ascension. Toutes coûtent la même ressource (l'ancien jeu
//   mélangeait ✨ / 🔮 / 🌑 sans cohérence).

export const CLICK_UPGRADES = [
  {
    id: 'clickPower',
    baseCost: 50,
    costGrowth: 1.8,
    // +flat au pouvoir de clic de base par niveau
    clickBonusPerLevel: 1,
  },
  {
    id: 'autoClicker',
    baseCost: 500,
    costGrowth: 1.3,
    // chaque exemplaire clique une fois par seconde
  },
];

export const PRESTIGE_UPGRADES = [
  {
    id: 'prestigeProduction',
    baseCost: 1,
    costGrowth: 2,
    effect: { type: 'productionMultiplier', perLevel: 0.1 }, // +10 %/niv
  },
  {
    id: 'prestigeClick',
    baseCost: 1,
    costGrowth: 2,
    effect: { type: 'clickMultiplier', perLevel: 0.25 }, // +25 %/niv
  },
  {
    id: 'fleetCommand',
    baseCost: 2,
    costGrowth: 2.2,
    effect: { type: 'fleetMultiplier', perLevel: 0.2 }, // +20 %/niv
  },
  {
    id: 'quantumAffinity',
    baseCost: 3,
    costGrowth: 2.5,
    // +50 %/niv sur la production de matière noire ET d'énergie quantique
    effect: {
      type: 'resourceProductionMultiplier',
      resources: ['darkMatter', 'quantumEnergy'],
      perLevel: 0.5,
    },
  },
];

export const CLICK_UPGRADE_BY_ID = Object.fromEntries(
  CLICK_UPGRADES.map((u) => [u.id, u])
);
export const PRESTIGE_UPGRADE_BY_ID = Object.fromEntries(
  PRESTIGE_UPGRADES.map((u) => [u.id, u])
);
