// Terminal ASCENSION : prestige. « Tous services terminés » -> le tableau se
// vide et se repeuple.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { CONFIG } from '../../data/config.js';
import { PRESTIGE_UPGRADES } from '../../data/upgrades.js';
import { FACTION_BY_ID } from '../../data/factions.js';
import { resourceCode } from '../../data/resources.js';
import { prestigeMultipliers } from '../../game/economy.js';
import { formatNumber, timeCode } from '../format.js';
import { boardRow, sectionHead, setFacts } from '../board-row.js';
import { prestigeUpgradeIconId, factionIconId } from '../icon-map.js';

export function createAscensionPanel(engine) {
  const root = el('section', { class: 'panel' });
  let rows = new Map();
  let factionRows = new Map();
  let potential;
  let ascendBtn;
  let statList;

  function refresh() {
    clear(root);
    rows = new Map();
    factionRows = new Map();
    potential = el('b');
    ascendBtn = el('button', {
      class: 'btn btn-go btn-block btn-ascend',
      type: 'button',
      dataset: { action: 'ascend' },
      text: t('ui.buttons.ascend'),
    });
    statList = el('ul', { class: 'stat-grid' });

    const factionId = engine.state.run.factionId;
    const factionDef = FACTION_BY_ID[factionId];
    const factionSections = [];
    if (factionDef) {
      const factionList = el('ul', { class: 'board-list' });
      factionDef.skillTree.forEach((def, i) => {
        const row = boardRow({
          id: def.id,
          action: 'buy-faction-skill',
          iconId: factionIconId(factionId),
          code: timeCode(i * 4),
          name: t(`factionSkill.${def.id}.name`),
          desc: t(`factionSkill.${def.id}.desc`),
        });
        factionList.append(row.root);
        factionRows.set(def.id, { ...row, def });
      });
      factionSections.push(
        sectionHead(
          t('ui.sections.factionSkills', {
            faction: t(`faction.${factionId}.name`),
          })
        ),
        factionList
      );
    }

    const list = el('ul', { class: 'board-list' });
    PRESTIGE_UPGRADES.forEach((def, i) => {
      const row = boardRow({
        id: def.id,
        action: 'buy-prestige-upgrade',
        iconId: prestigeUpgradeIconId(def.id),
        code: timeCode(i * 4),
        name: t(`prestigeUpgrade.${def.id}.name`),
        desc: t(`prestigeUpgrade.${def.id}.desc`),
      });
      list.append(row.root);
      rows.set(def.id, { ...row, def });
    });

    root.append(
      el('div', { class: 'ascend-marquee', text: t('ui.ascension.marquee') }),
      el('h2', { text: t('ui.panels.ascension') }),
      el('p', { class: 'panel-note', text: t('ui.ascension.intro') }),
      el('p', { class: 'panel-note' }, [
        t('ui.ascension.requirement', {
          amount: formatNumber(CONFIG.ascension.quantumCost),
          resource: `${resourceCode('quantumEnergy')} ${t('resource.quantumEnergy')}`,
        }),
        ' — ',
        t('ui.ascension.willGain').replace('{n} ✨', '').trim(),
        ' ',
        potential,
        ' AP',
      ]),
      ascendBtn,
      sectionHead(t('ui.sections.ascensionStats'), ''),
      statList,
      ...factionSections,
      sectionHead(t('ui.sections.prestigeUpgrades')),
      list
    );
    update();
  }

  function update() {
    const state = engine.state;
    potential.textContent = formatNumber(engine.potentialAscensionPoints());
    ascendBtn.disabled = !engine.canAscend();

    const prod = Math.round((prestigeMultipliers(state).production - 1) * 100);
    clear(statList);
    const stat = (label, value) =>
      statList.append(
        el('li', {}, [el('span', { text: label }), el('b', { text: value })])
      );
    stat(t('ui.stats.ascensions'), formatNumber(state.prestige.ascensions));
    stat(t('ui.stats.permanentBonus'), `+${prod}%`);
    stat(
      t('ui.stats.lifetimeEnergy'),
      formatNumber(state.prestige.lifetime.energy + state.totalProduced.energy)
    );
    stat(t('ui.stats.totalClicks'), formatNumber(state.totalClicks));

    for (const [id, row] of rows) {
      const { refs } = row;
      const level = state.prestige.upgrades[id]?.level ?? 0;
      const cost = engine.prestigeUpgradeCost(id);
      const afford = state.resources.ascensionPoints >= cost;
      refs.sub.textContent = t('ui.labels.level', { n: level });
      refs.count.textContent = '';
      refs.cost.textContent = `${formatNumber(cost)} AP`;
      setFacts(refs.drawerFacts, [
        [t(`prestigeUpgrade.${id}.name`), t(`prestigeUpgrade.${id}.desc`)],
        [t('ui.labels.level'), formatNumber(level)],
      ]);
      row.root.dataset.state = afford ? 'afford' : 'cant';
      refs.main.disabled = !afford;
      refs.drawerLock.hidden = true;
    }

    const factionId = state.run.factionId;
    for (const [id, row] of factionRows) {
      const { refs } = row;
      const level = state.prestige.factions[factionId]?.skills[id]?.level ?? 0;
      const cost = engine.factionSkillCost(id);
      const afford = state.resources.ascensionPoints >= cost;
      refs.sub.textContent = t('ui.labels.level', { n: level });
      refs.count.textContent = '';
      refs.cost.textContent = `${formatNumber(cost)} AP`;
      setFacts(refs.drawerFacts, [
        [t(`factionSkill.${id}.name`), t(`factionSkill.${id}.desc`)],
        [t('ui.labels.level'), formatNumber(level)],
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
    key: 'ascension',
    rowToggle: (id) => (rows.get(id) ?? factionRows.get(id))?.toggle(),
  };
}
