// Onglet Technologies : recherche (achat unique).

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { TECHNOLOGIES } from '../../data/technologies.js';
import { canAfford, isUnlocked } from '../../game/economy.js';
import { formatCost, lockHint } from '../format.js';
import { purchaseCard } from './card.js';

export function createTechnologyPanel(engine) {
  const root = el('section', { class: 'panel' });
  let cards = new Map();

  function refresh() {
    clear(root);
    cards = new Map();
    const state = engine.state;
    const list = el('ul', { class: 'card-grid' });

    for (const def of TECHNOLOGIES) {
      const researched = state.technologies[def.id]?.unlocked;
      if (!researched && !isUnlocked(state, def.unlock)) continue;

      const card = purchaseCard({
        action: 'research',
        id: def.id,
        icon: def.icon,
        name: t(`tech.${def.id}.name`),
        desc: t(`tech.${def.id}.desc`),
        buttonLabel: researched
          ? t('ui.buttons.researched')
          : t('ui.buttons.research'),
        teased: false,
        lockHint: lockHint(def.unlock),
      });
      list.append(card.root);
      cards.set(def.id, { ...card, def });
    }

    root.append(el('h2', { text: t('ui.panels.technology') }), list);
    update();
  }

  function update() {
    const state = engine.state;
    for (const [id, card] of cards) {
      const { def, refs } = card;
      if (state.technologies[id]?.unlocked) {
        refs.cost.textContent = '';
        refs.meta.textContent = '';
        refs.button.disabled = true;
        refs.button.textContent = t('ui.buttons.researched');
        card.root.classList.add('researched');
        continue;
      }
      const affordable = canAfford(state, def.cost);
      refs.cost.textContent = `${t('ui.labels.cost')} : ${formatCost(def.cost)}`;
      refs.button.disabled = !affordable;
      card.root.classList.toggle('affordable', affordable);
    }
  }

  return { root, refresh, update, key: 'technology' };
}
