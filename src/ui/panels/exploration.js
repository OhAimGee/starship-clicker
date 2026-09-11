// Terminal CARTES : objectif de run + carte d'exploration à nœuds.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { resourceCode } from '../../data/resources.js';
import { formatNumber } from '../format.js';
import { sectionHead } from '../board-row.js';
import { renderNodeMap } from '../node-map.js';

const rewardLine = (rewards, factor = 1) =>
  Object.entries(rewards)
    .map(([res, amt]) => `${formatNumber(amt * factor)} ${resourceCode(res)}`)
    .join('  ·  ');

export function createExplorationPanel(engine) {
  const root = el('section', { class: 'panel' });
  let objectiveValue;
  let mapHost;
  let arrivals;
  let signature = '';
  let mapSignature = '';

  // Refresh complet : nouvelle carte ou système conquis (liste des arrivées
  // à reconstruire). `currentRow` seul (progression au sein de la même
  // carte) et `fleetPower` (affordabilité) sont gérés en aparté par
  // `mapSig()`, sans reconstruire tout le panneau à chaque frame.
  const sig = () => {
    const s = engine.state;
    const map = s.run.exploration.activeMap;
    return `${s.run.factionId}|${map?.id ?? ''}|${s.run.exploration.conquered.length}`;
  };

  const mapSig = () => {
    const map = engine.state.run.exploration.activeMap;
    return `${map?.id ?? ''}|${map?.currentRow ?? -1}|${engine.fleetPower}`;
  };

  function refresh() {
    clear(root);
    objectiveValue = el('b');
    mapHost = el('div', { class: 'node-map-host' });
    arrivals = el('ul', { class: 'board-list arrivals' });

    const activeSystem = engine.state.run.exploration.activeMap?.systemDef;

    root.append(
      el('h2', { text: t('ui.panels.exploration') }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [
          el('span', { text: t('ui.stats.runObjective') }),
          objectiveValue,
        ]),
      ]),
      sectionHead(
        t('ui.sections.explorationMap'),
        activeSystem ? activeSystem.name : ''
      ),
      activeSystem
        ? el('p', {
            class: 'panel-note',
            text: t(`systemArchetype.${activeSystem.archetype}`),
          })
        : null,
      mapHost,
      sectionHead(t('ui.sections.conqueredSystems'), ''),
      arrivals
    );
    buildArrivals();
    signature = sig();
    mapSignature = '';
    update();
  }

  function buildArrivals() {
    clear(arrivals);
    const conquered = engine.state.run.exploration.conquered;
    if (conquered.length === 0) {
      arrivals.append(el('li', { class: 'row-empty', text: '—' }));
    }
    for (const system of conquered) {
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
  }

  function update() {
    if (sig() !== signature) return refresh();
    const state = engine.state;
    const obj = state.run.objective;
    objectiveValue.textContent = obj
      ? `${formatNumber(state.run.exploration.conquered.length)} / ${formatNumber(obj.target)}`
      : '—';

    const currentMapSig = mapSig();
    if (currentMapSig !== mapSignature) {
      clear(mapHost);
      mapHost.append(renderNodeMap(engine));
      mapSignature = currentMapSig;
    }
  }

  return {
    root,
    refresh,
    update,
    key: 'exploration',
  };
}
