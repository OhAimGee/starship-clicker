// Écran Options — langue + thème. Aucune dépendance à un Engine : même
// composant utilisable avant une partie (menu principal) et pendant (menu
// de pause, voir pause-menu.js).

import { el } from './dom.js';
import { t, getLang, setLang, AVAILABLE_LANGS } from '../i18n/index.js';
import { getTheme, setTheme, AVAILABLE_THEMES } from './theme.js';
import { openPanel } from './modal.js';

/** @param {{ onClose?: () => void }} [opts] */
export function showOptions({ onClose } = {}) {
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

  const closeBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.buttons.close'),
  });

  const { close } = openPanel(
    t('options.title'),
    [
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [el('span', { text: t('ui.language') }), langSelect]),
        el('li', {}, [el('span', { text: t('options.theme') }), themeSelect]),
      ]),
      closeBtn,
    ],
    { onClose }
  );
  closeBtn.addEventListener('click', close);
}
