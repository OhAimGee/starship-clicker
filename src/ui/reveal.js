// Dévoilement progressif : un nouveau joueur ne doit pas voir 14 générateurs et
// 12 technos d'un coup. On montre ce qui est débloqué, on « teasе » ce qui est
// proche, on cache le reste.

import { isUnlocked } from '../game/economy.js';

const TEASE_RATIO = 0.25; // visible en grisé dès qu'on a 25 % du prérequis

/** @returns {'available' | 'teased' | 'hidden'} */
export function visibility(state, unlock) {
  if (isUnlocked(state, unlock)) return 'available';
  if (!unlock) return 'available';

  if ('tech' in unlock) {
    // Teasé si la techno requise est elle-même visible (débloquée ou proche).
    return 'hidden';
  }
  const have = state.totalProduced[unlock.resource] ?? 0;
  return have >= unlock.total * TEASE_RATIO ? 'teased' : 'hidden';
}

/** Filtre + tri d'une liste de définitions selon la visibilité. */
export function revealList(state, defs) {
  return defs
    .map((def) => ({ def, vis: visibility(state, def.unlock) }))
    .filter((x) => x.vis !== 'hidden');
}
