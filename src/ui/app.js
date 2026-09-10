// Orchestrateur — construit le tableau d'affichage, relie le moteur au DOM,
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
import { formatNumber, formatBoard } from './format.js';
import { resourceCode } from '../data/resources.js';
import { icon, iconMarkup } from './icons.js';
import { createResourcesBoard } from './resources-board.js';
import { createNotifier } from './notifications.js';
import { notifyText } from './notify-text.js';
import { showOfflineReport, confirmDialog } from './modal.js';
import { bindHold } from './motion.js';
import { createFlap } from './flap.js';
import { createShopPanel } from './panels/shop.js';
import { createFleetPanel } from './panels/fleet.js';
import { createExplorationPanel } from './panels/exploration.js';
import { createTechnologyPanel } from './panels/technology.js';
import { createAscensionPanel } from './panels/ascension.js';

const TABS = ['shop', 'fleet', 'exploration', 'technology', 'ascension'];

export function mountApp(host, engine, { offlineReport } = {}) {
  host.replaceChildren();

  const resources = createResourcesBoard(engine);

  // — En-tête acier : deux relevés à l'échelle d'affichage (l'ancre de la page) —
  const wordmark = el('div', { class: 'wordmark' });
  const totalLabel = el('span', { class: 'readout-label' });
  const totalValue = el('span', { class: 'readout-value' });
  const civLabel = el('span', { class: 'readout-label' });
  const civValue = el('span', { class: 'readout-value civ-value' });
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

  const header = el('header', { class: 'board-header steel' }, [
    el('div', { class: 'board-header-top' }, [wordmark, langSelect]),
    el('div', { class: 'readouts' }, [
      el('div', { class: 'readout' }, [totalLabel, totalValue]),
      el('div', { class: 'readout readout-civ' }, [civLabel, civValue]),
    ]),
  ]);

  // — Contrôle LANCER —
  const launchLabel = el('span', { class: 'launch-label' });
  const launchFlap = createFlap('1');
  const launchFigure = el('span', { class: 'launch-figure' }, [
    '+',
    launchFlap.node,
    ' NRG',
  ]);
  const launch = el(
    'button',
    {
      class: 'launch',
      type: 'button',
      dataset: { action: 'click-mothership' },
      'aria-label': t('ui.mothership'),
    },
    [launchLabel, launchFigure]
  );
  const launchBay = el('div', { class: 'launch-bay' }, [launch]);
  bindHold(launch, () => engine.click());

  // — Sélecteur de terminaux —
  const tabButtons = new Map();
  const terminalBar = el('nav', {
    class: 'terminal-bar steel',
    role: 'tablist',
    'aria-label': t('ui.a11y.terminals'),
  });
  for (const key of TABS) {
    const btn = el(
      'button',
      {
        class: 'terminal-btn',
        type: 'button',
        role: 'tab',
        dataset: { action: 'tab', id: key },
      },
      [icon(key, 'terminal-icon'), el('span', { class: 'terminal-label' })]
    );
    tabButtons.set(key, btn);
    terminalBar.append(btn);
  }

  const panelHost = el('div', { class: 'panel-host' });

  // — Pied de page —
  const footStats = el('dl', { class: 'foot-stats stat-grid' });
  const resetBtn = el('button', {
    class: 'btn btn-danger',
    type: 'button',
    dataset: { action: 'reset' },
  });
  const footNote = el('p', { class: 'foot-note' });
  const footer = el('footer', { class: 'foot' }, [
    footStats,
    resetBtn,
    footNote,
  ]);

  const announcements = el('div', {
    class: 'announcements',
    'aria-live': 'polite',
  });

  host.append(
    header,
    resources.root,
    launchBay,
    el('main', { class: 'app-main' }, [panelHost]),
    footer,
    terminalBar,
    announcements
  );

  const notifier = createNotifier(announcements);

  // — Panneaux —
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
      btn.setAttribute('aria-selected', k === key ? 'true' : 'false');
    }
    clear(panelHost);
    panels[key].refresh();
    panelHost.append(panels[key].root);
  }

  // — Textes statiques (dépendent de la langue) —
  function renderStatic() {
    document.documentElement.lang = getLang();
    document.title = t('ui.title');
    wordmark.innerHTML = `${iconMarkup('fleet')}<span>${t('ui.title')}</span>`;
    civLabel.textContent = t('ui.civLevel');
    totalLabel.textContent = t('ui.stats.totalEnergy');
    launchLabel.textContent = t('ui.buttons.launch');
    launch.setAttribute('aria-label', t('ui.mothership'));
    for (const [key, btn] of tabButtons) {
      btn.querySelector('.terminal-label').textContent = t(`ui.tabs.${key}`);
    }
    resetBtn.textContent = t('ui.buttons.reset');
    footNote.textContent = t('ui.footer');
    langSelect.setAttribute('aria-label', t('ui.language'));
    resources.refresh();
    showTab(activeKey);
    updateDynamic();
  }

  // — Rafraîchissement par frame —
  function updateDynamic() {
    resources.update();
    launchFlap.set(formatNumber(engine.clickPower));
    civValue.textContent = engine.state.civilizationLevel.toFixed(1);
    totalValue.textContent = formatBoard(engine.state.totalProduced.energy);

    const rates = engine.netRates();
    const perSec = Object.entries(rates)
      .filter(([, v]) => Math.abs(v) > 0.001)
      .map(
        ([res, v]) =>
          `${v >= 0 ? '+' : ''}${formatNumber(v)} ${resourceCode(res)}`
      )
      .join('  ');
    clear(footStats);
    const stat = (label, value) =>
      footStats.append(
        el('div', {}, [el('span', { text: label }), el('b', { text: value })])
      );
    stat(t('ui.stats.perSecond'), perSec || '—');
    stat(t('ui.stats.fleetPower'), formatNumber(engine.fleetPower));
    stat(t('ui.stats.totalClicks'), formatNumber(engine.state.totalClicks));
    stat(
      t('ui.stats.conquered'),
      formatNumber(engine.state.exploration.conquered.length)
    );

    panels[activeKey].update();
  }

  // — Interactions —
  delegate(host, (action, id) => {
    switch (action) {
      case 'click-mothership':
        engine.click();
        break;
      case 'tab':
        showTab(id);
        break;
      case 'toggle-row':
        panels[activeKey].rowToggle?.(id);
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
      default:
        break;
    }
  });

  // — Événements moteur —
  engine.on('notify', (msg) =>
    notifier.push(notifyText(msg, engine), msg.level)
  );
  engine.on('unlock', () => panels[activeKey].refresh());
  engine.on('ascend', () => renderStatic());
  engine.on('reset', () => renderStatic());

  // — Sauvegarde —
  const saver = createThrottledSaver(() => engine.state, {
    minIntervalMs: 10000,
  });
  for (const ev of ['click', 'changed']) engine.on(ev, () => saver.request());
  window.addEventListener('beforeunload', () => saver.flushNow());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') saver.flushNow();
  });

  onLangChange(() => renderStatic());

  // — Boucle de rendu —
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
