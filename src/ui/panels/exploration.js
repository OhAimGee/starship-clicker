// Terminal CARTES : objectif de run + carte d'exploration à nœuds.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { resourceCode } from '../../data/resources.js';
import { RUN_SKILLS } from '../../data/runSkills.js';
import { formatNumber, timeCode } from '../format.js';
import { boardRow, sectionHead, setFacts } from '../board-row.js';
import { runSkillIconId } from '../icon-map.js';
import { objectiveLabel, objectiveProgressText } from '../objective-text.js';
import { renderNodeMap } from '../node-map.js';

const rewardLine = (rewards, factor = 1) =>
  Object.entries(rewards)
    .map(([res, amt]) => `${formatNumber(amt * factor)} ${resourceCode(res)}`)
    .join('  ·  ');

export function createExplorationPanel(engine) {
  const root = el('section', { class: 'panel' });
  let objectiveLabelEl;
  let objectiveValue;
  let skillPointsValue;
  let mapHost;
  let arrivals;
  let skillList;
  let skillRows = new Map();
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
    if (!engine.hasFleet()) return 'locked';
    const map = engine.state.run.exploration.activeMap;
    return `${map?.id ?? ''}|${map?.currentRow ?? -1}|${engine.fleetPower}`;
  };

  function refresh() {
    clear(root);
    objectiveLabelEl = el('span', { text: t('ui.stats.runObjective') });
    objectiveValue = el('b');
    skillPointsValue = el('b');
    mapHost = el('div', { class: 'node-map-host' });
    arrivals = el('ul', { class: 'board-list arrivals' });
    skillList = el('ul', { class: 'board-list' });
    skillRows = new Map();
    RUN_SKILLS.forEach((def, i) => {
      const row = boardRow({
        id: def.id,
        action: 'buy-run-skill',
        iconId: runSkillIconId(def.id),
        code: timeCode(i * 4),
        name: t(`runSkill.${def.id}.name`),
        desc: t(`runSkill.${def.id}.desc`),
      });
      skillList.append(row.root);
      skillRows.set(def.id, row);
    });

    const activeSystem = engine.state.run.exploration.activeMap?.systemDef;

    root.append(
      el('h2', { text: t('ui.panels.exploration') }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [objectiveLabelEl, objectiveValue]),
        el('li', {}, [
          el('span', { text: t('ui.stats.runSkillPoints') }),
          skillPointsValue,
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
      arrivals,
      sectionHead(t('ui.sections.runSkillTree'), ''),
      el('p', { class: 'panel-note', text: t('ui.runSkillTree.intro') }),
      skillList
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
    objectiveLabelEl.textContent = obj
      ? objectiveLabel(obj)
      : t('ui.stats.runObjective');
    objectiveValue.textContent = obj
      ? objectiveProgressText(engine, state, obj)
      : '—';
    skillPointsValue.textContent = formatNumber(state.run.skillPoints);

    for (const [id, row] of skillRows) {
      const { refs } = row;
      const lvl = state.run.skillTree[id]?.level ?? 0;
      const cost = engine.runSkillCost(id);
      const afford = state.run.skillPoints >= cost;
      refs.sub.textContent = t('ui.labels.level', { n: lvl });
      refs.count.textContent = '';
      refs.cost.textContent = formatNumber(cost);
      setFacts(refs.drawerFacts, [
        [t(`runSkill.${id}.name`), t(`runSkill.${id}.desc`)],
        [t('ui.labels.level'), formatNumber(lvl)],
      ]);
      row.root.dataset.state = afford ? 'afford' : 'cant';
      refs.main.disabled = !afford;
      refs.drawerLock.hidden = true;
    }

    const currentMapSig = mapSig();
    if (currentMapSig !== mapSignature) {
      clear(mapHost);
      if (!engine.hasFleet()) {
        mapHost.append(
          el('p', { class: 'panel-note', text: t('ui.nodeMap.noFleet') })
        );
      } else {
        mapHost.append(renderNodeMap(engine));
      }
      mapSignature = currentMapSig;
    }
  }

  return {
    root,
    refresh,
    update,
    key: 'exploration',
    rowToggle: (id) => skillRows.get(id)?.toggle(),
  };
}
