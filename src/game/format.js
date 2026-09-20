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

/**
 * Débit « par seconde ». Contrairement à `formatNumber`, qui tronque à
 * l'entier tout ce qui est entre 1 et 999, garde les décimales : un exemplaire
 * qui ajoute 0,05 /s doit toujours changer le nombre affiché (sinon un débit
 * de 1,05 à 1,95 s'affichait « 1 » et la production semblait figée).
 * @param {number} value
 * @returns {string}
 */
export function formatRateNumber(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '0';

  const abs = Math.abs(num);
  if (abs >= 1000) return formatNumber(num);

  // Arrondi à 2 décimales d'abord : 0.1 + 0.2 ou 1.9500000000000002 ne
  // doivent pas s'afficher « 0.30 » / « 1.95 » avec du bruit flottant.
  const rounded = Math.round(abs * 100) / 100;
  const sign = num < 0 && rounded !== 0 ? '-' : '';
  return sign + (Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2));
}
