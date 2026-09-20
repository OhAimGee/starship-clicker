// Journal de bord — le fil narratif (data/story.js) et le bestiaire des
// ennemis rencontrés. Comme l'écran des succès, il prend un `state` brut (pas
// un Engine) : même écran depuis le tiroir que depuis le menu principal.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { openPanel } from './modal.js';
import { sectionHead } from './board-row.js';
import { CHAPTERS, STORY_ENTRIES } from '../data/story.js';
import { ENEMY_PROFILE_IDS } from '../data/enemies.js';

/** Nombre d'entrées révélées / total, pour le tiroir. */
export function journalProgress(state) {
  return {
    done: STORY_ENTRIES.filter((e) => state.story.entries[e.id]).length,
    total: STORY_ENTRIES.length,
  };
}

function entryNode(def, state) {
  if (!state.story.entries[def.id]) {
    return el('li', { class: 'journal-entry', dataset: { state: 'locked' } }, [
      icon('lock', 'row-pictogram'),
      el('span', { text: t('ui.journal.locked') }),
    ]);
  }
  return el('li', { class: 'journal-entry', dataset: { state: 'open' } }, [
    el('h4', {
      class: 'journal-entry-title',
      text: t(`story.entry.${def.id}.title`),
    }),
    el('p', {
      class: 'journal-entry-text',
      text: t(`story.entry.${def.id}.text`, {
        name: state.commander.name || t('mainMenu.defaultCommanderName'),
      }),
    }),
  ]);
}

/**
 * @param {object} state
 * @param {{ onClose?: () => void, onBack?: () => void }} [opts] `onBack` :
 *   ouvert depuis le tiroir (flèche de retour, plein écran mobile)
 */
export function showJournal(state, { onClose, onBack } = {}) {
  const chapters = CHAPTERS.flatMap((chapterId) => {
    const entries = STORY_ENTRIES.filter((e) => e.chapter === chapterId);
    const done = entries.filter((e) => state.story.entries[e.id]).length;
    return [
      sectionHead(t(`story.chapter.${chapterId}.title`), `${done} / ${entries.length}`),
      el(
        'ul',
        { class: 'journal-list' },
        entries.map((def) => entryNode(def, state))
      ),
    ];
  });

  const met = ENEMY_PROFILE_IDS.filter((id) => state.story.bestiary[id]);
  const bestiary = [
    sectionHead(t('ui.journal.bestiary'), `${met.length} / ${ENEMY_PROFILE_IDS.length}`),
    met.length === 0
      ? el('p', { class: 'panel-note', text: t('ui.journal.bestiaryEmpty') })
      : el(
          'ul',
          { class: 'journal-list' },
          met.map((id) =>
            el('li', { class: 'journal-entry', dataset: { state: 'open' } }, [
              el('h4', {
                class: 'journal-entry-title',
                text: t(`enemy.profile.${id}.name`),
              }),
              el('p', {
                class: 'journal-entry-text',
                text: t(`enemy.profile.${id}.hint`),
              }),
            ])
          )
        ),
  ];

  const closeBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.buttons.close'),
  });

  const { close } = openPanel(
    t('ui.journal.title'),
    [...chapters, ...bestiary, closeBtn],
    { onClose, onBack }
  );
  closeBtn.addEventListener('click', close);
}
