// Terminal ASCENSION : deux paliers de prestige (voir game/prestige.js) —
// « Terminer la run » (fréquent, petite récompense) et « Ascension » (rare,
// l'objectif ultime : choix d'une récompense à fort impact + New Game+).
// « Tous services terminés » -> le tableau se vide et se repeuple.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { CONFIG } from '../../data/config.js';
import { PRESTIGE_UPGRADES } from '../../data/upgrades.js';
import { FACTION_BY_ID } from '../../data/factions.js';
import { ASCENSION_REWARDS } from '../../data/ascensionRewards.js';
import { icon } from '../icons.js';
import { prestigeMultipliers } from '../../game/economy.js';
import { formatNumber, timeCode } from '../format.js';
import { boardRow, sectionHead, setFacts } from '../board-row.js';
import {
  prestigeUpgradeIconId,
  factionIconId,
  ascensionRewardIconId,
} from '../icon-map.js';

export function createAscensionPanel(engine) {
  const root = el('section', { class: 'panel' });
  let rows = new Map();
  let factionRows = new Map();
  let potential;
  let endRunBtn;
  let ascendBtn;
  let ascendProgress;
  let rewardsList;
  let statList;

  function refresh() {
    clear(root);
    rows = new Map();
    factionRows = new Map();
    potential = el('b');
    endRunBtn = el('button', {
      class: 'btn btn-go btn-block',
      type: 'button',
      dataset: { action: 'end-run' },
      text: t('ui.buttons.endRun'),
    });
    ascendBtn = el('button', {
      class: 'btn btn-go btn-block btn-ascend',
      type: 'button',
      dataset: { action: 'ascend' },
      text: t('ui.buttons.ascend'),
    });
    ascendProgress = el('b');
    rewardsList = el('ul', { class: 'board-list' });
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

      // — Ascension (rare, l'objectif ultime) —
      sectionHead(t('ui.sections.ascension'), ''),
      el('p', { class: 'panel-note', text: t('ui.ascension.intro') }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [
          el('span', { text: t('ui.ascension.progress') }),
          ascendProgress,
        ]),
      ]),
      ascendBtn,
      sectionHead(t('ui.sections.ascensionRewards'), ''),
      rewardsList,

      // — Terminer la run (fréquent) —
      sectionHead(t('ui.sections.endRun'), ''),
      el('p', { class: 'panel-note', text: t('ui.endRun.intro') }),
      el('p', { class: 'panel-note' }, [
        t('ui.endRun.requirement'),
        ' — ',
        t('ui.endRun.willGain'),
        ' ',
        potential,
        ' AP',
      ]),
      endRunBtn,

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
    endRunBtn.disabled = !engine.canEndRun();

    const factionId = state.run.factionId;
    const level = factionId
      ? (state.prestige.factions[factionId]?.level ?? 0)
      : 0;
    const threshold = CONFIG.ascension.factionLevelThreshold;
    ascendProgress.textContent = `${formatNumber(level)} / ${formatNumber(threshold)}`;
    ascendBtn.disabled = !engine.canAscend();

    clear(rewardsList);
    const owned = ASCENSION_REWARDS.filter(
      (r) => (state.ascension.rewards[r.id]?.level ?? 0) > 0
    );
    if (owned.length === 0) {
      rewardsList.append(el('li', { class: 'row-empty', text: '—' }));
    }
    for (const def of owned) {
      const rewardLevel = state.ascension.rewards[def.id].level;
      rewardsList.append(
        el('li', { class: 'board-row', dataset: { state: 'done' } }, [
          el('div', { class: 'board-row-line' }, [
            el('div', { class: 'board-row-main is-static' }, [
              el('span', { class: 'row-code', text: '•' }),
              icon(ascensionRewardIconId(def.id), 'row-pictogram'),
              el('span', { class: 'row-label' }, [
                el('span', {
                  class: 'row-name',
                  text: t(`ascensionReward.${def.id}.name`),
                }),
                el('span', {
                  class: 'row-sub',
                  text: t('ui.labels.level', { n: rewardLevel }),
                }),
              ]),
            ]),
          ]),
        ])
      );
    }

    const prod = Math.round((prestigeMultipliers(state).production - 1) * 100);
    clear(statList);
    const stat = (label, value) =>
      statList.append(
        el('li', {}, [el('span', { text: label }), el('b', { text: value })])
      );
    stat(t('ui.stats.ascensions'), formatNumber(state.prestige.ascensions));
    stat(t('ui.stats.trueAscensions'), formatNumber(state.ascension.count));
    stat(t('ui.stats.permanentBonus'), `+${prod}%`);
    stat(
      t('ui.stats.lifetimeEnergy'),
      formatNumber(state.prestige.lifetime.energy + state.totalProduced.energy)
    );
    stat(t('ui.stats.totalClicks'), formatNumber(state.totalClicks));

    for (const [id, row] of rows) {
      const { refs } = row;
      const lvl = state.prestige.upgrades[id]?.level ?? 0;
      const cost = engine.prestigeUpgradeCost(id);
      const afford = state.resources.ascensionPoints >= cost;
      refs.sub.textContent = t('ui.labels.level', { n: lvl });
      refs.count.textContent = '';
      refs.cost.textContent = `${formatNumber(cost)} AP`;
      setFacts(refs.drawerFacts, [
        [t(`prestigeUpgrade.${id}.name`), t(`prestigeUpgrade.${id}.desc`)],
        [t('ui.labels.level'), formatNumber(lvl)],
      ]);
      row.root.dataset.state = afford ? 'afford' : 'cant';
      refs.main.disabled = !afford;
      refs.drawerLock.hidden = true;
    }

    for (const [id, row] of factionRows) {
      const { refs } = row;
      const lvl = state.prestige.factions[factionId]?.skills[id]?.level ?? 0;
      const cost = engine.factionSkillCost(id);
      const afford = state.resources.ascensionPoints >= cost;
      refs.sub.textContent = t('ui.labels.level', { n: lvl });
      refs.count.textContent = '';
      refs.cost.textContent = `${formatNumber(cost)} AP`;
      setFacts(refs.drawerFacts, [
        [t(`factionSkill.${id}.name`), t(`factionSkill.${id}.desc`)],
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
    key: 'ascension',
    rowToggle: (id) => (rows.get(id) ?? factionRows.get(id))?.toggle(),
  };
}
