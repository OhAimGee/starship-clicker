import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { canAscend, potentialPoints, ascend } from './prestige.js';
import { CONFIG } from '../data/config.js';

function advancedState() {
  const s = createInitialState();
  s.resources.quantumEnergy = 3500;
  s.resources.energy = 1e6;
  s.resources.ascensionPoints = 4;
  s.generators.solarPanel.count = 50;
  s.ships.fighters.count = 20;
  s.clickPowerBase = 12;
  s.clickUpgrades.clickPower.level = 11;
  s.technologies.quantumComputing.unlocked = true;
  s.technologies.warpDrive.unlocked = true;
  s.totalProduced.energy = 5e6;
  s.run.exploration.advancedUnlocked = true;
  s.run.exploration.conquered = [
    { name: 'X', archetype: 'a', rewards: { energy: 1 }, defenseRating: 1 },
  ];
  return s;
}

describe('canAscend / potentialPoints', () => {
  it('exige le seuil d’énergie quantique', () => {
    const s = createInitialState();
    expect(canAscend(s)).toBe(false);
    s.resources.quantumEnergy = CONFIG.ascension.quantumCost;
    expect(canAscend(s)).toBe(true);
  });

  it('points = floor(quantumEnergy / divisor)', () => {
    const s = createInitialState();
    s.resources.quantumEnergy = 3500;
    expect(potentialPoints(s)).toBe(3);
  });
});

describe('ascend', () => {
  it('accorde les points et incrémente le compteur d’ascensions', () => {
    const s = advancedState();
    const { points } = ascend(s);
    expect(points).toBe(3);
    expect(s.prestige.ascensions).toBe(1);
    expect(s.resources.ascensionPoints).toBe(4 + 3);
  });

  it('remet à zéro générateurs, flotte, cumul produit et énergie', () => {
    const s = advancedState();
    ascend(s);
    expect(s.generators.solarPanel.count).toBe(0);
    expect(s.ships.fighters.count).toBe(0);
    expect(s.totalProduced.energy).toBe(0);
    expect(s.clickPowerBase).toBe(1);
    expect(s.clickUpgrades.clickPower.level).toBe(0);
    expect(s.run.exploration.conquered).toHaveLength(0);
  });

  it('conserve technos, améliorations de prestige et lifetime', () => {
    const s = advancedState();
    s.prestige.upgrades.prestigeProduction.level = 5;
    ascend(s);
    expect(s.technologies.quantumComputing.unlocked).toBe(true);
    expect(s.prestige.upgrades.prestigeProduction.level).toBe(5);
    expect(s.prestige.lifetime.energy).toBe(5e6);
    // warpDrive conservé -> systèmes avancés toujours débloqués
    expect(s.run.exploration.advancedUnlocked).toBe(true);
  });

  it('accorde un capital de redémarrage proportionnel aux ascensions', () => {
    const s = advancedState();
    ascend(s);
    expect(s.resources.energy).toBe(CONFIG.ascension.restartGrant.energy * 1);
  });
});

describe('ascend — faction & run', () => {
  it('incrémente le niveau de la faction active et vide la run', () => {
    const s = advancedState();
    s.run.factionId = 'ironLegion';
    s.run.buffs = [{ type: 'fleetMultiplier', perLevel: 1 }];
    s.run.skillPoints = 4;
    ascend(s);
    expect(s.prestige.factions.ironLegion.level).toBe(1);
    expect(s.run.factionId).toBeNull();
    expect(s.run.objective).toBeNull();
    expect(s.run.buffs).toEqual([]);
    expect(s.run.skillPoints).toBe(0);
  });

  it('ascension anticipée (objectif non atteint) : pas de bonus de PA', () => {
    const s = advancedState();
    s.run.factionId = 'ironLegion';
    s.run.objective = { type: 'conquerAll', target: 99, defenseMult: 1 };
    s.run.skillPoints = 10;
    const before = s.resources.ascensionPoints;
    const { points, objectiveComplete } = ascend(s);
    expect(objectiveComplete).toBe(false);
    expect(s.resources.ascensionPoints).toBe(before + points);
  });

  it('objectif atteint : bonus de PA proportionnel aux points de run', () => {
    const s = advancedState();
    s.run.factionId = 'ironLegion';
    s.run.objective = { type: 'conquerAll', target: 1, defenseMult: 1 };
    s.run.exploration.conquered = [{ name: 'X' }];
    s.run.skillPoints = 10; // *0.5 => +5 PA
    const before = s.resources.ascensionPoints;
    const { points, objectiveComplete } = ascend(s);
    expect(objectiveComplete).toBe(true);
    expect(s.resources.ascensionPoints).toBe(before + points + 5);
  });
});
