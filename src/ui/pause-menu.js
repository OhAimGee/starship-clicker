// Petit menu de pause en jeu — accès discret à Succès/Options/Menu
// principal sans recharger la page (voir DÉCISIONS du plan « écran
// d'accueil »), ouvert depuis le bouton du pied de page (src/ui/app.js).
// Modale dismissable classique (`openPanel`) : chaque choix la referme
// d'abord, puis ouvre l'écran demandé — pas d'empilement, contrairement au
// combat (fleet-allocation/battle-report), qui a besoin de préserver l'état
// affiché en dessous.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { openPanel } from './modal.js';

/**
 * @param {{
 *   onAchievements: () => void,
 *   onOptions: () => void,
 *   onMainMenu: () => void,
 * }} opts
 */
export function showPauseMenu({ onAchievements, onOptions, onMainMenu }) {
  const achievementsBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.pauseMenu.achievements'),
  });
  const optionsBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.pauseMenu.options'),
  });
  const mainMenuBtn = el('button', {
    class: 'btn btn-danger btn-block',
    type: 'button',
    text: t('ui.pauseMenu.mainMenu'),
  });

  const { close } = openPanel(t('ui.pauseMenu.title'), [
    achievementsBtn,
    optionsBtn,
    mainMenuBtn,
  ]);

  achievementsBtn.addEventListener('click', () => {
    close();
    onAchievements();
  });
  optionsBtn.addEventListener('click', () => {
    close();
    onOptions();
  });
  mainMenuBtn.addEventListener('click', () => {
    close();
    onMainMenu();
  });
}
