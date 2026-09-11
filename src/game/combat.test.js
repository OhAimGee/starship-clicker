import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import { committedFleetPower, resolveBattle } from './combat.js';

function makeState() {
  const s = createInitialState();
  startRun(s, 'miningCollective'); // pas de bonus de flotte : calculs simples
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

describe('resolveBattle', () => {
  it('est déterministe : mêmes entrées, mêmes pertes', () => {
    const s = makeState();
    s.ships.fighters.count = 100;
    const a = resolveBattle(s, { fighters: 60 }, 100);
    const b = resolveBattle(s, { fighters: 60 }, 100);
    expect(a).toEqual(b);
  });

  it('une victoire de justesse coûte plus cher qu’une victoire écrasante', () => {
    const s = makeState();
    s.ships.fighters.count = 100000;
    // Puissance engagée tout juste suffisante (defenseRating == committedPower)
    const narrow = resolveBattle(s, { fighters: 50 }, 100); // 50*2 = 100
    // Puissance engagée très supérieure à la défense requise
    const overwhelming = resolveBattle(s, { fighters: 100000 }, 100);
    expect(narrow.victory).toBe(true);
    expect(overwhelming.victory).toBe(true);
    expect(narrow.lossFraction).toBeGreaterThan(overwhelming.lossFraction);
  });

  it('une défaite coûte plus cher qu’une victoire à ratio comparable', () => {
    const s = makeState();
    s.ships.fighters.count = 100000;
    // Ratio de compétitivité ~identique des deux côtés du seuil de victoire.
    const win = resolveBattle(s, { fighters: 51 }, 100); // 102 >= 100 : victoire
    const lose = resolveBattle(s, { fighters: 49 }, 100); // 98 < 100 : défaite
    expect(win.victory).toBe(true);
    expect(lose.victory).toBe(false);
    expect(lose.lossFraction).toBeGreaterThan(win.lossFraction);
  });

  it('répartit les pertes proportionnellement par type de vaisseau engagé', () => {
    const s = makeState();
    s.ships.fighters.count = 100000;
    s.ships.cruisers.count = 100000;
    // Défaite franche (engagement très faible) : lossFraction au plafond.
    const battle = resolveBattle(
      s,
      { fighters: 1000, cruisers: 500 },
      1_000_000
    );
    expect(battle.victory).toBe(false);
    expect(battle.losses.fighters).toBeGreaterThan(0);
    expect(battle.losses.cruisers).toBeGreaterThan(0);
    // Même fraction appliquée aux deux types engagés (à l'arrondi près).
    const ratio = battle.losses.fighters / 1000;
    const ratioCruisers = battle.losses.cruisers / 500;
    expect(Math.abs(ratio - ratioCruisers)).toBeLessThan(0.05);
  });

  it('un type de vaisseau non engagé (allocation 0) ne perd jamais rien', () => {
    const s = makeState();
    s.ships.fighters.count = 100000;
    s.ships.cruisers.count = 100000;
    const battle = resolveBattle(s, { fighters: 100, cruisers: 0 }, 1000);
    expect(battle.losses.cruisers).toBeUndefined();
  });
});
