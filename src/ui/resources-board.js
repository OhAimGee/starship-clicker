// Panneau ressources : une ligne par ressource, la figure tourne palette par
// palette. Dévoilement progressif : une ressource n'apparaît qu'une fois
// produite au moins une fois.

import { el, clear } from './dom.js';
import { RESOURCES } from '../data/resources.js';
import { t } from '../i18n/index.js';
import { formatBoard } from './format.js';
import { createFlap } from './flap.js';
import { icon } from './icons.js';
import { resourceIconId } from './icon-map.js';

const ALWAYS = new Set(['energy']);

function isVisible(state, id) {
  if (ALWAYS.has(id)) return true;
  if (id === 'ascensionPoints') {
    return state.prestige.ascensions > 0 || state.resources.ascensionPoints > 0;
  }
  return (state.totalProduced[id] ?? 0) > 0 || (state.resources[id] ?? 0) > 0;
}

export function createResourcesBoard(engine) {
  const root = el('div', {
    class: 'resources-board',
    role: 'group',
    'aria-label': t('ui.a11y.resources'),
  });
  let flaps = new Map();
  let prev = new Map();
  let signature = '';

  const visibleIds = () =>
    RESOURCES.filter((r) => isVisible(engine.state, r.id)).map((r) => r.id);

  function refresh() {
    signature = visibleIds().join(',');
    flaps = new Map();
    clear(root);
    for (const id of visibleIds()) {
      const figure = createFlap('0');
      const row = el('div', { class: 'res-row', dataset: { res: id } }, [
        icon(resourceIconId(id), 'pictogram'),
        el('span', { class: 'res-name', text: t(`resource.${id}`) }),
        el('span', { class: 'res-figure' }, [figure.node]),
        el('span', { class: 'res-lamp', 'aria-hidden': 'true' }),
      ]);
      root.append(row);
      flaps.set(id, { figure, row });
    }
    update();
  }

  function update() {
    if (visibleIds().join(',') !== signature) return refresh();
    for (const [id, { figure, row }] of flaps) {
      const value = engine.state.resources[id] ?? 0;
      figure.set(formatBoard(value));
      const before = prev.get(id) ?? value;
      row.dataset.trend =
        value > before + 0.01 ? 'up' : value < before - 0.01 ? 'down' : 'flat';
      prev.set(id, value);
    }
  }

  return { root, refresh, update };
}
