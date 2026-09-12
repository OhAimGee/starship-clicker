// Point d'entrée. Affiche l'écran d'accueil, puis charge la sauvegarde et
// monte l'interface de jeu une fois une partie choisie (Continuer/Nouveau).
//
// L'ancien monolithe `src/legacy/` a été retiré : tout passe désormais par
// `src/game/` (moteur) et `src/ui/` (interface).

import './ui/fonts.css';
import './ui/styles.css';
import { el } from './ui/dom.js';
import { CONFIG } from './data/config.js';
import { loadState, saveState, hasSave } from './game/save.js';
import { createInitialState } from './game/initial-state.js';
import { Engine } from './game/engine.js';
import { computeOfflineGains, applyOfflineGains } from './game/offline.js';
import { initLang, t } from './i18n/index.js';
import { initTheme } from './ui/theme.js';
import { mountApp } from './ui/app.js';
import { showMainMenu } from './ui/main-menu.js';
import { showCommanderCreation } from './ui/commander-creation.js';
import { showAchievements } from './ui/achievements-screen.js';
import { showOptions } from './ui/options-screen.js';
import { confirmDialog, openPanel } from './ui/modal.js';
import { initTutorialProgress } from './ui/tutorial-progress.js';
import { startTutorial } from './ui/tutorial.js';

const host = document.getElementById('app');

// Langue/thème sont indépendants de la sauvegarde de partie (leur propre
// clé localStorage, voir i18n/index.js et ui/theme.js) : `initLang` accepte
// tout de même la langue de la dernière sauvegarde comme repli si aucune
// préférence de langue n'a jamais été posée.
initLang(loadState().state.lang);
initTheme();
initTutorialProgress();

if (import.meta.env.DEV) {
  window.__starship = { engine: null, state: () => window.__starship.engine?.state };
}

// PWA : enregistrer le service worker en production (jeu installable,
// hors-ligne) — indépendant de l'écran affiché (menu ou partie).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* pas de SW : le jeu fonctionne quand même */
    });
  });
}

function attemptQuit() {
  // `window.close()` ne fonctionne que si l'onglet a été ouvert par un
  // script — c'est le cas le plus fréquent (navigation normale) qui échoue
  // silencieusement ; on affiche donc systématiquement un repli explicite
  // juste après la tentative plutôt que de laisser croire à un clic sans
  // effet.
  window.close();
  const closeBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.buttons.close'),
  });
  const { close } = openPanel(t('mainMenu.quit'), [
    el('p', { class: 'panel-note', text: t('ui.quit.cannotClose') }),
    closeBtn,
  ]);
  closeBtn.addEventListener('click', close);
}

// Tutoriel actif (le cas échéant) — démarré par-dessus une partie fraîche,
// voir `onTutorial` ci-dessous. `startGame`'s `onReturnToMenu` le dispose
// avant de revenir au menu (retour au menu pendant le tutoriel), sans quoi
// sa boucle d'overlay/ses écouteurs moteur survivraient à la partie qui les
// a créés — même risque de fuite que celui déjà corrigé pour `mountApp`.
let activeTutorial = null;

/** Fiche de création de Commandant → nouvelle partie, avec l'avertissement
 * d'écrasement habituel si une sauvegarde existe déjà. Partagé par
 * "Nouveau" et "Tutoriel" (le tutoriel démarre une vraie partie neuve,
 * voir DÉCISIONS du plan). `afterStart({engine, app})` est appelé une fois
 * la partie montée. */
function startNewGame(afterStart) {
  const proceed = () => {
    showCommanderCreation(host, {
      onCreate({ name, factionId }) {
        const fresh = createInitialState();
        fresh.commander.name = name || t('mainMenu.defaultCommanderName');
        const engine = new Engine(fresh);
        engine.selectFaction(factionId);
        saveState(engine.state); // écrase immédiatement la sauvegarde existante
        afterStart?.(startGame(engine.state));
      },
    });
  };
  if (hasSave()) {
    confirmDialog(t('mainMenu.overwriteWarning'), proceed);
  } else {
    proceed();
  }
}

function bootMenu() {
  host.className = 'menu-screen';
  showMainMenu(host, {
    hasSave: hasSave(),
    onContinue: () => {
      const { state, status } = loadState();
      startGame(state, status);
    },
    onNewGame: () => startNewGame(),
    onTutorial: () => {
      startNewGame(({ engine }) => {
        activeTutorial = startTutorial(engine);
      });
    },
    onAchievements: () => showAchievements(loadState().state),
    onOptions: () => showOptions(),
    onQuit: attemptQuit,
  });
}

function startGame(state, bootStatus) {
  host.className = 'app';
  const engine = new Engine(state);

  let offlineReport = null;
  const elapsed = Date.now() - state.savedAt;
  if (elapsed >= CONFIG.offlineMinMs) {
    const gains = computeOfflineGains(engine.state, elapsed);
    if (Object.keys(gains.gains).length > 0) {
      applyOfflineGains(engine.state, gains.gains);
      offlineReport = gains;
    }
  }

  const app = mountApp(host, engine, {
    offlineReport,
    onReturnToMenu: () => {
      activeTutorial?.dispose();
      activeTutorial = null;
      bootMenu();
    },
  });

  if (bootStatus === 'recovered') {
    app.notify(t('notify.saveRecovered'), 'error');
  } else if (bootStatus === 'reset') {
    app.notify(t('notify.saveReset'), 'info');
  }

  if (import.meta.env.DEV) {
    window.__starship.engine = engine;
  }

  return { engine, app };
}

bootMenu();
