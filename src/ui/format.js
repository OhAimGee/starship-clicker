// Helpers de présentation partagés par les panneaux.

import { formatNumber } from '../game/format.js';
import { resourceIcon } from '../data/resources.js';
import { t } from '../i18n/index.js';

export { formatNumber };

/** « 1.20K ⚡  +  50 💎 » à partir d'une map { resource: montant }. */
export function formatCost(costMap) {
  return Object.entries(costMap)
    .map(([res, amount]) => `${formatNumber(amount)} ${resourceIcon(res)}`)
    .join('  +  ');
}

/** Liste lisible des ressources manquantes (pour les notifications). */
export function formatResourceList(map) {
  return Object.entries(map)
    .map(
      ([res, amount]) =>
        `${formatNumber(amount)} ${resourceIcon(res)} ${t(`resource.${res}`)}`
    )
    .join(', ');
}

/** « +2.5 ⚡/s » pour un taux de production. */
export function formatRate(amount, resource) {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${formatNumber(amount)} ${resourceIcon(resource)}${t('ui.labels.perSecondShort')}`;
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
    resource: `${resourceIcon(unlock.resource)} ${t(`resource.${unlock.resource}`)}`,
  });
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0)
    return `${t('ui.offline.hours', { n: h })} ${t('ui.offline.minutes', { n: m })}`;
  return t('ui.offline.minutes', { n: Math.max(1, m) });
}
