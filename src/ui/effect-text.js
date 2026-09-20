// Libellés des effets « à niveaux » (mégastructures, décrets) — le vocabulaire
// de `economy.js#applyLeveledEffect`, rendu lisible : « Production (NRG) +50 % ».

import { t } from '../i18n/index.js';
import { resourceCode } from '../data/resources.js';

// Effets de RÉDUCTION : `perLevel` est la fraction retirée (coût, maintenance),
// donc positif = une baisse affichée « −15 % » — bonne pour le joueur.
const REDUCTION_TYPES = new Set(['shipCost', 'fleetMaintenance']);

/**
 * @param {{ type: string, perLevel: number, resources?: string[] }} effect
 * @param {number} [level] niveau appliqué (les décrets : 1)
 * @returns {{ label: string, value: string, text: string, tone: 'good' | 'bad' }}
 *   `tone` : l'effet aide (`good`) ou pénalise (`bad`) le joueur.
 */
export function effectLine(effect, level = 1) {
  const raw = effect.perLevel * level;
  const shown = REDUCTION_TYPES.has(effect.type) ? -raw : raw;
  const value = t('effect.percent', {
    sign: shown >= 0 ? '+' : '−',
    n: Math.round(Math.abs(shown) * 100),
  });
  const label = t(`effect.${effect.type}`, {
    res: (effect.resources ?? []).map(resourceCode).join(', '),
  });
  return { label, value, text: `${label} ${value}`, tone: raw > 0 ? 'good' : 'bad' };
}

export function effectLines(effects, level = 1) {
  return effects.map((e) => effectLine(e, level));
}
