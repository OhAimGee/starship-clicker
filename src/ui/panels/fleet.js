// Terminal FLOTTE : construction des vaisseaux.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { SHIPS } from '../../data/fleet.js';

import { canAfford } from '../../game/economy.js';
import { revealList } from '../reveal.js';
import {
  formatNumber,
  formatCost,
  shortCost,
  lockHint,
  timeCode,
} from '../format.js';
import { boardRow, sectionHead, setFacts, setLoadBar } from '../board-row.js';
import { shipIconId } from '../icon-map.js';

export function createFleetPanel(engine) {
  const root = el('section', { class: 'panel' });
  let rows = new Map();
  let statPower;
  let statMaint;

  function refresh() {
    clear(root);
    rows = new Map();
    statPower = el('b');
    statMaint = el('b');

    const list = el('ul', { class: 'board-list' });
    revealList(engine.state, SHIPS).forEach(({ def, vis }, i) => {
      const row = boardRow({
        id: def.id,
        action: 'buy-ship',
        iconId: shipIconId(def.id),
        code: timeCode(i * 3),
        name: t(`ship.${def.id}.name`),
        desc: t(`ship.${def.id}.desc`),
      });
      list.append(row.root);
      rows.set(def.id, { ...row, def, teased: vis === 'teased' });
    });

    root.append(
      el('h2', { text: t('ui.panels.fleet') }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [
          el('span', { text: t('ui.stats.fleetPower') }),
          statPower,
        ]),
        el('li', {}, [
          el('span', { text: t('ui.labels.maintenanceTotal') }),
          statMaint,
        ]),
      ]),
      sectionHead(t('ui.sections.ships')),
      list
    );
    update();
  }

  function update() {
    const state = engine.state;
    statPower.textContent = formatNumber(engine.fleetPower);
    statMaint.textContent = `${formatNumber(engine.fleetMaintenance)} NRG/s`;

    for (const [id, row] of rows) {
      const { def, refs, teased } = row;
      const count = state.ships[id]?.count ?? 0;
      const cost = engine.shipCost(id);
      const afford = canAfford(state, cost);

      const atk = `${t('ui.labels.attack')} ${formatNumber(def.attack)}`;
      refs.sub.textContent = count ? `×${formatNumber(count)}  ·  ${atk}` : atk;
      refs.count.textContent = '';
      setLoadBar(refs.loadBar, count);
      refs.cost.textContent = shortCost(cost);

      setFacts(refs.drawerFacts, [
        [t('ui.labels.attack'), formatNumber(def.attack)],
        [t('ui.labels.maintenance'), `${formatNumber(def.maintenance)} NRG/s`],
        [t('ui.labels.cost'), formatCost(cost)],
      ]);

      row.root.dataset.state = teased ? 'locked' : afford ? 'afford' : 'cant';
      refs.main.disabled = teased || !afford;
      refs.drawerLock.hidden = !teased;
      if (teased) refs.drawerLock.textContent = lockHint(def.unlock);
    }
  }

  return {
    root,
    refresh,
    update,
    key: 'fleet',
    rowToggle: (id) => rows.get(id)?.toggle(),
  };
}
