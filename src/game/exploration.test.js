import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import { generateRunTargets, startNextMap } from './exploration.js';
import { CONFIG } from '../data/config.js';

describe('generateRunTargets', () => {
  it('construit une file de `objective.target` systèmes', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    generateRunTargets(s);
    expect(s.run.exploration.targets).toHaveLength(CONFIG.run.baseSystems);
  });
});

describe('startNextMap', () => {
  it('dépile un système et construit sa carte active', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    generateRunTargets(s);
    const before = s.run.exploration.targets.length;

    const map = startNextMap(s);

    expect(map).not.toBeNull();
    expect(s.run.exploration.targets).toHaveLength(before - 1);
    expect(s.run.exploration.activeMap).toBe(map);
  });

  it('renvoie null et vide activeMap quand la file est épuisée', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    s.run.exploration.targets = [];
    const map = startNextMap(s);
    expect(map).toBeNull();
    expect(s.run.exploration.activeMap).toBeNull();
  });
});
