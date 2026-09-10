import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import {
  isUnlocked,
  generatorCost,
  shipCost,
  clickUpgradeCost,
  techMultipliers,
  prestigeMultipliers,
  clickPower,
  fleetPower,
  grossProduction,
  netProduction,
  canAfford,
  spend,
  gain,
} from './economy.js';

describe('isUnlocked', () => {
  it('vrai sans condition', () => {
    expect(isUnlocked(createInitialState(), undefined)).toBe(true);
  });
  it('seuil de cumul produit', () => {
    const s = createInitialState();
    expect(isUnlocked(s, { resource: 'metal', total: 40 })).toBe(false);
    s.totalProduced.metal = 40;
    expect(isUnlocked(s, { resource: 'metal', total: 40 })).toBe(true);
  });
  it('condition sur une techno', () => {
    const s = createInitialState();
    expect(isUnlocked(s, { tech: 'darkMatterPhysics' })).toBe(false);
    s.technologies.darkMatterPhysics.unlocked = true;
    expect(isUnlocked(s, { tech: 'darkMatterPhysics' })).toBe(true);
  });
});

describe('coûts', () => {
  it('générateur : croissance géométrique', () => {
    const s = createInitialState();
    const c0 = generatorCost(s, 'solarPanel');
    s.generators.solarPanel.count = 1;
    const c1 = generatorCost(s, 'solarPanel');
    expect(c1).toBeGreaterThan(c0);
    expect(c1 / c0).toBeCloseTo(1.15, 1);
  });

  it('générateur : réduit par les ascensions', () => {
    const s = createInitialState();
    const base = generatorCost(s, 'solarPanel');
    s.prestige.ascensions = 2;
    expect(generatorCost(s, 'solarPanel')).toBeLessThan(base);
  });

  it('vaisseau : chaque ressource du coût croît', () => {
    const s = createInitialState();
    const c0 = shipCost(s, 'fighters');
    s.ships.fighters.count = 2;
    const c1 = shipCost(s, 'fighters');
    expect(c1.energy).toBeGreaterThan(c0.energy);
    expect(c1.metal).toBeGreaterThan(c0.metal);
  });

  it('amélioration de clic : croît avec le niveau', () => {
    const s = createInitialState();
    const c0 = clickUpgradeCost(s, 'clickPower');
    s.clickUpgrades.clickPower.level = 3;
    expect(clickUpgradeCost(s, 'clickPower')).toBeGreaterThan(c0);
  });
});

describe('multiplicateurs', () => {
  it('les technos de production se cumulent en produit', () => {
    const s = createInitialState();
    s.technologies.quantumComputing.unlocked = true; // x1.5
    s.technologies.voidTechnology.unlocked = true; // x3
    expect(techMultipliers(s).generatorProduction).toBeCloseTo(4.5);
  });

  it('les ascensions et améliorations de prestige augmentent la production', () => {
    const s = createInitialState();
    s.prestige.ascensions = 1; // +20 %
    s.prestige.upgrades.prestigeProduction.level = 2; // +10 %/niv => +20 %
    expect(prestigeMultipliers(s).production).toBeCloseTo(1.2 * 1.2);
  });

  it('quantumAffinity ne booste que matière noire et énergie quantique', () => {
    const s = createInitialState();
    s.prestige.upgrades.quantumAffinity.level = 1; // +50 %
    const m = prestigeMultipliers(s);
    expect(m.resourceProduction.darkMatter).toBeCloseTo(1.5);
    expect(m.resourceProduction.quantumEnergy).toBeCloseTo(1.5);
    expect(m.resourceProduction.energy).toBeUndefined();
  });
});

describe('pouvoir de clic', () => {
  it('au moins 1, augmenté par le niveau et les multiplicateurs', () => {
    const s = createInitialState();
    expect(clickPower(s)).toBe(1);
    s.clickPowerBase = 5;
    s.prestige.upgrades.prestigeClick.level = 1; // +25 %
    expect(clickPower(s)).toBe(6); // floor(5 * 1.25)
  });
});

describe('production', () => {
  it('brute = somme pondérée ; nette retranche la maintenance', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10; // 5 énergie/s
    s.ships.fighters.count = 2; // maintenance 2
    expect(grossProduction(s).energy).toBeCloseTo(5);
    expect(netProduction(s).energy).toBeCloseTo(3);
  });

  it('les auto-clickers ajoutent clickPower/s à l’énergie', () => {
    const s = createInitialState();
    s.clickUpgrades.autoClicker.count = 3;
    s.clickPowerBase = 2;
    expect(grossProduction(s).energy).toBeCloseTo(6);
  });
});

describe('flotte', () => {
  it('puissance = somme(count * attaque) * bonus de prestige', () => {
    const s = createInitialState();
    s.ships.fighters.count = 10; // 10 * 2 = 20
    s.ships.cruisers.count = 2; // 2 * 6 = 12
    expect(fleetPower(s)).toBe(32);
    s.prestige.upgrades.fleetCommand.level = 1; // +20 %
    expect(fleetPower(s)).toBe(Math.floor(32 * 1.2));
  });
});

describe('solde', () => {
  it('canAfford / spend / gain', () => {
    const s = createInitialState();
    s.resources.energy = 100;
    expect(canAfford(s, { energy: 150 })).toBe(false);
    expect(canAfford(s, { energy: 80 })).toBe(true);
    spend(s, { energy: 80 });
    expect(s.resources.energy).toBe(20);
    gain(s, { energy: 10, metal: 5 });
    expect(s.resources.energy).toBe(30);
    expect(s.totalProduced.metal).toBe(5);
  });
});
