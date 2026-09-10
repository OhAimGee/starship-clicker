// Point d'entrée. Charge la sauvegarde, calcule la progression hors-ligne,
// monte l'interface.
//
// L'ancien monolithe `src/legacy/` a été retiré : tout passe désormais par
// `src/game/` (moteur) et `src/ui/` (interface).

import './ui/fonts.css';
import './ui/styles.css';
import { CONFIG } from './data/config.js';
import { loadState } from './game/save.js';
import { Engine } from './game/engine.js';
import { computeOfflineGains, applyOfflineGains } from './game/offline.js';
import { initLang } from './i18n/index.js';
import { t } from './i18n/index.js';
import { mountApp } from './ui/app.js';

const { state, status } = loadState();
initLang(state.lang);

const engine = new Engine(state);

// Progression hors-ligne
let offlineReport = null;
if (status === 'loaded' && state.savedAt) {
  const elapsed = Date.now() - state.savedAt;
  if (elapsed >= CONFIG.offlineMinMs) {
    const gains = computeOfflineGains(engine.state, elapsed);
    if (Object.keys(gains.gains).length > 0) {
      applyOfflineGains(engine.state, gains.gains);
      offlineReport = gains;
    }
  }
}

const app = mountApp(document.getElementById('app'), engine, { offlineReport });

if (status === 'recovered') {
  app.notify(t('notify.saveRecovered'), 'error');
} else if (status === 'fresh') {
  app.notify(t('notify.welcome'), 'info');
}

if (import.meta.env.DEV) {
  window.__starship = { engine, state: () => engine.state };
}

// PWA : enregistrer le service worker en production (jeu installable, hors-ligne).
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      /* pas de SW : le jeu fonctionne quand même */
    });
  });
}
