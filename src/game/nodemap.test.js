import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import {
  generateSystemMap,
  reachableNodeIds,
  resolveNode,
  isMapComplete,
} from './nodemap.js';
import { CONFIG } from '../data/config.js';

function fixedRng(seq) {
  let i = 0;
  return () => seq[i++ % seq.length];
}

const TEST_SYSTEM = {
  name: 'Testia',
  archetype: 'mining',
  advanced: false,
  defenseRating: 100,
  rewards: { metal: 500, energy: 200 },
};

function makeMap(state, rngSeq = [0.9]) {
  return generateSystemMap(state, TEST_SYSTEM, 0, fixedRng(rngSeq));
}

describe('generateSystemMap', () => {
  it('construit les rangées de CONFIG + 1 rangée finale à 1 nœud de conquête', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    const map = makeMap(s);
    expect(map.rows.length).toBe(CONFIG.run.map.rows.length + 1);
    expect(map.rows.at(-1)).toHaveLength(1);
    const finalId = map.rows.at(-1)[0];
    expect(map.nodes[finalId].type).toBe(CONFIG.run.map.finalNodeType);
  });

  it('un seul nœud de conquête, aucun nœud orphelin', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    const map = makeMap(s);
    const conquestNodes = Object.values(map.nodes).filter(
      (n) => n.type === 'conquest'
    );
    expect(conquestNodes).toHaveLength(1);
    expect(map.rows.flat().sort()).toEqual(Object.keys(map.nodes).sort());
  });
});

describe('reachableNodeIds', () => {
  it('démarre sur la première rangée', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    const map = makeMap(s);
    expect(reachableNodeIds(map)).toEqual(map.rows[0]);
  });

  it('avance d’une rangée après résolution', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    s.ships.fighters.count = 1000;
    const map = makeMap(s);
    const [firstId] = reachableNodeIds(map);
    resolveNode(s, map, firstId);
    expect(reachableNodeIds(map)).toEqual(map.rows[1]);
  });
});

describe('resolveNode', () => {
  it('échec (puissance de flotte insuffisante) ne mute rien, le nœud reste tentable', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    const map = makeMap(s, [0.1]); // 0.1 -> 'invade'
    const [firstId] = reachableNodeIds(map);
    const before = JSON.stringify(s.run.exploration);

    const result = resolveNode(s, map, firstId);

    expect(result.ok).toBe(false);
    expect(map.nodes[firstId].resolved).toBe(false);
    expect(reachableNodeIds(map)).toContain(firstId);
    expect(JSON.stringify(s.run.exploration)).toBe(before);
  });

  it('refuse un nœud qui n’est pas accessible', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    const map = makeMap(s);
    const notReachable = map.rows[1][0];
    expect(resolveNode(s, map, notReachable).ok).toBe(false);
  });

  it('la conquête alimente run.exploration.conquered et ajoute un bonus de run', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    s.ships.fighters.count = 100000; // flotte énorme : tout passe
    const map = makeMap(s, [0.99]);

    while (!isMapComplete(map)) {
      const [id] = reachableNodeIds(map);
      const result = resolveNode(s, map, id);
      expect(result.ok).toBe(true);
    }

    expect(s.run.exploration.conquered).toHaveLength(1);
    expect(s.run.exploration.conquered[0].name).toBe('Testia');
    expect(s.run.buffs.length).toBeGreaterThan(0);
  });
});
