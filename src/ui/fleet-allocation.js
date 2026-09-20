// Modal d'allocation de flotte avant un combat de planète (invaded/
// hostile) — même motif que `ascension-reward.js` (panneau plein cadre de
// `modal.js`) mais `dismissable: true` : contrairement à un choix
// obligatoire (faction, récompense d'Ascension), le joueur peut annuler et
// revenir plus tard avec une flotte différente.
//
// La bataille étant simulée avec du hasard, la fenêtre montre la composition
// de l'ennemi, l'indice de son profil (« le nombre l'emporte »…) et, en direct,
// la chance de victoire et les pertes attendues de l'allocation courante
// (estimation Monte-Carlo, voir `game/battle.js#estimateBattle`).

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { CONFIG } from '../data/config.js';
import { icon } from './icons.js';
import { shipIconId } from './icon-map.js';
import { formatNumber } from './format.js';
import { openPanel } from './modal.js';
import { stackLabel } from './battle-text.js';
import { committedFleetPower } from '../game/combat.js';
import {
  allyFleetFromAllocation,
  estimateBattle,
  safeAllocation,
} from '../game/battle.js';
import { enemyFleetForPlanet, enemyProfileId } from '../game/enemy-fleet.js';

const percent = (fraction) =>
  t('ui.fleetAllocation.percent', { n: Math.round(fraction * 100) });

const chanceBand = (chance) =>
  chance >= CONFIG.combat.winChanceTarget
    ? 'high'
    : chance >= 0.5
      ? 'mid'
      : 'low';

/**
 * @param {import('../game/engine.js').Engine} engine
 * @param {object} system système de la planète attaquée
 * @param {object} planet planète attaquée (phase de combat en cours)
 * @param {(allocation: Record<string, number>) => void} onEngage appelé
 *   avec l'allocation choisie quand le joueur confirme
 */
export function showFleetAllocation(engine, system, planet, onEngage) {
  const state = engine.state;
  const enemyFleet = enemyFleetForPlanet(system, planet);
  const profileId = enemyProfileId(system, planet);
  const ownedShips = Object.entries(state.ships).filter(
    ([, s]) => s.count > 0
  );
  // Pré-rempli avec la plus petite flotte qui vise `winChanceTarget` (voir
  // `safeAllocation`, des plus petits vaisseaux aux plus gros) plutôt qu'avec
  // toute la flotte : le joueur ajuste à la hausse s'il veut de la marge.
  // Flotte insuffisante : tout est engagé.
  const { allocation: recommended, sufficient } = safeAllocation(
    state,
    enemyFleet
  );
  const allocation = {};
  const inputs = {};
  for (const [id] of ownedShips) allocation[id] = recommended[id] ?? 0;

  const powerValue = el('b');
  const chanceValue = el('b', { class: 'allocation-chance' });
  const lossValue = el('b');
  const engageBtn = el('button', {
    class: 'btn btn-go btn-block',
    type: 'button',
    text: t('ui.buttons.engage'),
  });

  const refresh = () => {
    const engaged = Object.values(allocation).reduce((sum, n) => sum + n, 0);
    powerValue.textContent = formatNumber(
      committedFleetPower(state, allocation)
    );
    engageBtn.disabled = engaged === 0;
    if (engaged === 0) {
      chanceValue.textContent = percent(0);
      chanceValue.dataset.band = 'low';
      lossValue.textContent = '—';
      return;
    }
    const { winChance, lossFraction } = estimateBattle(
      allyFleetFromAllocation(state, allocation),
      enemyFleet
    );
    chanceValue.textContent = percent(winChance);
    chanceValue.dataset.band = chanceBand(winChance);
    lossValue.textContent = percent(lossFraction);
  };

  const setAllocation = (next) => {
    for (const [id] of ownedShips) {
      allocation[id] = next[id] ?? 0;
      inputs[id].value = String(allocation[id]);
    }
    refresh();
  };

  const rows = ownedShips.map(([id, s]) => {
    const input = el('input', {
      class: 'allocation-input',
      type: 'number',
      inputmode: 'numeric',
      min: '0',
      max: String(s.count),
      value: String(allocation[id]),
      'aria-label': t(`ship.${id}.name`),
    });
    inputs[id] = input;
    input.addEventListener('input', () => {
      allocation[id] = Math.max(
        0,
        Math.min(s.count, Math.round(Number(input.value) || 0))
      );
      refresh();
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

  const cancelBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.buttons.cancel'),
  });
  const recommendedBtn = el('button', {
    class: 'btn',
    type: 'button',
    text: t('ui.fleetAllocation.recommended'),
  });
  const allBtn = el('button', {
    class: 'btn',
    type: 'button',
    text: t('ui.fleetAllocation.all'),
  });

  const { close } = openPanel(
    t('ui.fleetAllocation.title'),
    [
      el('div', { class: 'allocation-enemy' }, [
        el('p', {
          class: 'allocation-enemy-name',
          text: t('ui.fleetAllocation.enemy', {
            name: t(`enemy.profile.${profileId}.name`),
          }),
        }),
        el('p', {
          class: 'allocation-enemy-comp',
          text: enemyFleet
            .map((f) => stackLabel(`enemy:${f.id}`, f.count))
            .join(' · '),
        }),
        el('p', {
          class: 'panel-note',
          text: t(`enemy.profile.${profileId}.hint`),
        }),
      ]),
      el('p', { class: 'panel-note', text: t('ui.fleetAllocation.intro') }),
      el('p', {
        class: 'panel-note',
        text: t(
          sufficient
            ? 'ui.fleetAllocation.minHint'
            : 'ui.fleetAllocation.notEnough',
          { target: Math.round(CONFIG.combat.winChanceTarget * 100) }
        ),
      }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [
          el('span', { text: t('ui.labels.defense') }),
          el('b', { text: formatNumber(planet.defenseRating) }),
        ]),
        el('li', {}, [
          el('span', { text: t('ui.stats.fleetPower') }),
          powerValue,
        ]),
        el('li', {}, [
          el('span', { text: t('ui.fleetAllocation.winChance') }),
          chanceValue,
        ]),
        el('li', {}, [
          el('span', { text: t('ui.fleetAllocation.estLosses') }),
          lossValue,
        ]),
      ]),
      el('p', {
        class: 'panel-note',
        text: t('ui.fleetAllocation.chanceNote', {
          n: CONFIG.combat.estimateRuns,
        }),
      }),
      el('div', { class: 'board-modal-actions' }, [recommendedBtn, allBtn]),
      el('ul', { class: 'board-list' }, rows),
      el('div', { class: 'board-modal-actions allocation-actions' }, [
        cancelBtn,
        engageBtn,
      ]),
    ],
    { dismissable: true }
  );

  cancelBtn.addEventListener('click', close);
  recommendedBtn.addEventListener('click', () => setAllocation(recommended));
  allBtn.addEventListener('click', () =>
    setAllocation(Object.fromEntries(ownedShips.map(([id, s]) => [id, s.count])))
  );
  engageBtn.addEventListener('click', () => {
    close();
    onEngage(allocation);
  });

  refresh();
}
