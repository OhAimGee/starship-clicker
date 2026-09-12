// Terminal CARTES : objectif de run + liste des systèmes explorables
// (verrouillés par niveau) + sous-menu des planètes d'un système ouvert.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { resourceCode } from '../../data/resources.js';
import { RUN_SKILLS } from '../../data/runSkills.js';
import { formatNumber, timeCode } from '../format.js';
import { boardRow, sectionHead, setFacts } from '../board-row.js';
import { runSkillIconId } from '../icon-map.js';
import { objectiveLabel, objectiveProgressText } from '../objective-text.js';
import { renderSystemList } from '../system-map.js';

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
  let combatLogList;
  let signature = '';
  let mapSignature = '';
  let combatLogSignature = -1;

  // Refresh complet : nouvelle faction/run ou système conquis (liste des
  // arrivées à reconstruire). La liste des systèmes / le sous-menu de
  // planètes est géré en aparté par `mapSig()`, sans reconstruire tout le
  // panneau à chaque frame.
  const sig = () => {
    const s = engine.state;
    return `${s.run.factionId}|${s.run.exploration.conquered.length}`;
  };

  const mapSig = () => {
    if (!engine.hasFleet()) return 'locked';
    const s = engine.state;
    const exploration = s.run.exploration;
    // Progression par planète (comptes conquis) + niveau de joueur (règle
    // le verrouillage des systèmes) — la popup de détail (voir
    // `system-detail.js`) vit hors du panneau et se rafraîchit elle-même ;
    // ici, seule la liste des systèmes doit refléter les changements.
    const progress = exploration.systems
      .map(
        (sys) =>
          `${sys.planets.filter((p) => p.conquered).length}/${sys.planets.length}${sys.conquered ? 'C' : ''}`
      )
      .join(',');
    return `${s.prestige.player.level}|${progress}`;
  };

  function refresh() {
    clear(root);
    objectiveLabelEl = el('span', { text: t('ui.stats.runObjective') });
    objectiveValue = el('b');
    skillPointsValue = el('b');
    mapHost = el('div', { class: 'exploration-host' });
    arrivals = el('ul', { class: 'board-list arrivals' });
    skillList = el('ul', { class: 'board-list' });
    combatLogList = el('ul', { class: 'board-list arrivals' });
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

    root.append(
      el('h2', { text: t('ui.panels.exploration') }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [objectiveLabelEl, objectiveValue]),
        el('li', {}, [
          el('span', { text: t('ui.stats.runSkillPoints') }),
          skillPointsValue,
        ]),
      ]),
      sectionHead(t('ui.sections.explorationMap'), ''),
      mapHost,
      sectionHead(t('ui.sections.conqueredSystems'), ''),
      arrivals,
      sectionHead(t('ui.sections.runSkillTree'), ''),
      el('p', { class: 'panel-note', text: t('ui.runSkillTree.intro') }),
      skillList,
      sectionHead(t('ui.sections.combatLog'), ''),
      combatLogList
    );
    buildArrivals();
    buildCombatLog();
    signature = sig();
    mapSignature = '';
    combatLogSignature = engine.state.run.combatLog.length;
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

  function buildCombatLog() {
    clear(combatLogList);
    const log = engine.state.run.combatLog;
    if (log.length === 0) {
      combatLogList.append(el('li', { class: 'row-empty', text: '—' }));
      return;
    }
    for (const entry of log) {
      const lossText =
        Object.entries(entry.losses)
          .map(([id, n]) => `-${formatNumber(n)} ${t(`ship.${id}.name`)}`)
          .join('  ·  ') || t('ui.battleReport.noLosses');
      combatLogList.append(
        el(
          'li',
          {
            class: 'board-row',
            dataset: { state: entry.victory ? 'done' : 'cant' },
          },
          [
            el('div', { class: 'board-row-line' }, [
              el('div', { class: 'board-row-main is-static' }, [
                el('span', {
                  class: 'row-code',
                  text: entry.victory ? '✓' : '✕',
                }),
                el('span', { class: 'row-label' }, [
                  el('span', { class: 'row-name', text: entry.systemName }),
                  el('span', { class: 'row-sub', text: lossText }),
                ]),
              ]),
            ]),
          ]
        )
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
        mapHost.append(renderSystemList(engine));
      }
      mapSignature = currentMapSig;
    }

    const currentCombatLogSig = state.run.combatLog.length;
    if (currentCombatLogSig !== combatLogSignature) {
      buildCombatLog();
      combatLogSignature = currentCombatLogSig;
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
