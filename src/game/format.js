// Formatage des grands nombres pour l'affichage.
//
// Corrige les deux défauts de l'ancienne `formatNumber` :
//  - `0` renvoyait "0.00" (0 tombait dans la branche `toFixed(2)`) ;
//  - au-delà de 1e12 ("T") il n'y avait plus aucun suffixe.

const SUFFIXES = [
  '',
  'K',
  'M',
  'B',
  'T',
  'aa',
  'ab',
  'ac',
  'ad',
  'ae',
  'af',
  'ag',
  'ah',
  'ai',
  'aj',
];

/**
 * @param {number} value
 * @param {{ decimals?: number }} [opts]
 * @returns {string}
 */
export function formatNumber(value, opts = {}) {
  const decimals = opts.decimals ?? 2;
  const num = Number(value);

  if (!Number.isFinite(num)) return '0';

  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num);

  if (abs < 1) return abs === 0 ? '0' : sign + abs.toFixed(decimals);
  if (abs < 1000) return sign + Math.floor(abs).toString();

  const tier = Math.floor(Math.log10(abs) / 3);

  if (tier < SUFFIXES.length) {
    const scaled = abs / 1000 ** tier;
    return sign + scaled.toFixed(decimals) + SUFFIXES[tier];
  }

  // Très grands nombres : notation scientifique.
  return sign + abs.toExponential(decimals).replace('e+', 'e');
}
