// Progression hors-ligne.
//
// Un jeu idle doit continuer à produire onglet fermé. L'ancien code ne
// sauvegardait aucun horodatage : fermer l'onglet gelait la partie.
// Au chargement, on calcule le temps écoulé depuis `savedAt` et on avance la
// production (plafonnée) en forme close, sans re-simuler tick par tick.

export const DEFAULT_OFFLINE_CAP_MS = 8 * 60 * 60 * 1000; // 8 h

const PRODUCTION_TECH_MULTIPLIERS = [
  ['quantumComputing', 1.5],
  ['nanotechnology', 1.3],
  ['artificialIntelligence', 1.2],
  ['darkMatterPhysics', 1.5],
  ['quantumEntanglement', 2.0],
  ['voidTechnology', 3.0],
  ['realityManipulation', 10.0],
  ['cosmicAscension', 50.0],
];

/** Production nette par seconde et par ressource, d'après l'état courant. */
export function ratesPerSecond(state) {
  const rates = {};
  const add = (res, amount) => {
    rates[res] = (rates[res] || 0) + amount;
  };

  let prodMult = state.prestige?.permanentBonuses?.productionMultiplier ?? 1;
  for (const [tech, mult] of PRODUCTION_TECH_MULTIPLIERS) {
    if (state.technologies?.[tech]?.unlocked) prodMult *= mult;
  }

  for (const gen of Object.values(state.generators || {})) {
    if (gen.count > 0) add(gen.resource, gen.count * gen.production * prodMult);
  }

  const autoClickers = state.upgrades?.autoClicker?.count ?? 0;
  if (autoClickers > 0) add('energy', autoClickers * (state.clickPower ?? 1));

  const explorationMult = state.technologies?.hyperSpace?.unlocked ? 2 : 1;
  for (const system of state.conqueredSystems || []) {
    for (const [res, amount] of Object.entries(system.rewards || {})) {
      add(res, Math.floor(amount * 0.1 * explorationMult));
    }
  }

  // Maintenance de la flotte (payée en énergie).
  let maintenance = 0;
  for (const ship of Object.values(state.fleet || {})) {
    maintenance += ship.count * ship.maintenance;
  }
  if (state.technologies?.energyEfficiency?.unlocked) maintenance *= 0.7;
  if (maintenance > 0) add('energy', -maintenance);

  return rates;
}

/**
 * @returns {{ seconds: number, cappedSeconds: number, gains: Record<string, number> }}
 */
export function computeOfflineGains(
  state,
  elapsedMs,
  capMs = DEFAULT_OFFLINE_CAP_MS
) {
  const seconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const cappedSeconds = Math.min(seconds, Math.floor(capMs / 1000));

  const rates = ratesPerSecond(state);
  const gains = {};
  for (const [res, rate] of Object.entries(rates)) {
    const delta = rate * cappedSeconds;
    if (delta > 0) gains[res] = delta;
    // On ignore les deltas négatifs (déficit de maintenance) hors-ligne :
    // pas de perte de vaisseaux pendant l'absence, seulement un manque à gagner.
  }
  return { seconds, cappedSeconds, gains };
}

/** Applique les gains à l'état (mutation). */
export function applyOfflineGains(state, gains) {
  for (const [res, amount] of Object.entries(gains)) {
    if (state.resources[res] !== undefined) {
      state.resources[res] += amount;
      if (res === 'energy') state.totalEnergyGenerated += amount;
    }
  }
}
