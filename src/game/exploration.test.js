import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import {
  initExploration,
  ensureSystemsUpTo,
  ensureVisibleSystems,
} from './exploration.js';

describe('initExploration', () => {
  it('génère une fenêtre de systèmes visibles au niveau de joueur 0', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    expect(s.run.exploration.systems.length).toBeGreaterThan(0);
    expect(s.run.exploration.activeSystemIndex).toBeNull();
  });

  it('chaque système généré a un niveau requis et des planètes', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    for (const system of s.run.exploration.systems) {
      expect(typeof system.requiredLevel).toBe('number');
      expect(system.planets.length).toBeGreaterThan(0);
      expect(system.conquered).toBe(false);
    }
  });
});

describe('ensureSystemsUpTo', () => {
  it('génère paresseusement, jamais moins que demandé', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const before = s.run.exploration.systems.length;
    ensureSystemsUpTo(s, before + 10);
    expect(s.run.exploration.systems.length).toBe(before + 11);
  });

  it('idempotent : rappeler avec un index déjà couvert ne régénère rien', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const before = [...s.run.exploration.systems];
    ensureSystemsUpTo(s, 0);
    expect(s.run.exploration.systems).toEqual(before);
  });

  it('un système déjà généré garde sa composition (même index -> même contenu)', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const first = s.run.exploration.systems[0];
    ensureSystemsUpTo(s, 5);
    expect(s.run.exploration.systems[0]).toBe(first);
  });
});

describe('ensureVisibleSystems', () => {
  it('la fenêtre visible grandit avec le niveau du joueur', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const atLevel0 = s.run.exploration.systems.length;
    ensureVisibleSystems(s, 10);
    expect(s.run.exploration.systems.length).toBeGreaterThan(atLevel0);
  });

  it('relit advancedUnlocked à chaque système généré : warpDrive en cours '
    + 'de run donne accès à des systèmes avancés parmi les suivants', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const before = s.run.exploration.systems.length;
    s.technologies.warpDrive.unlocked = true;
    s.run.exploration.advancedUnlocked = true;
    ensureSystemsUpTo(s, before + 10);
    const newOnes = s.run.exploration.systems.slice(before);
    expect(newOnes.some((sys) => sys.advanced)).toBe(true);
  });

  it('la défense/le nombre de planètes continue de grimper avec l’index', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    ensureSystemsUpTo(s, 20);
    const systems = s.run.exploration.systems;
    expect(systems[20].defenseRating).toBeGreaterThan(systems[0].defenseRating);
    expect(systems[20].requiredLevel).toBeGreaterThan(systems[0].requiredLevel);
  });
});
