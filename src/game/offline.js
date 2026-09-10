// Progression hors-ligne.
//
// Un jeu idle doit continuer à produire onglet fermé. Au chargement, on calcule
// le temps écoulé depuis `savedAt` et on avance la production (plafonnée) en
// forme close. La production utilisée est EXACTEMENT celle de la boucle en
// ligne (`netProduction`), donc les deux donnent le même résultat.

import { CONFIG } from '../data/config.js';
import { netProduction } from './economy.js';

export const DEFAULT_OFFLINE_CAP_MS = CONFIG.offlineCapMs;

/** Production nette par seconde et par ressource (raccourci de test). */
export function ratesPerSecond(state) {
  return netProduction(state);
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

  const rates = netProduction(state);
  const gains = {};
  for (const [res, rate] of Object.entries(rates)) {
    const delta = rate * cappedSeconds;
    // Seulement les gains : pas de perte de vaisseaux ni de ressources pendant
    // l'absence, juste un manque à gagner si la maintenance dépassait la prod.
    if (delta > 0) gains[res] = delta;
  }
  return { seconds, cappedSeconds, gains };
}

/** Applique les gains à l'état (mutation). */
export function applyOfflineGains(state, gains) {
  for (const [res, amount] of Object.entries(gains)) {
    if (state.resources[res] !== undefined) {
      state.resources[res] += amount;
      state.totalProduced[res] = (state.totalProduced[res] ?? 0) + amount;
    }
  }
}
