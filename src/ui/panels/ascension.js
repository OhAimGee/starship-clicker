// Onglet Ascension : prestige.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { CONFIG } from '../../data/config.js';
import { PRESTIGE_UPGRADES } from '../../data/upgrades.js';
import { resourceIcon } from '../../data/resources.js';
import { prestigeMultipliers } from '../../game/economy.js';
import { formatNumber } from '../format.js';
import { purchaseCard } from './card.js';

export function createAscensionPanel(engine) {
  const root = el('section', { class: 'panel' });
  let cards = new Map();
  let potential;
  let ascendBtn;
  let statList;

  function refresh() {
    clear(root);
    cards = new Map();
    potential = el('strong');
    ascendBtn = el('button', {
      class: 'btn btn-primary btn-ascend',
      type: 'button',
      dataset: { action: 'ascend' },
      text: t('ui.buttons.ascend'),
    });
    statList = el('ul', { class: 'stat-list' });
    const upgList = el('ul', { class: 'card-grid' });

    for (const def of PRESTIGE_UPGRADES) {
      const card = purchaseCard({
        action: 'buy-prestige-upgrade',
        id: def.id,
        icon: def.icon,
        name: t(`prestigeUpgrade.${def.id}.name`),
        desc: t(`prestigeUpgrade.${def.id}.desc`),
        buttonLabel: t('ui.buttons.improve'),
        teased: false,
      });
      upgList.append(card.root);
      cards.set(def.id, { ...card, def });
    }

    root.append(
      el('h2', { text: t('ui.panels.ascension') }),
      el('p', { text: t('ui.ascension.intro') }),
      el('p', {
        text: t('ui.ascension.requirement', {
          amount: formatNumber(CONFIG.ascension.quantumCost),
          resource: `${resourceIcon('quantumEnergy')} ${t('resource.quantumEnergy')}`,
        }),
      }),
      el('p', {}, [
        t('ui.ascension.willGain').replace('{n} ✨', '').trim() + ' ',
        potential,
        ' ✨',
      ]),
      ascendBtn,
      el('h3', { text: t('ui.sections.ascensionStats') }),
      statList,
      el('h3', { text: t('ui.sections.prestigeUpgrades') }),
      upgList
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
        el('li', {}, [
          el('span', { text: label }),
          el('strong', { text: value }),
        ])
      );
    stat(t('ui.stats.ascensions'), formatNumber(state.prestige.ascensions));
    stat(t('ui.stats.permanentBonus'), `+${prod}%`);
    stat(
      t('ui.stats.lifetimeEnergy'),
      formatNumber(state.prestige.lifetime.energy + state.totalProduced.energy)
    );
    stat(t('ui.stats.totalClicks'), formatNumber(state.totalClicks));

    for (const [id, card] of cards) {
      const { refs } = card;
      const level = state.prestige.upgrades[id]?.level ?? 0;
      const cost = engine.prestigeUpgradeCost(id);
      const affordable = state.resources.ascensionPoints >= cost;
      refs.meta.textContent = t('ui.labels.level', { n: level });
      refs.cost.textContent = `${t('ui.labels.cost')} : ${formatNumber(cost)} ${resourceIcon('ascensionPoints')}`;
      refs.button.disabled = !affordable;
      card.root.classList.toggle('affordable', affordable);
    }
  }

  return { root, refresh, update, key: 'ascension' };
}
