// Barre de ressources (en-tête). Dévoilement progressif : une ressource
// n'apparaît qu'une fois produite au moins une fois.

import { el, clear } from './dom.js';
import { RESOURCES } from '../data/resources.js';
import { t } from '../i18n/index.js';
import { formatNumber } from './format.js';

const ALWAYS_VISIBLE = new Set(['energy']);

function isVisible(state, id) {
  if (ALWAYS_VISIBLE.has(id)) return true;
  if (id === 'ascensionPoints') {
    return state.prestige.ascensions > 0 || state.resources.ascensionPoints > 0;
  }
  return (state.totalProduced[id] ?? 0) > 0 || (state.resources[id] ?? 0) > 0;
}

export function createResourcesBar(engine) {
  const root = el('div', {
    class: 'resources-bar',
    role: 'status',
    'aria-live': 'off',
  });
  let refs = new Map();
  let signature = '';

  function refresh() {
    const state = engine.state;
    const visible = RESOURCES.filter((r) => isVisible(state, r.id));
    signature = visible.map((r) => r.id).join(',');
    refs = new Map();
    clear(root);
    for (const r of visible) {
      const value = el('span', { class: 'res-value' });
      root.append(
        el('div', { class: 'res-chip', title: t(`resource.${r.id}`) }, [
          el('span', {
            class: 'res-icon',
            'aria-hidden': 'true',
            text: r.icon,
          }),
          value,
        ])
      );
      refs.set(r.id, value);
    }
    update();
  }

  function update() {
    const state = engine.state;
    const nowSig = RESOURCES.filter((r) => isVisible(state, r.id))
      .map((r) => r.id)
      .join(',');
    if (nowSig !== signature) {
      refresh();
      return;
    }
    for (const [id, node] of refs) {
      node.textContent = formatNumber(state.resources[id] ?? 0);
    }
  }

  return { root, refresh, update };
}
