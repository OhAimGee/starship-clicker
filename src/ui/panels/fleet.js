// Terminal FLOTTE : construction des vaisseaux + arbre de compétences de
// run (déplacé depuis l'onglet Exploration : le renforcement de flotte et
// les compétences qui l'influencent vivent maintenant au même endroit).

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { SHIPS } from '../../data/fleet.js';
import { RUN_SKILLS } from '../../data/runSkills.js';

import { canAfford } from '../../game/economy.js';
import { revealList } from '../reveal.js';
import {
  formatNumber,
  formatRateNumber,
  formatCost,
  shortCost,
  lockHint,
  timeCode,
} from '../format.js';
import { boardRow, sectionHead, setFacts, setLoadBar } from '../board-row.js';
import { shipIconId, runSkillIconId } from '../icon-map.js';

export function createFleetPanel(engine) {
  const root = el('section', { class: 'panel' });
  let rows = new Map();
  let skillRows = new Map();
  let statPower;
  let statMaint;
  let skillPointsValue;

  function refresh() {
    clear(root);
    rows = new Map();
    skillRows = new Map();
    statPower = el('b');
    statMaint = el('b');
    skillPointsValue = el('b');

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

    const skillList = el('ul', { class: 'board-list' });
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
        el('li', {}, [
          el('span', { text: t('ui.stats.runSkillPoints') }),
          skillPointsValue,
        ]),
      ]),
      sectionHead(t('ui.sections.ships')),
      list,
      sectionHead(t('ui.sections.runSkillTree'), ''),
      el('p', { class: 'panel-note', text: t('ui.runSkillTree.intro') }),
      skillList
    );
    update();
  }

  function update() {
    const state = engine.state;
    statPower.textContent = formatNumber(engine.fleetPower);
    statMaint.textContent = `${formatRateNumber(engine.fleetMaintenance)} NRG/s`;

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
  }

  return {
    root,
    refresh,
    update,
    key: 'fleet',
    rowToggle: (id) => (rows.get(id) ?? skillRows.get(id))?.toggle(),
  };
}
