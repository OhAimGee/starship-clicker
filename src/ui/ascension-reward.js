// Écran de choix de récompense d'Ascension — obligatoire une fois l'Ascension
// déclenchée (Engine#ascend). Même motif que `faction-select.js` : panneau
// plein cadre de `modal.js`, en mode non-fermable (le joueur doit choisir).

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { ascensionRewardIconId } from './icon-map.js';
import { openPanel } from './modal.js';

export function showAscensionReward(engine, optionIds, { onChosen } = {}) {
  let close;

  const rows = optionIds.map((id) => {
    const level = engine.state.ascension.rewards[id]?.level ?? 0;
    const btn = el(
      'button',
      { class: 'board-row-main faction-row', type: 'button' },
      [
        icon(ascensionRewardIconId(id), 'row-pictogram'),
        el('span', { class: 'row-label' }, [
          el('span', {
            class: 'row-name',
            text: t(`ascensionReward.${id}.name`),
          }),
          el('span', {
            class: 'row-sub',
            text: t(`ascensionReward.${id}.desc`),
          }),
        ]),
        el('span', {
          class: 'row-tail',
          text:
            level > 0
              ? t('ui.factionSelect.level', { n: level })
              : t('ui.factionSelect.new'),
        }),
      ]
    );
    btn.addEventListener('click', () => {
      engine.chooseAscensionReward(id);
      close();
      onChosen?.();
    });
    return el('li', { class: 'board-row' }, [
      el('div', { class: 'board-row-line' }, [btn]),
    ]);
  });

  ({ close } = openPanel(
    t('ui.ascensionChoice.title'),
    [
      el('p', { class: 'panel-note', text: t('ui.ascensionChoice.intro') }),
      el('ul', { class: 'board-list' }, rows),
    ],
    { dismissable: false }
  ));
}
