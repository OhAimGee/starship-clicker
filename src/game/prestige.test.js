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
  s.exploration.advancedUnlocked = true;
  s.exploration.conquered = [
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
    expect(s.exploration.conquered).toHaveLength(0);
  });

  it('conserve technos, améliorations de prestige et lifetime', () => {
    const s = advancedState();
    s.prestige.upgrades.prestigeProduction.level = 5;
    ascend(s);
    expect(s.technologies.quantumComputing.unlocked).toBe(true);
    expect(s.prestige.upgrades.prestigeProduction.level).toBe(5);
    expect(s.prestige.lifetime.energy).toBe(5e6);
    // warpDrive conservé -> systèmes avancés toujours débloqués
    expect(s.exploration.advancedUnlocked).toBe(true);
  });

  it('accorde un capital de redémarrage proportionnel aux ascensions', () => {
    const s = advancedState();
    ascend(s);
    expect(s.resources.energy).toBe(CONFIG.ascension.restartGrant.energy * 1);
  });
});
