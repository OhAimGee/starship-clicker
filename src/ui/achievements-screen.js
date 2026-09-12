// Écran des succès — liste à cocher, purement informative (aucun effet sur
// la partie, voir DÉCISIONS du plan « écran d'accueil »). Prend un `state`
// brut (pas un Engine) : fonctionne identiquement avant une partie (menu
// principal) et pendant (menu de pause, voir pause-menu.js).

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { openPanel } from './modal.js';
import { ACHIEVEMENTS } from '../data/achievements.js';

/**
 * @param {object} state
 * @param {{ onClose?: () => void }} [opts]
 */
export function showAchievements(state, { onClose } = {}) {
  const rows = ACHIEVEMENTS.map((def) => {
    const unlocked = state.achievements[def.id]?.unlocked ?? false;
    return el(
      'li',
      { class: 'board-row', dataset: { state: unlocked ? 'done' : 'locked' } },
      [
        el('div', { class: 'board-row-line' }, [
          el('div', { class: 'board-row-main is-static' }, [
            icon(unlocked ? 'check' : 'lock', 'row-pictogram'),
            el('span', { class: 'row-label' }, [
              el('span', {
                class: 'row-name',
                text: t(`achievement.${def.id}.name`),
              }),
              el('span', {
                class: 'row-sub',
                text: t(`achievement.${def.id}.desc`),
              }),
            ]),
          ]),
        ]),
      ]
    );
  });

  const closeBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.buttons.close'),
  });

  const { close } = openPanel(
    t('ui.achievements.title'),
    [el('ul', { class: 'board-list' }, rows), closeBtn],
    { onClose }
  );
  closeBtn.addEventListener('click', close);
}
