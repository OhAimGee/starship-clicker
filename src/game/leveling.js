// Niveau de joueur (XP) — persistant entre les runs (survit à `endRun()`,
// comme le niveau de faction), remis à zéro uniquement par une vraie
// Ascension (voir `prestige.js#ascend`). Alimenté exclusivement par le
// combat (voir `Engine#resolvePlanetCombat`/`openSystem`) : chaque combat
// gagné, chaque planète et chaque système conquis en donnent. Sert de
// palier d'accès aux systèmes lointains (voir `data/systems.js#
// requiredLevelForIndex`).

import { CONFIG } from '../data/config.js';

/** XP requise pour passer du niveau `level` au niveau `level + 1`. */
export function xpForLevel(level) {
  return Math.round(CONFIG.player.xpBase * CONFIG.player.xpGrowth ** level);
}

/**
 * Ajoute `amount` d'XP à `state.prestige.player`, gère un ou plusieurs
 * passages de niveau d'un coup (boucle, pas de plafond).
 * @returns {{ leveledUp: boolean, newLevel: number }}
 */
export function grantXp(state, amount) {
  const p = state.prestige.player;
  if (amount <= 0) return { leveledUp: false, newLevel: p.level };
  p.xp += amount;
  let leveledUp = false;
  while (p.xp >= xpForLevel(p.level)) {
    p.xp -= xpForLevel(p.level);
    p.level += 1;
    leveledUp = true;
  }
  return { leveledUp, newLevel: p.level };
}
