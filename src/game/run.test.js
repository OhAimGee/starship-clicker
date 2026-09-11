import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun, isObjectiveComplete, buyFactionSkill } from './run.js';
import { CONFIG } from '../data/config.js';

describe('startRun', () => {
  it('refuse une faction inconnue', () => {
    const s = createInitialState();
    expect(startRun(s, 'nope')).toBe(false);
    expect(s.run.factionId).toBeNull();
  });

  it('fixe la faction et construit l’objectif', () => {
    const s = createInitialState();
    expect(startRun(s, 'miningCollective')).toBe(true);
    expect(s.run.factionId).toBe('miningCollective');
    expect(s.run.objective.type).toBe('conquerAll');
    expect(s.run.objective.target).toBe(CONFIG.run.baseSystems);
  });

  it('l’objectif grandit avec le niveau de la faction', () => {
    const s = createInitialState();
    s.prestige.factions.miningCollective.level = 3;
    startRun(s, 'miningCollective');
    expect(s.run.objective.target).toBe(
      CONFIG.run.baseSystems + Math.floor(3 * CONFIG.run.systemsPerLevel)
    );
    expect(s.run.objective.defenseMult).toBeCloseTo(
      1 + 3 * CONFIG.run.defenseGrowthPerLevel
    );
  });

  it('ne construit pas la file de systèmes (c’est Engine#selectFaction qui l’enchaîne)', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    expect(s.run.exploration.targets).toEqual([]);
    expect(s.run.exploration.activeMap).toBeNull();
  });

  it('réinitialise les bonus/points de compétence de run', () => {
    const s = createInitialState();
    s.run.buffs = [{ type: 'fleetMultiplier', perLevel: 1 }];
    s.run.skillPoints = 5;
    startRun(s, 'ironLegion');
    expect(s.run.buffs).toEqual([]);
    expect(s.run.skillPoints).toBe(0);
  });
});

describe('isObjectiveComplete', () => {
  it('faux sans objectif (aucune run en cours)', () => {
    expect(isObjectiveComplete(createInitialState())).toBe(false);
  });

  it('vrai une fois assez de systèmes conquis', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    s.run.objective.target = 2;
    expect(isObjectiveComplete(s)).toBe(false);
    s.run.exploration.conquered = [{}, {}];
    expect(isObjectiveComplete(s)).toBe(true);
  });
});

describe('buyFactionSkill', () => {
  it('achète et monte le niveau ; échoue si PA insuffisants', () => {
    const s = createInitialState();
    startRun(s, 'quantumOrder');
    s.resources.ascensionPoints = 0;
    expect(buyFactionSkill(s, 'quantumOrder', 'entangledFields')).toBe(false);

    s.resources.ascensionPoints = 10;
    expect(buyFactionSkill(s, 'quantumOrder', 'entangledFields')).toBe(true);
    expect(
      s.prestige.factions.quantumOrder.skills.entangledFields.level
    ).toBe(1);
  });

  it('refuse une compétence ou une faction inconnue', () => {
    const s = createInitialState();
    s.resources.ascensionPoints = 1000;
    expect(buyFactionSkill(s, 'quantumOrder', 'nope')).toBe(false);
    expect(buyFactionSkill(s, 'nope', 'entangledFields')).toBe(false);
  });
});
