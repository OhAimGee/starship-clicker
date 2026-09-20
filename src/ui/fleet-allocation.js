// Modal d'allocation de flotte avant un combat de planète (invaded/
// hostile) — même motif que `ascension-reward.js` (panneau plein cadre de
// `modal.js`) mais `dismissable: true` : contrairement à un choix
// obligatoire (faction, récompense d'Ascension), le joueur peut annuler et
// revenir plus tard avec une flotte différente.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { shipIconId } from './icon-map.js';
import { formatNumber } from './format.js';
import { openPanel } from './modal.js';
import { committedFleetPower, minimumAllocation } from '../game/combat.js';

/**
 * @param {import('../game/engine.js').Engine} engine
 * @param {number} defenseRating défense de la phase de combat à venir
 * @param {(allocation: Record<string, number>) => void} onEngage appelé
 *   avec l'allocation choisie quand le joueur confirme
 */
export function showFleetAllocation(engine, defenseRating, onEngage) {
  const state = engine.state;
  const ownedShips = Object.entries(state.ships).filter(
    ([, s]) => s.count > 0
  );
  // Pré-rempli avec la flotte MINIMALE qui bat la défense (voir
  // `minimumAllocation`) plutôt qu'avec toute la flotte : le joueur ajuste à
  // la hausse s'il veut de la marge. Flotte insuffisante : tout est engagé.
  const { allocation: minimum, sufficient } = minimumAllocation(
    state,
    defenseRating
  );
  const allocation = {};
  for (const [id] of ownedShips) allocation[id] = minimum[id] ?? 0;

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
      value: String(allocation[id]),
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
      el('p', {
        class: 'panel-note',
        text: t(
          sufficient
            ? 'ui.fleetAllocation.minHint'
            : 'ui.fleetAllocation.notEnough'
        ),
      }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [
          el('span', { text: t('ui.labels.defense') }),
          el('b', { text: formatNumber(defenseRating) }),
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
    onEngage(allocation);
  });

  updatePower();
}
