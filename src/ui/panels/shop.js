// Onglet Boutique : générateurs + améliorations du vaisseau.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { GENERATORS } from '../../data/generators.js';
import { CLICK_UPGRADES } from '../../data/upgrades.js';
import { resourceIcon } from '../../data/resources.js';
import { revealList } from '../reveal.js';
import { formatNumber, lockHint, formatRate } from '../format.js';
import { purchaseCard } from './card.js';

export function createShopPanel(engine) {
  const root = el('section', { class: 'panel' });
  let genCards = new Map();
  let upgCards = new Map();

  function refresh() {
    const state = engine.state;
    clear(root);
    genCards = new Map();
    upgCards = new Map();

    const genList = el('ul', { class: 'card-grid' });
    for (const { def, vis } of revealList(state, GENERATORS)) {
      const teased = vis === 'teased';
      const card = purchaseCard({
        action: 'buy-generator',
        id: def.id,
        icon: resourceIcon(def.resource),
        name: t(`generator.${def.id}.name`),
        desc: t(`generator.${def.id}.desc`),
        buttonLabel: t('ui.buttons.buy'),
        teased,
        lockHint: lockHint(def.unlock),
      });
      genList.append(card.root);
      genCards.set(def.id, { ...card, def, teased });
    }

    const upgList = el('ul', { class: 'card-grid' });
    for (const def of CLICK_UPGRADES) {
      const card = purchaseCard({
        action: 'buy-click-upgrade',
        id: def.id,
        icon: def.icon,
        name: t(`clickUpgrade.${def.id}.name`),
        desc: t(`clickUpgrade.${def.id}.desc`),
        buttonLabel: t('ui.buttons.buy'),
        teased: false,
      });
      upgList.append(card.root);
      upgCards.set(def.id, { ...card, def });
    }

    root.append(
      el('h2', { text: t('ui.panels.shop') }),
      el('h3', { text: t('ui.sections.generators') }),
      genList,
      el('h3', { text: t('ui.sections.clickUpgrades') }),
      upgList
    );
    update();
  }

  function update() {
    const state = engine.state;

    for (const [id, card] of genCards) {
      const { def, refs, teased } = card;
      const count = state.generators[id]?.count ?? 0;
      refs.meta.textContent =
        `${t('ui.labels.owned', { n: count })} · ` +
        `${formatRate(def.rate, def.resource)} · ` +
        `${t('ui.labels.consumes')} ${resourceIcon(def.costResource)}`;
      if (teased) continue;
      const cost = engine.generatorCost(id);
      const affordable = (state.resources[def.costResource] ?? 0) >= cost;
      refs.cost.textContent = `${t('ui.labels.cost')} : ${formatNumber(cost)} ${resourceIcon(def.costResource)}`;
      refs.button.disabled = !affordable;
      card.root.classList.toggle('affordable', affordable);
    }

    for (const [id, card] of upgCards) {
      const { refs } = card;
      const entry = state.clickUpgrades[id];
      const cost = engine.clickUpgradeCost(id);
      const affordable = state.resources.energy >= cost;
      refs.meta.textContent =
        id === 'autoClicker'
          ? t('ui.labels.owned', { n: entry.count ?? 0 })
          : t('ui.labels.level', { n: entry.level ?? 0 });
      refs.cost.textContent = `${t('ui.labels.cost')} : ${formatNumber(cost)} ${resourceIcon('energy')}`;
      refs.button.disabled = !affordable;
      card.root.classList.toggle('affordable', affordable);
    }
  }

  return { root, refresh, update, key: 'shop' };
}
