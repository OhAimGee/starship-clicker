// Terminal CARTES : conquête de systèmes (destinations du tableau).

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { resourceCode } from '../../data/resources.js';
import { formatNumber, timeCode } from '../format.js';
import { boardRow, sectionHead, setFacts } from '../board-row.js';
import { systemIconId } from '../icon-map.js';

const rewardLine = (rewards, factor = 1) =>
  Object.entries(rewards)
    .map(([res, amt]) => `${formatNumber(amt * factor)} ${resourceCode(res)}`)
    .join('  ·  ');

export function createExplorationPanel(engine) {
  const root = el('section', { class: 'panel' });
  let rows = [];
  let signature = '';
  let statPower;

  const sig = () => {
    const e = engine.state.run.exploration;
    return `${e.available.map((s) => s.name).join(',')}|${e.conquered.length}`;
  };

  function refresh() {
    clear(root);
    rows = [];
    statPower = el('b');
    const state = engine.state;

    const list = el('ul', { class: 'board-list' });
    state.run.exploration.available.forEach((system, index) => {
      const row = boardRow({
        id: String(index),
        action: 'explore',
        iconId: systemIconId(),
        code: timeCode(index * 5),
        name: system.name,
        desc: `${t(`systemArchetype.${system.archetype}`)}`,
      });
      row.refs.main.classList.toggle('is-advanced', !!system.advanced);
      setFacts(row.refs.drawerFacts, [
        [t('ui.labels.defense'), formatNumber(system.defenseRating)],
        [t('ui.labels.rewards'), rewardLine(system.rewards)],
        [t('ui.labels.passiveIncome'), `${rewardLine(system.rewards, 0.1)} /s`],
      ]);
      list.append(row.root);
      rows.push({ ...row, system, index });
    });

    const arrivals = el('ul', { class: 'board-list arrivals' });
    if (state.run.exploration.conquered.length === 0) {
      arrivals.append(el('li', { class: 'row-empty', text: '—' }));
    }
    for (const system of state.run.exploration.conquered) {
      arrivals.append(
        el('li', { class: 'board-row', dataset: { state: 'done' } }, [
          el('div', { class: 'board-row-line' }, [
            el('div', { class: 'board-row-main is-static' }, [
              el('span', { class: 'row-code', text: '•' }),
              el('span', { class: 'row-label' }, [
                el('span', { class: 'row-name', text: system.name }),
                el('span', {
                  class: 'row-sub',
                  text: `${t('ui.labels.passiveIncome')} : ${rewardLine(system.rewards, 0.1)} /s`,
                }),
              ]),
            ]),
          ]),
        ])
      );
    }

    root.append(
      el('h2', { text: t('ui.panels.exploration') }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [
          el('span', { text: t('ui.stats.fleetPower') }),
          statPower,
        ]),
      ]),
      sectionHead(t('ui.sections.availableSystems')),
      list,
      sectionHead(t('ui.sections.conqueredSystems'), ''),
      arrivals
    );
    signature = sig();
    update();
  }

  function update() {
    if (sig() !== signature) return refresh();
    const power = engine.fleetPower;
    statPower.textContent = formatNumber(power);
    for (const { root: rowEl, refs, system } of rows) {
      const can = power >= system.defenseRating;
      refs.main.disabled = !can;
      refs.sub.textContent = `${t(`systemArchetype.${system.archetype}`)} · ${t('ui.labels.defense')} ${formatNumber(system.defenseRating)}`;
      refs.cost.textContent = can
        ? t('ui.buttons.explore')
        : t('ui.labels.fleetPowerNeeded', {
            n: formatNumber(system.defenseRating),
          });
      rowEl.dataset.state = can ? 'afford' : 'cant';
    }
  }

  return {
    root,
    refresh,
    update,
    key: 'exploration',
    rowToggle: (id) => rows[Number(id)]?.toggle(),
  };
}
