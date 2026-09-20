// Résumé d'un combat — le bloc « rapport » qui clôt la fenêtre de bataille
// (voir battle-log.js) : issue, puissance engagée, vaisseaux détruits /
// récupérés / perdus pour de bon, forces ennemies détruites, butin.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { resourceCode } from '../data/resources.js';
import { formatNumber } from './format.js';
import { unitNames } from './battle-text.js';

const TITLE_KEY = {
  victory: 'ui.battleReport.titleWon',
  retreat: 'ui.battleReport.titleRetreat',
  defeat: 'ui.battleReport.titleLost',
  timeout: 'ui.battleReport.titleLost',
};

export const battleTitle = (outcome) =>
  t(TITLE_KEY[outcome] ?? 'ui.battleReport.titleLost');

/** Liste « pile → effectif » ; `tone` = `good` (vert) ou `bad` (rouge). */
function countList(kind, counts, sign, tone) {
  return el(
    'ul',
    { class: 'battle-report-list', dataset: { tone } },
    Object.entries(counts).map(([id, n]) =>
      el('li', {}, [
        el('span', { text: unitNames(`${kind}:${id}`).plural }),
        el('span', { text: `${sign}${formatNumber(n)}` }),
      ])
    )
  );
}

/** Nœuds DOM du résumé d'un combat résolu.
 * @param {object} entry charge de l'événement `battle-resolved` */
export function buildBattleSummary(entry) {
  const { battle } = entry;
  const lost = Object.keys(entry.losses).length > 0;
  const back = Object.keys(entry.recovered ?? {}).length > 0;
  const destroyed = Object.keys(entry.destroyed ?? {}).length > 0;
  const enemyGone = Object.keys(battle.enemyLosses).length > 0;
  const rewards = entry.rewards ? Object.entries(entry.rewards) : [];

  return [
    el('p', {
      class: 'battle-outcome',
      dataset: { outcome: entry.outcome },
      text: battleTitle(entry.outcome),
    }),
    el('p', {
      class: 'battle-note',
      text:
        t('ui.battleReport.power', {
          committed: formatNumber(entry.committedPower),
          required: formatNumber(entry.defenseRating),
        }) +
        ' · ' +
        t('ui.battleReport.rounds', { n: battle.rounds.length }),
    }),
    destroyed
      ? el('p', { class: 'drawer-desc', text: t('ui.battleReport.destroyed') })
      : null,
    destroyed ? countList('ship', entry.destroyed, '-', 'bad') : null,
    back
      ? el('p', { class: 'drawer-desc', text: t('ui.battleReport.recovered') })
      : null,
    back ? countList('ship', entry.recovered, '+', 'good') : null,
    el('p', { class: 'drawer-desc', text: t('ui.battleReport.losses') }),
    lost
      ? countList('ship', entry.losses, '-', 'bad')
      : el('p', { class: 'battle-note', text: t('ui.battleReport.noLosses') }),
    enemyGone
      ? el('p', {
          class: 'drawer-desc',
          text: t('ui.battleReport.enemyLosses'),
        })
      : null,
    enemyGone ? countList('enemy', battle.enemyLosses, '', 'good') : null,
    rewards.length > 0
      ? el('p', {
          class: 'board-modal-gains',
          text: rewards
            .map(([res, amt]) => `+${formatNumber(amt)} ${resourceCode(res)}`)
            .join('  '),
        })
      : null,
  ];
}
