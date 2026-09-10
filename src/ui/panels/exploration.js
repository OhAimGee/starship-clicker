// Onglet Exploration : conquête de systèmes stellaires.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { resourceIcon } from '../../data/resources.js';
import { formatNumber } from '../format.js';

function systemCard(system, index, canConquer) {
  const rewards = Object.entries(system.rewards)
    .map(([res, amount]) => `${resourceIcon(res)} ${formatNumber(amount)}`)
    .join('  ');
  return el(
    'li',
    { class: `card system${system.advanced ? ' system-advanced' : ''}` },
    [
      el('div', { class: 'card-head' }, [
        el('h4', { class: 'card-name', text: system.name }),
        el('span', {
          class: 'card-tag',
          text: t(`systemArchetype.${system.archetype}`),
        }),
      ]),
      el('p', {
        class: 'card-meta',
        text: `${t('ui.labels.defense')} : ${formatNumber(system.defenseRating)}`,
      }),
      el('p', {
        class: 'card-cost',
        text: `${t('ui.labels.rewards')} : ${rewards}`,
      }),
      el('button', {
        class: 'btn btn-buy',
        type: 'button',
        dataset: { action: 'explore', id: String(index) },
        text: t('ui.buttons.explore'),
        disabled: !canConquer,
      }),
    ]
  );
}

export function createExplorationPanel(engine) {
  const root = el('section', { class: 'panel' });
  let fleetStat;
  let available;
  let signature = '';

  function currentSignature() {
    const e = engine.state.exploration;
    return `${e.available.map((s) => s.name).join(',')}|${e.conquered.length}`;
  }

  function refresh() {
    clear(root);
    const state = engine.state;
    const power = engine.fleetPower;
    fleetStat = el('strong');
    available = el('ul', { class: 'card-grid' });
    const conquered = el('ul', { class: 'conquered-grid' });

    state.exploration.available.forEach((system, index) => {
      available.append(
        systemCard(system, index, power >= system.defenseRating)
      );
    });

    if (state.exploration.conquered.length === 0) {
      conquered.append(el('li', { class: 'muted', text: '—' }));
    }
    for (const system of state.exploration.conquered) {
      const income = Object.entries(system.rewards)
        .map(
          ([res, amount]) =>
            `${resourceIcon(res)} +${formatNumber(amount * 0.1)}${t('ui.labels.perSecondShort')}`
        )
        .join('  ');
      conquered.append(
        el('li', { class: 'card conquered' }, [
          el('h4', { class: 'card-name', text: system.name }),
          el('p', {
            class: 'card-meta',
            text: `${t('ui.labels.passiveIncome')} : ${income}`,
          }),
        ])
      );
    }

    root.append(
      el('h2', { text: t('ui.panels.exploration') }),
      el('p', { class: 'panel-stats' }, [
        `${t('ui.stats.fleetPower')} : `,
        fleetStat,
      ]),
      el('h3', { text: t('ui.sections.availableSystems') }),
      available,
      el('h3', { text: t('ui.sections.conqueredSystems') }),
      conquered
    );
    signature = currentSignature();
    update();
  }

  function update() {
    if (currentSignature() !== signature) {
      refresh();
      return;
    }
    const power = engine.fleetPower;
    fleetStat.textContent = formatNumber(power);
    engine.state.exploration.available.forEach((system, index) => {
      const btn = available.children[index]?.querySelector('button');
      if (btn) btn.disabled = power < system.defenseRating;
    });
  }

  return { root, refresh, update, key: 'exploration' };
}
