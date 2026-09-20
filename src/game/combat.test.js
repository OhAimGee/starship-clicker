import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import {
  committedFleetPower,
  fleetMultiplier,
  fleetDurabilityMultiplier,
  minimumAllocation,
} from './combat.js';

function makeState(factionId = 'miningCollective') {
  const s = createInitialState();
  startRun(s, factionId); // miningCollective : pas de bonus de flotte, calculs simples
  return s;
}

describe('committedFleetPower', () => {
  it('ne compte que les vaisseaux alloués, pas la flotte entière', () => {
    const s = makeState();
    s.ships.fighters.count = 100; // attack 2
    s.ships.cruisers.count = 50; // attack 6
    expect(committedFleetPower(s, { fighters: 10 })).toBe(20);
    expect(committedFleetPower(s, { fighters: 10, cruisers: 5 })).toBe(50);
  });
});

describe('minimumAllocation', () => {
  it('un seul type : le nombre minimal de vaisseaux qui atteint la défense', () => {
    const s = makeState();
    s.ships.fighters.count = 100; // attack 2
    const { allocation, sufficient } = minimumAllocation(s, 101);
    expect(sufficient).toBe(true);
    expect(allocation).toEqual({ fighters: 51 }); // 51*2 = 102 >= 101
    expect(committedFleetPower(s, { fighters: 50 })).toBeLessThan(101);
  });

  it('défense exactement atteinte : pas un vaisseau de trop', () => {
    const s = makeState();
    s.ships.fighters.count = 100;
    expect(minimumAllocation(s, 100).allocation).toEqual({ fighters: 50 });
  });

  it('engage les petits vaisseaux d’abord : aucun gros si les petits suffisent', () => {
    const s = makeState();
    s.ships.fighters.count = 100; // 200 de puissance au total
    s.ships.cruisers.count = 10;
    const { allocation } = minimumAllocation(s, 100);
    expect(allocation).toEqual({ fighters: 50 });
    expect(allocation.cruisers).toBeUndefined();
  });

  it('mélange : petits en totalité, puis juste ce qu’il faut du type suivant', () => {
    const s = makeState();
    s.ships.fighters.count = 10; // 20
    s.ships.cruisers.count = 50; // 6 chacun
    const { allocation, sufficient } = minimumAllocation(s, 50);
    expect(sufficient).toBe(true);
    expect(allocation.fighters).toBe(10);
    // Il reste 30 à couvrir : 5 croiseurs = 30 pile.
    expect(allocation.cruisers).toBe(5);
    expect(committedFleetPower(s, allocation)).toBeGreaterThanOrEqual(50);
    // Minimal : un croiseur de moins ne suffit plus.
    expect(
      committedFleetPower(s, { ...allocation, cruisers: 4 })
    ).toBeLessThan(50);
  });

  it('prend en compte les multiplicateurs de flotte (bonus de faction)', () => {
    const plain = makeState();
    const legion = makeState('ironLegion'); // +20 % de puissance de flotte
    plain.ships.fighters.count = 1000;
    legion.ships.fighters.count = 1000;
    const a = minimumAllocation(plain, 600).allocation.fighters;
    const b = minimumAllocation(legion, 600).allocation.fighters;
    expect(a).toBe(300);
    expect(b).toBeLessThan(a);
    expect(committedFleetPower(legion, { fighters: b })).toBeGreaterThanOrEqual(
      600
    );
    expect(
      committedFleetPower(legion, { fighters: b - 1 })
    ).toBeLessThan(600);
  });

  it('flotte insuffisante : renvoie la flotte entière, marquée insuffisante', () => {
    const s = makeState();
    s.ships.fighters.count = 5;
    s.ships.cruisers.count = 2;
    const { allocation, sufficient } = minimumAllocation(s, 1_000_000);
    expect(sufficient).toBe(false);
    expect(allocation).toEqual({ fighters: 5, cruisers: 2 });
  });

  it('sans vaisseau : allocation vide, insuffisante', () => {
    const s = makeState();
    expect(minimumAllocation(s, 10)).toEqual({
      allocation: {},
      sufficient: false,
    });
  });

  it('ignore les types non possédés', () => {
    const s = makeState();
    s.ships.fighters.count = 20;
    s.ships.titans.count = 0;
    const { allocation } = minimumAllocation(s, 10);
    expect(Object.keys(allocation)).toEqual(['fighters']);
  });

  it('l’allocation minimale atteint toujours la défense quand la flotte suffit', () => {
    const s = makeState();
    s.ships.fighters.count = 37;
    s.ships.cruisers.count = 12;
    s.ships.dreadnoughts.count = 3; // 74 + 72 + 75 = 221 de puissance au total
    for (const defense of [1, 7, 50, 111, 150, 221]) {
      const { allocation, sufficient } = minimumAllocation(s, defense);
      expect(sufficient, `défense ${defense}`).toBe(true);
      expect(committedFleetPower(s, allocation)).toBeGreaterThanOrEqual(defense);
    }
  });
});

describe('multiplicateurs de flotte', () => {
  it('fleetMultiplier vaut 1 sans bonus, et le bonus de faction s’y retrouve', () => {
    expect(fleetMultiplier(makeState('miningCollective'))).toBe(1);
    expect(fleetMultiplier(makeState('ironLegion'))).toBeCloseTo(1.2, 10);
  });

  it('fleetDurabilityMultiplier vaut 1 sans effet de durabilité, et suit la compétence de run', () => {
    const s = makeState();
    expect(fleetDurabilityMultiplier(s)).toBe(1);
    s.run.skillTree.reinforcedHulls.level = 2;
    expect(fleetDurabilityMultiplier(s)).toBeGreaterThan(1);
    // La durabilité n'augmente PAS la puissance d'attaque.
    expect(fleetMultiplier(s)).toBe(1);
  });
});
