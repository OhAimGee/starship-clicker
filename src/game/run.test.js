import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import {
  startRun,
  pickObjective,
  isObjectiveComplete,
  buyFactionSkill,
} from './run.js';
import { CONFIG } from '../data/config.js';

describe('pickObjective', () => {
  it('rampe pédagogique : ressources -> flotte -> 1 système -> conquête complète', () => {
    expect(pickObjective(0).id).toBe('gatherResources');
    expect(pickObjective(1).id).toBe('reachFleetPower');
    expect(pickObjective(2).id).toBe('conquerOne');
    expect(pickObjective(3).id).toBe('conquerAll');
    expect(pickObjective(10).id).toBe('conquerAll');
  });
});

describe('startRun', () => {
  it('refuse une faction inconnue', () => {
    const s = createInitialState();
    expect(startRun(s, 'nope')).toBe(false);
    expect(s.run.factionId).toBeNull();
  });

  it('niveau 0 : objectif "amasser des ressources", sans file de systèmes', () => {
    const s = createInitialState();
    expect(startRun(s, 'miningCollective')).toBe(true);
    expect(s.run.factionId).toBe('miningCollective');
    expect(s.run.objective.type).toBe('gatherResources');
    expect(s.run.objective.resource).toBe(CONFIG.run.resourceObjectiveResource);
    expect(s.run.objective.target).toBe(CONFIG.run.resourceObjectiveBase);
  });

  it('niveau 1 : objectif "atteindre une puissance de flotte"', () => {
    const s = createInitialState();
    s.prestige.factions.miningCollective.level = 1;
    startRun(s, 'miningCollective');
    expect(s.run.objective.type).toBe('reachFleetPower');
    expect(s.run.objective.target).toBe(
      Math.round(
        CONFIG.run.fleetPowerObjectiveBase *
          (1 + 1 * CONFIG.run.fleetPowerObjectivePerLevel)
      )
    );
  });

  it('niveau 2 : objectif "conquérir un système"', () => {
    const s = createInitialState();
    s.prestige.factions.miningCollective.level = 2;
    startRun(s, 'miningCollective');
    expect(s.run.objective.type).toBe('conquerOne');
    expect(s.run.objective.target).toBe(1);
  });

  it('niveau 3+ : objectif "conquérir plusieurs systèmes", grandit avec le niveau', () => {
    const s = createInitialState();
    s.prestige.factions.miningCollective.level = 3;
    startRun(s, 'miningCollective');
    expect(s.run.objective.type).toBe('conquerAll');
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

  it('conquerAll/conquerOne : vrai une fois assez de systèmes conquis', () => {
    const s = createInitialState();
    s.prestige.factions.ironLegion.level = 3; // objectif conquerAll
    startRun(s, 'ironLegion');
    s.run.objective.target = 2;
    expect(isObjectiveComplete(s)).toBe(false);
    s.run.exploration.conquered = [{}, {}];
    expect(isObjectiveComplete(s)).toBe(true);
  });

  it('reachFleetPower : vrai une fois la puissance de flotte atteinte', () => {
    const s = createInitialState();
    s.prestige.factions.ironLegion.level = 1; // objectif reachFleetPower
    startRun(s, 'ironLegion');
    s.run.objective.target = 10;
    expect(isObjectiveComplete(s)).toBe(false);
    s.ships.fighters.count = 10; // 10 * 2 attaque = 20 >= 10
    expect(isObjectiveComplete(s)).toBe(true);
  });

  it('gatherResources : vrai une fois la ressource amassée (totalProduced)', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion'); // niveau 0 -> objectif gatherResources
    s.run.objective.target = 100;
    expect(isObjectiveComplete(s)).toBe(false);
    s.totalProduced[s.run.objective.resource] = 100;
    expect(isObjectiveComplete(s)).toBe(true);
    // dépenser la ressource ensuite ne "dé-complète" pas l'objectif
    s.resources[s.run.objective.resource] = 0;
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
    expect(s.prestige.factions.quantumOrder.skills.entangledFields.level).toBe(
      1
    );
  });

  it('refuse une compétence ou une faction inconnue', () => {
    const s = createInitialState();
    s.resources.ascensionPoints = 1000;
    expect(buyFactionSkill(s, 'quantumOrder', 'nope')).toBe(false);
    expect(buyFactionSkill(s, 'nope', 'entangledFields')).toBe(false);
  });
});
