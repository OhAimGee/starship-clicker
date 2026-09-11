// Rendu de la carte à nœuds (mini-jeu d'exploration) — un empilement
// vertical de rangées réglées, pas un canevas libre (cohérent avec le
// tableau ; voir DESIGN.md). Chaque nœud est un vrai <button>, la rangée
// accessible est mise en évidence. Un nœud invade/conquest ouvre le modal
// d'allocation de flotte (`open-combat`, voir app.js#fleet-allocation.js) —
// ce n'est pas un vrai combat sans préparation ; bonus/skillPoint se
// résolvent immédiatement (`choose-node`), ce ne sont pas des combats.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { nodeTypeIconId } from './icon-map.js';
import { formatNumber } from './format.js';
import { resourceCode } from '../data/resources.js';
import { reachableNodeIds } from '../game/nodemap.js';

const GATED_TYPES = new Set(['invade', 'conquest']);

function nodeMeta(node, gated) {
  if (gated) {
    return t('ui.labels.fleetPowerNeeded', {
      n: formatNumber(node.data.defenseRating),
    });
  }
  if (node.type === 'bonus') {
    return Object.entries(node.data.rewards)
      .map(([res, amt]) => `+${formatNumber(amt)} ${resourceCode(res)}`)
      .join('  ·  ');
  }
  return '';
}

export function renderNodeMap(engine) {
  const map = engine.state.run.exploration.activeMap;
  if (!map) {
    return el('p', { class: 'panel-note', text: t('ui.nodeMap.none') });
  }

  const reachable = new Set(reachableNodeIds(map));
  const power = engine.fleetPower;
  const root = el('ol', { class: 'node-map' });

  map.rows.forEach((rowIds) => {
    const row = el('li', {
      class: 'node-map-row',
      dataset: { current: rowIds.some((id) => reachable.has(id)) },
    });
    const group = el('div', { class: 'node-map-nodes' });

    for (const id of rowIds) {
      const node = map.nodes[id];
      const gated = GATED_TYPES.has(node.type);
      const isReachable = reachable.has(id);
      const afford = !gated || power >= node.data.defenseRating;
      const state = node.resolved
        ? 'done'
        : !isReachable
          ? 'locked'
          : afford
            ? 'afford'
            : 'cant';

      const meta = nodeMeta(node, gated);
      group.append(
        el(
          'button',
          {
            class: `node-btn node-btn-${node.type}`,
            type: 'button',
            disabled: !isReachable,
            dataset: {
              action: gated ? 'open-combat' : 'choose-node',
              id,
              state,
            },
          },
          [
            icon(nodeTypeIconId(node.type), 'node-icon'),
            el('span', { class: 'node-label' }, [
              el('span', {
                class: 'node-name',
                text: t(`ui.nodeMap.${node.type}`),
              }),
              meta ? el('span', { class: 'node-sub', text: meta }) : null,
            ]),
          ]
        )
      );
    }

    row.append(group);
    root.append(row);
  });

  return root;
}
