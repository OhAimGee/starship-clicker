// Orchestrateur — construit le tableau d'affichage, relie le moteur au DOM,
// fait tourner la boucle de rendu.
//
// Coquille mobile (< 720 px, voir styles.css) : en-tête (burger · titre ·
// Civ.) → bandeau de jetons → bandeau objectif → pager de terminaux → contenu
// défilant → LANCER collé en bas. ≥ 720 px, ce sont les mêmes éléments en
// disposition desktop : l'ordre visuel est porté par le CSS, pas par le DOM.

import { el, clear, delegate } from './dom.js';
import {
  t,
  getLang,
  setLang,
  onLangChange,
  AVAILABLE_LANGS,
} from '../i18n/index.js';
import { createThrottledSaver } from '../game/save.js';
import { formatNumber, formatRateNumber, formatBoard } from './format.js';
import { resourceCode } from '../data/resources.js';
import { ACHIEVEMENTS } from '../data/achievements.js';
import { icon, iconMarkup } from './icons.js';
import { createResourcesBoard } from './resources-board.js';
import { objectiveProgressText } from './objective-text.js';
import { createNotifier } from './notifications.js';
import { notifyText } from './notify-text.js';
import { showOfflineReport, confirmDialog } from './modal.js';
import { showFactionSelect } from './faction-select.js';
import { showAscensionReward } from './ascension-reward.js';
import { showBattleReport } from './battle-report.js';
import { showRunSummary } from './run-summary.js';
import { showSystemDetail } from './system-detail.js';
import { showAchievements } from './achievements-screen.js';
import { showOptions } from './options-screen.js';
import { createDrawer } from './drawer.js';
import { createPanelSwiper } from './panel-swiper.js';
import { bindHold } from './motion.js';
import { createFlap } from './flap.js';
import { createShopPanel } from './panels/shop.js';
import { createFleetPanel } from './panels/fleet.js';
import { createExplorationPanel } from './panels/exploration.js';
import { createTechnologyPanel } from './panels/technology.js';
import { createAscensionPanel } from './panels/ascension.js';

const TABS = ['shop', 'fleet', 'exploration', 'technology', 'ascension'];

const isMobile = () => window.matchMedia('(max-width: 719px)').matches;
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setText = (node, text) => {
  if (node.textContent !== text) node.textContent = text;
};

export function mountApp(host, engine, { offlineReport, onReturnToMenu } = {}) {
  host.replaceChildren();

  const resources = createResourcesBoard(engine);

  // — Colonne latérale desktop (≥1280px, voir styles.css) — ressources +
  // puissance de flotte, toujours visibles. `display: contents` par défaut :
  // en dessous du seuil, ce conteneur ne génère aucune boîte et
  // `resources.root` reste un enfant effectif de `.app` ; `runStatus` reste
  // masqué (`display: none`) jusque-là (la puissance de flotte est déjà dans
  // l'onglet Flotte et dans le pied de page).
  const runFleetLabel = el('span', { text: t('ui.stats.fleetPower') });
  const runFleetValue = el('b');
  const runStatus = el(
    'div',
    { class: 'run-status', 'aria-label': t('ui.a11y.runStatus') },
    [
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [runFleetLabel, runFleetValue]),
      ]),
    ]
  );
  const sidebar = el('div', { class: 'app-sidebar' }, [
    resources.root,
    runStatus,
  ]);

  // — En-tête acier : burger (mobile) · marque · relevés · entrées de menu
  // (desktop) · langue (desktop) —
  const burger = el(
    'button',
    {
      class: 'burger',
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
      dataset: { action: 'open-drawer' },
    },
    [icon('menu', 'burger-icon')]
  );
  const wordmark = el('div', { class: 'wordmark' });
  const totalLabel = el('span', { class: 'readout-label' });
  const totalValue = el('span', { class: 'readout-value' });
  const civLabel = el('span', { class: 'readout-label' });
  const civValue = el('span', { class: 'readout-value civ-value' });
  const headerActions = el('nav', { class: 'header-actions' });
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
    el('div', { class: 'board-header-top' }, [
      burger,
      wordmark,
      el('div', { class: 'readouts' }, [
        el('div', { class: 'readout' }, [totalLabel, totalValue]),
        el('div', { class: 'readout readout-civ' }, [civLabel, civValue]),
      ]),
      headerActions,
      langSelect,
    ]),
  ]);

  // — Bandeau objectif de run (permanent) —
  const objectiveLabelEl = el('span', { class: 'objective-bar-label' });
  const objectiveNameEl = el('span', { class: 'objective-bar-name' });
  const objectiveValueEl = el('b', { class: 'objective-bar-value' });
  const objectiveBar = el('div', { class: 'objective-bar', role: 'group' }, [
    objectiveLabelEl,
    objectiveNameEl,
    objectiveValueEl,
  ]);

  // — Contrôle LANCER (baie collée en bas sur mobile ; les points de
  // pagination flottent juste au-dessus de la baie) —
  const launchLabel = el('span', { class: 'launch-label' });
  const launchFlap = createFlap('1');
  const launchFigure = el(
    'span',
    { class: 'launch-figure', 'aria-hidden': 'true' },
    ['+', launchFlap.node, ' NRG']
  );
  const launch = el(
    'button',
    {
      class: 'launch',
      type: 'button',
      dataset: { action: 'click-mothership' },
      'aria-label': `${t('ui.buttons.launch')} — ${t('ui.mothership')}`,
    },
    [launchLabel, launchFigure]
  );
  const pagerDots = el(
    'div',
    { class: 'pager-dots', 'aria-hidden': 'true' },
    TABS.map((key) =>
      el('span', { class: 'pager-dot', dataset: { tab: key } })
    )
  );
  const launchBay = el('div', { class: 'launch-bay' }, [pagerDots, launch]);
  bindHold(launch, () => engine.click());

  // — Sélecteur de terminaux (pager) —
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
      [
        icon(key, 'terminal-icon'),
        el('span', { class: 'terminal-label' }),
        el('span', { class: 'terminal-label-short', 'aria-hidden': 'true' }),
      ]
    );
    tabButtons.set(key, btn);
    terminalBar.append(btn);
  }
  // Navigation ←/→ dans le pager (tablist ARIA : tabindex itinérant, voir showTab).
  terminalBar.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const step = e.key === 'ArrowRight' ? 1 : -1;
    const next =
      TABS[(TABS.indexOf(activeKey) + step + TABS.length) % TABS.length];
    e.preventDefault();
    showTab(next, { animate: true });
    tabButtons.get(next).focus();
  });

  const panelHost = el('div', { class: 'panel-host' });

  // — Pied de page (dans la zone défilante : sur mobile il défile avec le
  // panneau ; Recommencer / Menu principal vivent dans le tiroir) —
  const footStats = el('dl', { class: 'foot-stats stat-grid' });
  const footNote = el('p', { class: 'foot-note' });
  const footer = el('footer', { class: 'foot' }, [footStats, footNote]);
  const main = el('main', { class: 'app-main' }, [panelHost, footer]);

  const announcements = el('div', {
    class: 'announcements',
    'aria-live': 'polite',
  });

  host.append(
    header,
    objectiveBar,
    terminalBar,
    sidebar,
    launchBay,
    main,
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

  /** Glissade d'entrée du nouveau panneau (mobile, hors mouvement réduit). */
  function slideIn(direction) {
    if (!isMobile() || prefersReducedMotion()) return;
    panelHost.animate?.(
      [
        { transform: `translateX(${direction * 32}%)`, opacity: 0.2 },
        { transform: 'translateX(0)', opacity: 1 },
      ],
      { duration: 240, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' }
    );
  }

  function showTab(key, { animate = false } = {}) {
    if (!panels[key]) return;
    const previous = activeKey;
    activeKey = key;
    for (const [k, btn] of tabButtons) {
      btn.setAttribute('aria-selected', k === key ? 'true' : 'false');
      btn.tabIndex = k === key ? 0 : -1;
    }
    for (const dot of pagerDots.children) {
      dot.classList.toggle('is-active', dot.dataset.tab === key);
    }
    clear(panelHost);
    panels[key].refresh();
    panelHost.append(panels[key].root);
    if (key !== previous) {
      main.scrollTop = 0; // nouveau terminal : on repart du haut (mobile)
      if (animate) slideIn(TABS.indexOf(key) > TABS.indexOf(previous) ? 1 : -1);
    }
  }

  // — Tiroir (mobile) et boutons d'en-tête (desktop) : mêmes entrées —
  const drawer = createDrawer(host, engine, {
    trigger: burger,
    getEntries: menuEntries,
  });

  function menuEntries() {
    const state = engine.state;
    const unlocked = ACHIEVEMENTS.filter(
      (a) => state.achievements[a.id]?.unlocked
    ).length;
    return [
      {
        id: 'achievements',
        iconId: 'ascensionPoints',
        label: t('ui.drawer.achievements'),
        sub: t('ui.drawer.achievementsSub', {
          done: unlocked,
          total: ACHIEVEMENTS.length,
        }),
        run: ({ back }) => showAchievements(engine.state, { onBack: back }),
      },
      {
        id: 'options',
        iconId: 'technology',
        label: t('ui.drawer.options'),
        sub: t('ui.drawer.optionsSub'),
        run: ({ back }) => showOptions({ onBack: back }),
      },
      {
        id: 'mainMenu',
        iconId: 'chevron',
        label: t('ui.drawer.mainMenu'),
        sub: t('ui.drawer.mainMenuSub'),
        run: () => {
          dispose();
          onReturnToMenu?.();
        },
      },
      {
        id: 'reset',
        danger: true,
        iconId: 'close',
        label: t('ui.drawer.reset'),
        run: () =>
          confirmDialog(t('ui.reset.confirm'), () => {
            engine.reset();
            saver.flushNow();
          }),
      },
    ];
  }

  function renderHeaderActions() {
    headerActions.replaceChildren(
      ...menuEntries().map((entry) => {
        const btn = el('button', {
          class: `header-btn${entry.danger ? ' is-danger' : ''}`,
          type: 'button',
          text: entry.label,
        });
        btn.addEventListener('click', () => entry.run({}));
        return btn;
      })
    );
  }

  // — Swipe d'onglet (mobile) — Pointer Events tactiles, voir panel-swiper.js.
  // Le tiroir ouvert rend `main` inerte : aucun geste ne le traverse.
  createPanelSwiper(main, {
    track: panelHost,
    tabs: TABS,
    getActive: () => activeKey,
    isEnabled: () => isMobile() && !drawer.isOpen(),
    onSwitch: (key) => showTab(key, { animate: true }),
  });

  // — Textes statiques (dépendent de la langue) —
  function renderStatic() {
    document.documentElement.lang = getLang();
    document.title = t('ui.title');
    wordmark.innerHTML = `${iconMarkup('fleet')}<span>${t('ui.title')}</span>`;
    civLabel.textContent = t('ui.civShort');
    totalLabel.textContent = t('ui.producedShort');
    launchLabel.textContent = t('ui.buttons.launch');
    launch.setAttribute(
      'aria-label',
      `${t('ui.buttons.launch')} — ${t('ui.mothership')}`
    );
    burger.setAttribute('aria-label', t('ui.drawer.open'));
    for (const [key, btn] of tabButtons) {
      btn.querySelector('.terminal-label').textContent = t(`ui.tabs.${key}`);
      btn.querySelector('.terminal-label-short').textContent = t(
        `ui.tabsShort.${key}`
      );
      btn.setAttribute('aria-label', t(`ui.tabs.${key}`));
    }
    footNote.textContent = t('ui.footer');
    langSelect.setAttribute('aria-label', t('ui.language'));
    objectiveLabelEl.textContent = t('ui.objectiveBar.label');
    objectiveBar.setAttribute('aria-label', t('ui.a11y.runStatus'));
    runFleetLabel.textContent = t('ui.stats.fleetPower');
    runStatus.setAttribute('aria-label', t('ui.a11y.runStatus'));
    headerActions.setAttribute('aria-label', t('ui.drawer.title'));
    renderHeaderActions();
    resources.refresh();
    showTab(activeKey);
    updateDynamic();
  }

  // — Rafraîchissement par frame —
  function updateDynamic() {
    const rates = engine.netRates();
    resources.update(rates);

    const obj = engine.state.run.objective;
    setText(objectiveNameEl, obj ? t(`ui.objective.${obj.type}`) : '—');
    setText(
      objectiveValueEl,
      obj ? objectiveProgressText(engine, engine.state, obj) : '—'
    );
    runFleetValue.textContent = formatNumber(engine.fleetPower);

    launchFlap.set(formatNumber(engine.clickPower));
    civValue.textContent = engine.state.civilizationLevel.toFixed(1);
    totalValue.textContent = formatBoard(engine.state.totalProduced.energy);

    const perSec = Object.entries(rates)
      .filter(([, v]) => Math.abs(v) > 0.001)
      .map(
        ([res, v]) =>
          `${v >= 0 ? '+' : ''}${formatRateNumber(v)} ${resourceCode(res)}`
      )
      .join('  ');
    clear(footStats);
    const stat = (label, value) =>
      footStats.append(
        el('div', {}, [el('dt', { text: label }), el('dd', { text: value })])
      );
    stat(t('ui.stats.perSecond'), perSec || '—');
    stat(t('ui.stats.fleetPower'), formatNumber(engine.fleetPower));
    stat(t('ui.stats.totalClicks'), formatNumber(engine.state.totalClicks));
    stat(
      t('ui.stats.conquered'),
      formatNumber(engine.state.run.exploration.conquered.length)
    );

    panels[activeKey].update();
  }

  // — Interactions —
  const detachDelegate = delegate(host, (action, id) => {
    switch (action) {
      case 'click-mothership':
        engine.click();
        break;
      case 'tab':
        showTab(id, { animate: true });
        break;
      case 'open-drawer':
        drawer.open();
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
      case 'open-system':
        showSystemDetail(engine, Number(id));
        break;
      case 'buy-prestige-upgrade':
        engine.buyPrestigeUpgrade(id);
        break;
      case 'buy-faction-skill':
        engine.buyFactionSkill(id);
        break;
      case 'buy-run-skill':
        engine.buyRunSkill(id);
        break;
      case 'end-run':
        engine.endRun();
        break;
      case 'ascend':
        engine.ascend();
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
  engine.on('battle-resolved', (entry) => showBattleReport(entry));
  engine.on('run-ended', ({ points, summary }) => {
    renderStatic();
    showRunSummary({ points, summary }, { onContinue: maybeShowFactionSelect });
  });
  engine.on('ascend-choice', ({ options }) => {
    renderStatic();
    showAscensionReward(engine, options, {
      onChosen: () => {
        renderStatic();
        maybeShowFactionSelect();
      },
    });
  });
  engine.on('reset', () => {
    renderStatic();
    maybeShowFactionSelect();
  });

  function maybeShowFactionSelect() {
    if (!engine.state.run.factionId) {
      showFactionSelect(engine, { onSelected: renderStatic });
    }
  }

  // — Sauvegarde —
  const saver = createThrottledSaver(() => engine.state, {
    minIntervalMs: 10000,
  });
  for (const ev of ['click', 'changed']) engine.on(ev, () => saver.request());
  const handleBeforeUnload = () => saver.flushNow();
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') saver.flushNow();
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  const detachLangChange = onLangChange(() => renderStatic());

  // — Boucle de rendu —
  // `host` (#app) est réutilisé d'une partie à l'autre (retour au menu
  // principal puis Continuer/Nouveau relance `mountApp` sur le même
  // élément) : sans `dispose()`, cette boucle (et les écouteurs
  // window/document/i18n ci-dessus) continuerait indéfiniment en arrière-
  // plan pour CHAQUE session passée, à sauvegarder l'état d'un moteur
  // abandonné par-dessus la session active — voir l'entrée « Menu
  // principal » de `menuEntries` ci-dessus, seul point d'appel actuel.
  let disposed = false;
  let rafId = null;
  let last = performance.now();
  function frame(now) {
    if (disposed) return;
    const dt = now - last;
    last = now;
    engine.advance(dt);
    updateDynamic();
    saver.flush();
    rafId = requestAnimationFrame(frame);
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (rafId != null) cancelAnimationFrame(rafId);
    detachDelegate();
    detachLangChange();
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    saver.flushNow();
  }

  renderStatic();
  maybeShowFactionSelect();
  if (offlineReport) showOfflineReport(offlineReport);
  rafId = requestAnimationFrame(frame);

  return {
    showTab,
    notify: (message, level) => notifier.push(message, level),
    dispose,
  };
}
