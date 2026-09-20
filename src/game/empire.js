// Grands Chantiers : coûts et règles des mégastructures et des décrets du
// Sénat. Fonctions pures sur l'état (les effets eux-mêmes sont agrégés par
// `economy.js#empireMultipliers`) ; `Engine` en fait des actions.

import { CONFIG } from '../data/config.js';
import { MEGASTRUCTURE_BY_ID } from '../data/megastructures.js';
import { DECREE_BY_ID } from '../data/decrees.js';
import { techMultipliers } from './economy.js';

const round = Math.round;

// ─── Mégastructures ─────────────────────────────────────────────────────────

/** Les Chantiers sont-ils débloqués (technologie `megastructureEngineering`) ? */
export function megastructuresUnlocked(state) {
  return techMultipliers(state).unlockMegastructures;
}

export function megastructureLevel(state, id) {
  return state.run.megastructures?.[id]?.level ?? 0;
}

/** Coût du PROCHAIN niveau (map { ressource: montant }), ou `null` si la
 * mégastructure est déjà au niveau maximal (ou inconnue). */
export function megastructureCost(state, id) {
  const def = MEGASTRUCTURE_BY_ID[id];
  if (!def) return null;
  const level = megastructureLevel(state, id);
  if (level >= def.maxLevel) return null;
  const out = {};
  for (const [res, base] of Object.entries(def.baseCost)) {
    out[res] = round(base * def.costGrowth ** level);
  }
  return out;
}

// ─── Décrets ────────────────────────────────────────────────────────────────

/** Les décrets du Sénat sont-ils débloqués (technologie `spaceDiplomacy`) ? */
export function decreesUnlocked(state) {
  return techMultipliers(state).unlockDecrees;
}

/** Nombre d'emplacements de décret : base + technologies. */
export function decreeSlots(state) {
  return CONFIG.decrees.baseSlots + techMultipliers(state).decreeSlots;
}

export function isDecreeAdopted(state, id) {
  return (state.run.decrees ?? []).includes(id);
}

/** Coût d'adoption d'un décret (map { ressource: montant }), `null` si inconnu. */
export function decreeCost(id) {
  const def = DECREE_BY_ID[id];
  return def ? { ...def.cost } : null;
}
