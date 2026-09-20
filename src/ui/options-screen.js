// Écran Options — langue, thème, lecture des combats. Aucune dépendance à un
// Engine : même composant utilisable avant une partie (menu principal) et pendant (tiroir
// latéral, voir drawer.js).

import { el } from './dom.js';
import { t, getLang, setLang, AVAILABLE_LANGS } from '../i18n/index.js';
import { getTheme, setTheme, AVAILABLE_THEMES } from './theme.js';
import { getPlayback, setPlayback, PLAYBACK_MODES } from './combat-prefs.js';
import { openPanel } from './modal.js';

/** @param {{ onClose?: () => void, onBack?: () => void }} [opts] `onBack` :
 *  ouvert depuis le tiroir (flèche de retour, plein écran mobile) */
export function showOptions({ onClose, onBack } = {}) {
  const langSelect = el(
    'select',
    { class: 'lang-select', 'aria-label': t('ui.language') },
    AVAILABLE_LANGS.map((l) =>
      el('option', {
        value: l,
        text: l.toUpperCase(),
        selected: l === getLang(),
      })
    )
  );
  langSelect.addEventListener('change', () => setLang(langSelect.value));

  const themeSelect = el(
    'select',
    { class: 'lang-select', 'aria-label': t('options.theme') },
    AVAILABLE_THEMES.map((th) =>
      el('option', {
        value: th,
        text: t(`options.themeName.${th}`),
        selected: th === getTheme(),
      })
    )
  );
  themeSelect.addEventListener('change', () => setTheme(themeSelect.value));

  const playbackSelect = el(
    'select',
    { class: 'lang-select', 'aria-label': t('options.combatPlayback') },
    PLAYBACK_MODES.map((mode) =>
      el('option', {
        value: mode,
        text: t(`options.playback.${mode}`),
        selected: mode === getPlayback(),
      })
    )
  );
  playbackSelect.addEventListener('change', () =>
    setPlayback(playbackSelect.value)
  );

  const closeBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.buttons.close'),
  });

  const { close } = openPanel(
    t('options.title'),
    [
      el('ul', { class: 'stat-grid options-grid' }, [
        el('li', {}, [el('span', { text: t('ui.language') }), langSelect]),
        el('li', {}, [el('span', { text: t('options.theme') }), themeSelect]),
        el('li', {}, [
          el('span', { text: t('options.combatPlayback') }),
          playbackSelect,
        ]),
      ]),
      closeBtn,
    ],
    { onClose, onBack }
  );
  closeBtn.addEventListener('click', close);
}
