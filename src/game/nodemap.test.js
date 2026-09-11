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

  it('combat = récompense : aucune rangée générée ne mélange `invade` et ' +
    '`bonus` (un `bonus` co-présent avec un `invade` devient `skillPoint`)', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    for (let trial = 0; trial < 200; trial++) {
      const map = generateSystemMap(s, TEST_SYSTEM, trial, Math.random);
      for (const row of map.rows) {
        const types = new Set(row.map((id) => map.nodes[id].type));
        expect(types.has('invade') && types.has('bonus')).toBe(false);
      }
    }
  });

  it('les récompenses `invade` sont nettement supérieures à l’ancienne ' +
    'fraction (0.15 -> 0.28)', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    // rng constant : pickNodeType -> 'invade' (0.1 < 0.6), et la même
    // constante alimente randomizedRewards de façon déterministe.
    const map = generateSystemMap(s, TEST_SYSTEM, 0, fixedRng([0.1]));
    const invadeNode = Object.values(map.nodes).find(
      (n) => n.type === 'invade' && n.row === 0
    );
    expect(invadeNode).toBeDefined();
    // Avec cette rng constante, une seule ressource est retenue (`count` =
    // 1) ; peu importe laquelle (l'ordre du mélange dépend de l'algorithme
    // de tri), sa valeur de base est 500 ou 200 — dans les deux cas la
    // nouvelle fraction (0.28) doit dépasser nettement l'ancienne (0.15) à
    // variance égale (0.7 + 0.1*0.6 = 0.76).
    const rewardEntries = Object.entries(invadeNode.data.rewards);
    expect(rewardEntries).toHaveLength(1);
    const [res, amount] = rewardEntries[0];
    const base = TEST_SYSTEM.rewards[res];
    const oldFractionAmount = Math.max(1, Math.floor(base * 0.15 * 0.76));
    expect(amount).toBe(Math.max(1, Math.floor(base * 0.28 * 0.76)));
    expect(amount).toBeGreaterThan(oldFractionAmount);
  });

  it('la difficulté des nœuds `invade` intérieurs suit `defenseMult`, comme ' +
    'le nœud `conquest` final', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    s.run.objective.defenseMult = 1;
    const mapBase = generateSystemMap(s, TEST_SYSTEM, 0, fixedRng([0.1]));
    const invadeBase = Object.values(mapBase.nodes).find(
      (n) => n.type === 'invade' && n.row === 0
    );

    s.run.objective.defenseMult = 2;
    const mapScaled = generateSystemMap(s, TEST_SYSTEM, 1, fixedRng([0.1]));
    const invadeScaled = Object.values(mapScaled.nodes).find(
      (n) => n.type === 'invade' && n.row === 0
    );

    expect(invadeBase.data.defenseRating).toBe(25);
    expect(invadeScaled.data.defenseRating).toBe(
      invadeBase.data.defenseRating * 2
    );
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

  it('un combat perdu avec une allocation partielle inflige des pertes ' +
    'mais laisse le nœud retentable', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    s.ships.fighters.count = 1000; // largement de quoi gagner...
    const map = makeMap(s, [0.1]); // 0.1 -> 'invade'
    const [firstId] = reachableNodeIds(map);

    // ... mais on n'engage volontairement qu'une poignée de vaisseaux.
    const result = resolveNode(s, map, firstId, { fighters: 1 });

    expect(result.ok).toBe(false);
    expect(result.battle.victory).toBe(false);
    expect(map.nodes[firstId].resolved).toBe(false);
    expect(reachableNodeIds(map)).toContain(firstId);
    // Les pertes s'appliquent quand même à la flotte engagée.
    expect(s.ships.fighters.count).toBeLessThan(1000);

    // Le nœud reste tentable avec une allocation suffisante.
    const retry = resolveNode(s, map, firstId, {
      fighters: s.ships.fighters.count,
    });
    expect(retry.ok).toBe(true);
    expect(map.nodes[firstId].resolved).toBe(true);
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
