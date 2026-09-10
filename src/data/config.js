// Constantes de réglage du jeu. Tout ce qui se tune sans toucher à la logique.

export const CONFIG = {
  // Boucle
  tickMs: 1000, // 1 tick logique = 1 seconde de simulation
  maxCatchupTicks: 20, // nb max de ticks rattrapés d'un coup (onglet en veille)

  // Sauvegarde
  saveIntervalMs: 10_000,

  // Progression hors-ligne
  offlineCapMs: 8 * 60 * 60 * 1000, // 8 h
  offlineMinMs: 60_000, // en-dessous, on ne montre pas de rapport

  // Ascension / prestige
  ascension: {
    quantumCost: 1000, // 🔮 requis pour ascendre
    pointsDivisor: 1000, // points = floor(quantumEnergy / divisor)
    // Bonus permanents cumulés par ascension
    clickPerAscension: 0.1, // +10 % pouvoir de clic
    productionPerAscension: 0.2, // +20 % production
    fleetPerAscension: 0.15, // +15 % puissance de flotte
    // Petit capital de redémarrage, par ascension
    restartGrant: { energy: 150, metal: 75, crystals: 40, antimatter: 6 },
    // Réduction permanente du coût des générateurs à chaque ascension
    generatorCostReduction: 0.9,
  },

  // Événements aléatoires
  events: {
    cooldownMs: 90_000,
    chance: 0.25, // probabilité à chaque fenêtre passée le cooldown
  },

  // Économie
  shipCostGrowth: 1.2, // multiplicateur de coût par vaisseau construit
  conqueredIncomeFraction: 0.1, // fraction des récompenses versée /s par système conquis
  maintenanceAttritionRate: 0.05, // part de flotte perdue /s en cas de déficit d'énergie
  neuralNetBuyThreshold: 10, // n'auto-achète que si on a 10x le coût (tech neuralNetworks)
};
