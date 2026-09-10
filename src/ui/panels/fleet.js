// Onglet Flotte : construction des vaisseaux.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { SHIPS } from '../../data/fleet.js';
import { resourceIcon } from '../../data/resources.js';
import { canAfford } from '../../game/economy.js';
import { revealList } from '../reveal.js';
import { formatNumber, formatCost, lockHint } from '../format.js';
import { purchaseCard } from './card.js';

export function createFleetPanel(engine) {
  const root = el('section', { class: 'panel' });
  let cards = new Map();
  let statPower;
  let statMaint;

  function refresh() {
    clear(root);
    cards = new Map();
    statPower = el('strong');
    statMaint = el('strong');

    const list = el('ul', { class: 'card-grid' });
    for (const { def, vis } of revealList(engine.state, SHIPS)) {
      const teased = vis === 'teased';
      const card = purchaseCard({
        action: 'buy-ship',
        id: def.id,
        icon: def.icon,
        name: t(`ship.${def.id}.name`),
        desc: t(`ship.${def.id}.desc`),
        buttonLabel: t('ui.buttons.build'),
        teased,
        lockHint: lockHint(def.unlock),
      });
      list.append(card.root);
      cards.set(def.id, { ...card, def, teased });
    }

    root.append(
      el('h2', { text: t('ui.panels.fleet') }),
      el('p', { class: 'panel-stats' }, [
        `${t('ui.stats.fleetPower')} : `,
        statPower,
        ` · ${t('ui.labels.maintenanceTotal')} : `,
        statMaint,
        ` ${resourceIcon('energy')}${t('ui.labels.perSecondShort')}`,
      ]),
      list
    );
    update();
  }

  function update() {
    const state = engine.state;
    statPower.textContent = formatNumber(engine.fleetPower);
    statMaint.textContent = formatNumber(engine.fleetMaintenance);

    for (const [id, card] of cards) {
      const { def, refs, teased } = card;
      const count = state.ships[id]?.count ?? 0;
      refs.meta.textContent =
        `${t('ui.labels.owned', { n: count })} · ` +
        `${t('ui.labels.attack')} ${formatNumber(def.attack)} · ` +
        `${t('ui.labels.maintenance')} ${formatNumber(def.maintenance)}${t('ui.labels.perSecondShort')}`;
      if (teased) continue;
      const cost = engine.shipCost(id);
      const affordable = canAfford(state, cost);
      refs.cost.textContent = `${t('ui.labels.cost')} : ${formatCost(cost)}`;
      refs.button.disabled = !affordable;
      card.root.classList.toggle('affordable', affordable);
    }
  }

  return { root, refresh, update, key: 'fleet' };
}
