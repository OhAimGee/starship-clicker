// Mini-jeu d'exploration à nœuds : chaque système-objectif de la run se joue
// comme une petite carte à rangées (voir CONFIG.run.map.rows). Le joueur
// choisit un nœud accessible (toute la rangée suivante) à chaque étape ;
// atteindre le nœud final (`conquest`) conquiert le système. Résolution
// automatique selon les stats : aucun hasard, aucun état d'échec permanent
// (voir DÉCISIONS du plan — un nœud `invade`/`conquest` hors de portée reste
// simplement tentable plus tard).
//
// Fonctions pures sur l'état (même convention que `economy.js`).

import { CONFIG } from '../data/config.js';
import { fleetPower, gain } from './economy.js';

const REWARD_FRACTION = { invade: 0.15, bonus: 0.08 };

/** Répartition des types de nœuds intérieurs (hors nœud final). */
function pickNodeType(rng) {
  const r = rng();
  if (r < 0.6) return 'invade';
  if (r < 0.85) return 'bonus';
  return 'skillPoint';
}

function scaleRewards(rewards, fraction) {
  const out = {};
  for (const [res, amount] of Object.entries(rewards)) {
    out[res] = Math.max(1, Math.floor(amount * fraction));
  }
  return out;
}

function buildNodeData(type, systemDef, row) {
  if (type === 'invade') {
    return {
      defenseRating: Math.round(systemDef.defenseRating * 0.25 * (row + 1)),
      rewards: scaleRewards(systemDef.rewards, REWARD_FRACTION.invade),
    };
  }
  if (type === 'bonus') {
    return { rewards: scaleRewards(systemDef.rewards, REWARD_FRACTION.bonus) };
  }
  return {}; // skillPoint : rien de plus à stocker
}

/**
 * Construit une carte à nœuds pour `systemDef` (un système-objectif de la
 * run, voir `exploration.js#generateRunTargets`). `queueIndex` doit être
 * unique au sein de la run (sert de préfixe aux ids de nœuds).
 * `rng` est injectable pour les tests (déterministe par défaut : `Math.random`).
 */
export function generateSystemMap(state, systemDef, queueIndex, rng = Math.random) {
  const rowSizes = CONFIG.run.map.rows;
  const defenseMult = state.run.objective?.defenseMult ?? 1;
  const rows = [];
  const nodes = {};

  rowSizes.forEach((size, row) => {
    const ids = [];
    for (let col = 0; col < size; col++) {
      const id = `sys${queueIndex}-r${row}n${col}`;
      const type = pickNodeType(rng);
      nodes[id] = { id, type, row, resolved: false, data: buildNodeData(type, systemDef, row) };
      ids.push(id);
    }
    rows.push(ids);
  });

  // Dernière rangée : 1 seul nœud, toujours le nœud de conquête.
  const finalRow = rowSizes.length;
  const finalId = `sys${queueIndex}-r${finalRow}n0`;
  nodes[finalId] = {
    id: finalId,
    type: CONFIG.run.map.finalNodeType,
    row: finalRow,
    resolved: false,
    data: {
      defenseRating: Math.round(systemDef.defenseRating * defenseMult),
      systemDef,
    },
  };
  rows.push([finalId]);

  return { id: `map-${queueIndex}`, systemDef, rows, nodes, currentRow: -1 };
}

/** Ids des nœuds actuellement choisissables (toute la rangée suivante). */
export function reachableNodeIds(map) {
  const nextRow = map.currentRow + 1;
  if (nextRow >= map.rows.length) return [];
  return map.rows[nextRow];
}

export function isMapComplete(map) {
  return map.currentRow >= map.rows.length - 1;
}

function conquestBuff(systemDef) {
  const entries = Object.entries(systemDef.rewards);
  if (entries.length === 0) return null;
  const [res] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  return {
    type: 'resourceProductionMultiplier',
    resources: [res],
    perLevel: 0.1,
  };
}

/**
 * Résout le nœud `nodeId` de `map` (doit faire partie de
 * `reachableNodeIds(map)`). Mute `state`/`map`.
 * @returns {{ ok: boolean, node?: object, type?: string, required?: number,
 *   reward?: object, system?: object }}
 */
export function resolveNode(state, map, nodeId) {
  const node = map.nodes[nodeId];
  if (!node || node.resolved || !reachableNodeIds(map).includes(nodeId)) {
    return { ok: false };
  }

  if (node.type === 'invade' || node.type === 'conquest') {
    const power = fleetPower(state);
    if (power < node.data.defenseRating) {
      return {
        ok: false,
        node,
        type: node.type,
        required: node.data.defenseRating,
      };
    }
  }

  node.resolved = true;
  map.currentRow = node.row;

  if (node.type === 'invade' || node.type === 'bonus') {
    gain(state, node.data.rewards);
    return { ok: true, node, type: node.type, reward: node.data.rewards };
  }

  if (node.type === 'skillPoint') {
    state.run.skillPoints += 1;
    return { ok: true, node, type: 'skillPoint' };
  }

  // conquest
  const systemDef = node.data.systemDef;
  state.run.exploration.conquered.push(systemDef);
  const buff = conquestBuff(systemDef);
  if (buff) state.run.buffs.push(buff);
  return { ok: true, node, type: 'conquest', system: systemDef, buff };
}
