// Helpers de présentation.
//
// Monde « tableau des départs » : les icônes sont des pictogrammes SVG (voir
// icons.js), pas des glyphes inline. Les helpers de chaîne utilisent donc les
// codes courts des ressources (NRG, MTL…), et les panneaux composent
// icône + nombre en DOM quand ils le peuvent.

import { formatNumber, formatRateNumber } from '../game/format.js';
import { resourceCode } from '../data/resources.js';
import { t } from '../i18n/index.js';

export { formatNumber, formatRateNumber };

const THIN = ' '; // fine insécable — séparateur de milliers « panneau »

/** Grands nombres pour le panneau : chiffres groupés en dessous d'1 M,
 *  abrégé au-delà (les runs de chiffres perdent leur charme et leur place). */
export function formatBoard(value) {
  const n = Math.floor(Number(value) || 0);
  if (n < 1_000_000) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, THIN);
  }
  return formatNumber(n);
}

/** « 1.20K NRG · 50 CRY » à partir d'une map { resource: montant }. */
export function formatCost(costMap) {
  return Object.entries(costMap)
    .map(
      ([res, amount]) => `${formatNumber(amount)}${THIN}${resourceCode(res)}`
    )
    .join('  ·  ');
}

/** Coût condensé pour une ligne : ressource dominante + « +N ». */
export function shortCost(costMap) {
  const entries = Object.entries(costMap).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return '';
  const [res, amount] = entries[0];
  const extra = entries.length - 1;
  return `${formatNumber(amount)}${THIN}${resourceCode(res)}${extra ? ` +${extra}` : ''}`;
}

/** Liste lisible des ressources manquantes (annonces). */
export function formatResourceList(map) {
  return Object.entries(map)
    .map(
      ([res, amount]) => `${formatNumber(amount)}${THIN}${resourceCode(res)}`
    )
    .join(', ');
}

/** « +2.5 NRG/s » pour un taux de production. */
export function formatRate(amount, resource) {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${formatRateNumber(amount)}${THIN}${resourceCode(resource)}${t('ui.labels.perSecondShort')}`;
}

/** Indice de déblocage lisible pour un `unlock` de données. */
export function lockHint(unlock) {
  if (!unlock) return '';
  if ('tech' in unlock) {
    return t('ui.labels.unlockHintTech', {
      tech: t(`tech.${unlock.tech}.name`),
    });
  }
  return t('ui.labels.unlockHint', {
    amount: formatNumber(unlock.total),
    resource: `${resourceCode(unlock.resource)} ${t(`resource.${unlock.resource}`)}`,
  });
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0)
    return `${t('ui.offline.hours', { n: h })} ${t('ui.offline.minutes', { n: m })}`;
  return t('ui.offline.minutes', { n: Math.max(1, m) });
}

/** Code horaire décoratif dérivé de l'index d'une ligne (ambiance « panneau »). */
export function timeCode(index) {
  const base = 6 * 60 + index * 7; // départ à 06:00, +7 min par ligne
  const h = String(Math.floor(base / 60) % 24).padStart(2, '0');
  const m = String(base % 60).padStart(2, '0');
  return `${h}:${m}`;
}
