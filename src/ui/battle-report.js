// Rapport de combat — modal dismissable affichée juste après la résolution
// d'un nœud invade/conquest (voir Engine#chooseNode, événement
// 'battle-resolved'). Réutilise `openPanel` (même motif que les autres
// modales), fermable ici — ce n'est qu'un compte-rendu, pas un choix.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { resourceCode } from '../data/resources.js';
import { formatNumber } from './format.js';
import { openPanel } from './modal.js';

export function showBattleReport(entry) {
  const lossEntries = Object.entries(entry.losses);
  const rewardEntries = entry.rewards ? Object.entries(entry.rewards) : [];

  const btn = el('button', {
    class: 'btn btn-go btn-block',
    type: 'button',
    text: t('ui.buttons.resume'),
  });

  const { close } = openPanel(
    entry.victory
      ? t('ui.battleReport.titleWon')
      : t('ui.battleReport.titleLost'),
    [
      el('p', {
        class: 'panel-note',
        text: t('ui.battleReport.power', {
          committed: formatNumber(entry.committedPower),
          required: formatNumber(entry.defenseRating),
        }),
      }),
      el('p', {
        class: 'drawer-desc',
        text: t('ui.battleReport.losses'),
      }),
      lossEntries.length > 0
        ? el(
            'ul',
            { class: 'battle-report-list' },
            lossEntries.map(([id, n]) =>
              el('li', {}, [
                el('span', { text: t(`ship.${id}.name`) }),
                el('span', { text: `-${formatNumber(n)}` }),
              ])
            )
          )
        : el('p', { class: 'panel-note', text: t('ui.battleReport.noLosses') }),
      rewardEntries.length > 0
        ? el('p', {
            class: 'board-modal-gains',
            text: rewardEntries
              .map(([res, amt]) => `+${formatNumber(amt)} ${resourceCode(res)}`)
              .join('  '),
          })
        : null,
      btn,
    ]
  );
  btn.addEventListener('click', close);
  btn.focus();
}
