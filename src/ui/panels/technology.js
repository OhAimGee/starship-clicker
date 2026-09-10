// Terminal TECHNOLOGIES : recherche (achat unique).

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { TECHNOLOGIES } from '../../data/technologies.js';
import { canAfford, isUnlocked } from '../../game/economy.js';
import { formatCost, shortCost, timeCode } from '../format.js';
import { boardRow, sectionHead, setFacts } from '../board-row.js';
import { techIconId } from '../icon-map.js';

export function createTechnologyPanel(engine) {
  const root = el('section', { class: 'panel' });
  let rows = new Map();

  function refresh() {
    clear(root);
    rows = new Map();
    const state = engine.state;
    const list = el('ul', { class: 'board-list' });

    TECHNOLOGIES.forEach((def, i) => {
      const done = state.technologies[def.id]?.unlocked;
      if (!done && !isUnlocked(state, def.unlock)) return;
      const row = boardRow({
        id: def.id,
        action: 'research',
        iconId: techIconId(def.id),
        code: timeCode(i * 2),
        name: t(`tech.${def.id}.name`),
        desc: t(`tech.${def.id}.desc`),
      });
      list.append(row.root);
      rows.set(def.id, { ...row, def });
    });

    root.append(
      el('h2', { text: t('ui.panels.technology') }),
      sectionHead(t('ui.sections.research')),
      list
    );
    update();
  }

  function update() {
    const state = engine.state;
    for (const [id, row] of rows) {
      const { def, refs } = row;
      const done = state.technologies[id]?.unlocked;
      const afford = canAfford(state, def.cost);

      setFacts(refs.drawerFacts, [
        [t('ui.labels.cost'), done ? '—' : formatCost(def.cost)],
      ]);

      if (done) {
        row.root.dataset.state = 'done';
        refs.main.disabled = true;
        refs.sub.textContent = t('ui.buttons.researched');
        refs.count.textContent = '';
        refs.cost.textContent = '';
        refs.drawerLock.hidden = true;
        continue;
      }
      row.root.dataset.state = afford ? 'afford' : 'cant';
      refs.main.disabled = !afford;
      refs.sub.textContent = t(`tech.${id}.desc`);
      refs.cost.textContent = shortCost(def.cost);
      refs.drawerLock.hidden = true;
    }
  }

  return {
    root,
    refresh,
    update,
    key: 'technology',
    rowToggle: (id) => rows.get(id)?.toggle(),
  };
}
