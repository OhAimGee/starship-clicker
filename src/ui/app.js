// Orchestrateur de l'interface : construit la coquille, relie le moteur au DOM,
// fait tourner la boucle de rendu.

import { el, clear, delegate } from './dom.js';
import {
  t,
  getLang,
  setLang,
  onLangChange,
  AVAILABLE_LANGS,
} from '../i18n/index.js';
import { createThrottledSaver } from '../game/save.js';
import { formatNumber } from './format.js';
import { resourceIcon } from '../data/resources.js';
import { createResourcesBar } from './resources-bar.js';
import { createNotifier } from './notifications.js';
import { notifyText } from './notify-text.js';
import { showOfflineReport, confirmDialog } from './modal.js';
import { clickBurst } from './motion.js';
import { createShopPanel } from './panels/shop.js';
import { createFleetPanel } from './panels/fleet.js';
import { createExplorationPanel } from './panels/exploration.js';
import { createTechnologyPanel } from './panels/technology.js';
import { createAscensionPanel } from './panels/ascension.js';

const TAB_KEYS = ['shop', 'fleet', 'exploration', 'technology', 'ascension'];

export function mountApp(host, engine, { offlineReport } = {}) {
  host.replaceChildren();

  // ─── Coquille ──────────────────────────────────────────────────────────────
  const resourcesBar = createResourcesBar(engine);

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

  const title = el('h1', { class: 'app-title' });
  const tagline = el('p', { class: 'app-tagline' });
  const header = el('header', { class: 'app-header' }, [
    el('div', { class: 'app-header-top' }, [
      el('div', {}, [title, tagline]),
      langSelect,
    ]),
    resourcesBar.root,
  ]);

  // Vaisseau mère
  const clickValue = el('span', { class: 'mothership-perclick' });
  const civValue = el('span');
  const mothershipBtn = el(
    'button',
    {
      class: 'mothership',
      type: 'button',
      dataset: { action: 'click-mothership' },
      'aria-label': t('ui.mothership'),
    },
    [
      el('span', {
        class: 'mothership-icon',
        'aria-hidden': 'true',
        text: '🛸',
      }),
    ]
  );
  const mothershipSection = el('section', { class: 'mothership-section' }, [
    mothershipBtn,
    el('div', { class: 'mothership-stats' }, [
      el('p', { text: t('ui.mothership') }),
      el('p', {}, [clickValue]),
      el('p', {}, [`${t('ui.civLevel')} : `, civValue]),
    ]),
  ]);

  // Onglets
  const tabButtons = new Map();
  const tabNav = el('nav', { class: 'tab-nav', role: 'tablist' });
  for (const key of TAB_KEYS) {
    const btn = el('button', {
      class: 'tab-btn',
      type: 'button',
      role: 'tab',
      dataset: { action: 'tab', id: key },
    });
    tabButtons.set(key, btn);
    tabNav.append(btn);
  }
  const panelHost = el('div', { class: 'panel-host' });

  // Pied de page
  const footStats = el('dl', { class: 'foot-stats' });
  const resetBtn = el('button', {
    class: 'btn btn-danger btn-reset',
    type: 'button',
    dataset: { action: 'reset' },
  });
  const footer = el('footer', { class: 'app-footer' }, [
    footStats,
    resetBtn,
    el('p', { class: 'app-footer-note' }),
  ]);

  const toasts = el('div', { class: 'toasts', 'aria-live': 'polite' });

  host.append(
    header,
    el('main', { class: 'app-main' }, [mothershipSection, tabNav, panelHost]),
    footer,
    toasts
  );

  const notifier = createNotifier(toasts);

  // ─── Panneaux ──────────────────────────────────────────────────────────────
  const panels = {
    shop: createShopPanel(engine),
    fleet: createFleetPanel(engine),
    exploration: createExplorationPanel(engine),
    technology: createTechnologyPanel(engine),
    ascension: createAscensionPanel(engine),
  };
  let activeKey = 'shop';

  function showTab(key) {
    if (!panels[key]) return;
    activeKey = key;
    for (const [k, btn] of tabButtons) {
      const on = k === key;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    }
    clear(panelHost);
    panels[key].refresh();
    panelHost.append(panels[key].root);
  }

  // ─── Textes statiques (dépendent de la langue) ─────────────────────────────
  function renderStatic() {
    document.documentElement.lang = getLang();
    document.title = t('ui.title');
    title.textContent = t('ui.title');
    tagline.textContent = t('ui.tagline');
    mothershipBtn.setAttribute('aria-label', t('ui.mothership'));
    for (const [key, btn] of tabButtons) btn.textContent = t(`ui.tabs.${key}`);
    resetBtn.textContent = t('ui.buttons.reset');
    footer.querySelector('.app-footer-note').textContent = t('ui.footer');
    langSelect.setAttribute('aria-label', t('ui.language'));
    resourcesBar.refresh();
    showTab(activeKey);
    updateDynamic();
  }

  // ─── Rafraîchissement par frame ────────────────────────────────────────────
  function updateDynamic() {
    resourcesBar.update();
    clickValue.textContent = t('ui.perClick', {
      n: formatNumber(engine.clickPower),
    });
    civValue.textContent = engine.state.civilizationLevel.toFixed(1);

    const rates = engine.netRates();
    const perSec = Object.entries(rates)
      .filter(([, v]) => Math.abs(v) > 0.001)
      .map(
        ([res, v]) =>
          `${resourceIcon(res)} ${v >= 0 ? '+' : ''}${formatNumber(v)}`
      )
      .join('  ');
    clear(footStats);
    const stat = (label, value) => {
      footStats.append(el('dt', { text: label }), el('dd', { text: value }));
    };
    stat(
      t('ui.stats.totalEnergy'),
      formatNumber(engine.state.totalProduced.energy)
    );
    stat(t('ui.stats.perSecond'), perSec || '—');
    stat(t('ui.stats.fleetPower'), formatNumber(engine.fleetPower));
    stat(
      t('ui.stats.conquered'),
      formatNumber(engine.state.exploration.conquered.length)
    );

    panels[activeKey].update();
  }

  // ─── Interactions ─────────────────────────────────────────────────────────
  delegate(host, (action, id, event) => {
    switch (action) {
      case 'click-mothership': {
        const power = engine.click();
        clickBurst(mothershipBtn, event, formatNumber(power));
        break;
      }
      case 'tab':
        showTab(id);
        break;
      case 'buy-generator':
        engine.buyGenerator(id);
        break;
      case 'buy-click-upgrade':
        engine.buyClickUpgrade(id);
        break;
      case 'buy-ship':
        engine.buyShip(id);
        break;
      case 'research':
        engine.research(id);
        break;
      case 'explore':
        engine.explore(Number(id));
        break;
      case 'buy-prestige-upgrade':
        engine.buyPrestigeUpgrade(id);
        break;
      case 'ascend':
        engine.ascend();
        break;
      case 'reset':
        confirmDialog(t('ui.reset.confirm'), () => {
          engine.reset();
          saver.flushNow();
        });
        break;
    }
  });

  // ─── Événements moteur ────────────────────────────────────────────────────
  engine.on('notify', (msg) =>
    notifier.push(notifyText(msg, engine), msg.level)
  );
  engine.on('unlock', () => panels[activeKey].refresh());
  engine.on('ascend', () => renderStatic());
  engine.on('reset', () => renderStatic());

  // ─── Sauvegarde ──────────────────────────────────────────────────────────
  const saver = createThrottledSaver(() => engine.state, {
    minIntervalMs: 10000,
  });
  const requestSave = () => saver.request();
  for (const ev of ['click', 'changed']) engine.on(ev, requestSave);
  window.addEventListener('beforeunload', () => saver.flushNow());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saver.flushNow();
  });

  onLangChange(() => renderStatic());

  // ─── Boucle de rendu ─────────────────────────────────────────────────────
  let last = performance.now();
  function frame(now) {
    const dt = now - last;
    last = now;
    engine.advance(dt);
    updateDynamic();
    saver.flush();
    requestAnimationFrame(frame);
  }

  renderStatic();
  if (offlineReport) showOfflineReport(offlineReport);
  requestAnimationFrame(frame);

  return {
    showTab,
    notify: (message, level) => notifier.push(message, level),
  };
}
