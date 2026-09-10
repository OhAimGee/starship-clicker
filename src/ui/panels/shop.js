// Terminal DÉPARTS : générateurs (services programmés) + améliorations du clic.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { GENERATORS } from '../../data/generators.js';
import { CLICK_UPGRADES } from '../../data/upgrades.js';
import { resourceCode } from '../../data/resources.js';
import { revealList } from '../reveal.js';
import { formatNumber, formatRate, lockHint, timeCode } from '../format.js';
import { boardRow, sectionHead, setFacts, setLoadBar } from '../board-row.js';
import { generatorIconId, clickUpgradeIconId } from '../icon-map.js';

export function createShopPanel(engine) {
  const root = el('section', { class: 'panel' });
  let rows = new Map(); // id -> { ...boardRow, def, kind, teased }

  function refresh() {
    const state = engine.state;
    clear(root);
    rows = new Map();

    const genList = el('ul', { class: 'board-list' });
    revealList(state, GENERATORS).forEach(({ def, vis }, i) => {
      const row = boardRow({
        id: def.id,
        action: 'buy-generator',
        iconId: generatorIconId(def.id),
        code: timeCode(i),
        name: t(`generator.${def.id}.name`),
        desc: t(`generator.${def.id}.desc`),
      });
      genList.append(row.root);
      rows.set(def.id, { ...row, def, kind: 'gen', teased: vis === 'teased' });
    });

    const upgList = el('ul', { class: 'board-list' });
    CLICK_UPGRADES.forEach((def, i) => {
      const row = boardRow({
        id: def.id,
        action: 'buy-click-upgrade',
        iconId: clickUpgradeIconId(def.id),
        code: timeCode(20 + i),
        name: t(`clickUpgrade.${def.id}.name`),
        desc: t(`clickUpgrade.${def.id}.desc`),
      });
      upgList.append(row.root);
      rows.set(def.id, { ...row, def, kind: 'upg' });
    });

    root.append(
      el('h2', { text: t('ui.panels.shop') }),
      sectionHead(t('ui.sections.generators')),
      genList,
      sectionHead(t('ui.sections.clickUpgrades')),
      upgList
    );
    update();
  }

  function update() {
    const state = engine.state;
    for (const [id, row] of rows) {
      row.kind === 'gen'
        ? updateGen(state, id, row)
        : updateUpg(state, id, row);
    }
  }

  function updateGen(state, id, row) {
    const { def, refs, teased } = row;
    const count = state.generators[id]?.count ?? 0;
    const cost = engine.generatorCost(id);
    const afford = (state.resources[def.costResource] ?? 0) >= cost;

    const rate = formatRate((count || 1) * def.rate, def.resource);
    refs.sub.textContent = count ? `×${formatNumber(count)}  ·  ${rate}` : rate;
    refs.count.textContent = '';
    setLoadBar(refs.loadBar, count);
    refs.cost.textContent = `${formatNumber(cost)} ${resourceCode(def.costResource)}`;

    setFacts(refs.drawerFacts, [
      [t('ui.labels.produces'), formatRate(def.rate, def.resource)],
      [t('ui.labels.consumes'), resourceCode(def.costResource)],
      [t('ui.stats.owned'), formatNumber(count)],
    ]);

    row.root.dataset.state = teased ? 'locked' : afford ? 'afford' : 'cant';
    refs.main.disabled = teased || !afford;
    refs.drawerLock.hidden = !teased;
    if (teased) refs.drawerLock.textContent = lockHint(def.unlock);
  }

  function updateUpg(state, id, row) {
    const { refs } = row;
    const entry = state.clickUpgrades[id];
    const cost = engine.clickUpgradeCost(id);
    const afford = state.resources.energy >= cost;
    const owned =
      id === 'autoClicker' ? (entry.count ?? 0) : (entry.level ?? 0);

    refs.sub.textContent =
      id === 'autoClicker'
        ? t('ui.labels.owned', { n: owned })
        : t('ui.labels.level', { n: owned });
    refs.count.textContent = '';
    setLoadBar(refs.loadBar, owned);
    refs.cost.textContent = `${formatNumber(cost)} NRG`;
    setFacts(refs.drawerFacts, [
      [t(`clickUpgrade.${id}.name`), t(`clickUpgrade.${id}.desc`)],
    ]);
    row.root.dataset.state = afford ? 'afford' : 'cant';
    refs.main.disabled = !afford;
  }

  return {
    root,
    refresh,
    update,
    key: 'shop',
    rowToggle: (id) => rows.get(id)?.toggle(),
  };
}
