// Écran d'accueil — premier écran affiché (voir src/main.js#bootMenu).
// Rendu directement dans `host` (pas une modale par-dessus du vide), en
// reprenant l'habillage wordmark déjà établi pour le chrome de jeu.

import { el, clear } from './dom.js';
import { t } from '../i18n/index.js';
import { iconMarkup } from './icons.js';

/**
 * @param {HTMLElement} host
 * @param {{
 *   hasSave: boolean,
 *   onContinue: () => void,
 *   onNewGame: () => void,
 *   onTutorial: () => void,
 *   onAchievements: () => void,
 *   onOptions: () => void,
 *   onQuit: () => void,
 * }} opts
 */
export function showMainMenu(
  host,
  { hasSave, onContinue, onNewGame, onTutorial, onAchievements, onOptions, onQuit }
) {
  clear(host);

  const continueBtn = el('button', {
    class: 'btn btn-go btn-block',
    type: 'button',
    disabled: !hasSave,
    text: t('mainMenu.continue'),
  });
  const newGameBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('mainMenu.newGame'),
  });
  const tutorialBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('mainMenu.tutorial'),
  });
  const achievementsBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('mainMenu.achievements'),
  });
  const optionsBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('mainMenu.options'),
  });
  const quitBtn = el('button', {
    class: 'btn btn-danger btn-block',
    type: 'button',
    text: t('mainMenu.quit'),
  });

  continueBtn.addEventListener('click', onContinue);
  newGameBtn.addEventListener('click', onNewGame);
  tutorialBtn.addEventListener('click', onTutorial);
  achievementsBtn.addEventListener('click', onAchievements);
  optionsBtn.addEventListener('click', onOptions);
  quitBtn.addEventListener('click', onQuit);

  const wordmark = el('div', { class: 'main-menu-wordmark wordmark' });
  wordmark.innerHTML = `${iconMarkup('fleet')}<span>${t('ui.title')}</span>`;

  host.append(
    el('div', { class: 'main-menu' }, [
      wordmark,
      el('p', { class: 'main-menu-tagline', text: t('ui.tagline') }),
      el('nav', { class: 'main-menu-buttons' }, [
        continueBtn,
        newGameBtn,
        tutorialBtn,
        achievementsBtn,
        optionsBtn,
        quitBtn,
      ]),
    ])
  );
}
