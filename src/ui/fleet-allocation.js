// Modal d'allocation de flotte avant un combat (nœud invade/conquest) —
// même motif que `ascension-reward.js` (panneau plein cadre de `modal.js`)
// mais `dismissable: true` : contrairement à un choix obligatoire (faction,
// récompense d'Ascension), le joueur peut annuler et revenir plus tard avec
// une flotte différente.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { shipIconId } from './icon-map.js';
import { formatNumber } from './format.js';
import { openPanel } from './modal.js';
import { committedFleetPower } from '../game/combat.js';

export function showFleetAllocation(engine, nodeId, node) {
  const state = engine.state;
  const ownedShips = Object.entries(state.ships).filter(
    ([, s]) => s.count > 0
  );
  const allocation = {};
  for (const [id, s] of ownedShips) allocation[id] = s.count;

  const powerValue = el('b');
  const updatePower = () => {
    powerValue.textContent = formatNumber(
      committedFleetPower(state, allocation)
    );
  };

  const rows = ownedShips.map(([id, s]) => {
    const input = el('input', {
      class: 'allocation-input',
      type: 'number',
      inputmode: 'numeric',
      min: '0',
      max: String(s.count),
      value: String(s.count),
    });
    input.addEventListener('input', () => {
      const n = Math.max(
        0,
        Math.min(s.count, Math.round(Number(input.value) || 0))
      );
      allocation[id] = n;
      updatePower();
    });
    return el('li', { class: 'board-row' }, [
      el('div', { class: 'board-row-line' }, [
        el('div', { class: 'allocation-row' }, [
          icon(shipIconId(id), 'row-pictogram'),
          el('span', { class: 'row-label' }, [
            el('span', { class: 'row-name', text: t(`ship.${id}.name`) }),
            el('span', {
              class: 'row-sub',
              text: t('ui.labels.owned', { n: s.count }),
            }),
          ]),
          input,
        ]),
      ]),
    ]);
  });

  const engageBtn = el('button', {
    class: 'btn btn-go btn-block',
    type: 'button',
    text: t('ui.buttons.engage'),
  });
  const cancelBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.buttons.cancel'),
  });

  const { close } = openPanel(
    t('ui.fleetAllocation.title'),
    [
      el('p', { class: 'panel-note', text: t('ui.fleetAllocation.intro') }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [
          el('span', { text: t('ui.labels.defense') }),
          el('b', { text: formatNumber(node.data.defenseRating) }),
        ]),
        el('li', {}, [
          el('span', { text: t('ui.stats.fleetPower') }),
          powerValue,
        ]),
      ]),
      el('ul', { class: 'board-list' }, rows),
      el('div', { class: 'board-modal-actions' }, [cancelBtn, engageBtn]),
    ],
    { dismissable: true }
  );

  cancelBtn.addEventListener('click', close);
  engageBtn.addEventListener('click', () => {
    close();
    engine.chooseNode(nodeId, allocation);
  });

  updatePower();
}
