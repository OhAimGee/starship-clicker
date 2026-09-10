import { describe, it, expect } from 'vitest';
import {
  ratesPerSecond,
  computeOfflineGains,
  applyOfflineGains,
  DEFAULT_OFFLINE_CAP_MS,
} from './offline.js';
import { createInitialState } from './initial-state.js';

describe('ratesPerSecond', () => {
  it('est nulle sur un état neuf', () => {
    const rates = ratesPerSecond(createInitialState());
    expect(Object.values(rates).every((v) => v === 0)).toBe(true);
  });

  it('somme la production des générateurs possédés', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10; // 10 * 0.5 = 5 énergie/s
    s.generators.miningDrone.count = 4; // 4 * 0.3 = 1.2 métal/s
    const rates = ratesPerSecond(s);
    expect(rates.energy).toBeCloseTo(5);
    expect(rates.metal).toBeCloseTo(1.2);
  });

  it('soustrait la maintenance de la flotte de l’énergie', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 20; // 10 énergie/s
    s.ships.fighters.count = 3; // maintenance 1 -> -3 énergie/s
    expect(ratesPerSecond(s).energy).toBeCloseTo(7);
  });
});

describe('computeOfflineGains', () => {
  it('multiplie le taux net par les secondes écoulées', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10; // 5 énergie/s
    const { gains, cappedSeconds } = computeOfflineGains(s, 60_000);
    expect(cappedSeconds).toBe(60);
    expect(gains.energy).toBeCloseTo(300);
  });

  it('plafonne le temps hors-ligne', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 1;
    const { seconds, cappedSeconds } = computeOfflineGains(s, 48 * 3600 * 1000);
    expect(seconds).toBe(48 * 3600);
    expect(cappedSeconds).toBe(DEFAULT_OFFLINE_CAP_MS / 1000);
  });

  it('ignore les taux négatifs (déficit de maintenance)', () => {
    const s = createInitialState();
    s.ships.fighters.count = 5; // -5 énergie/s, aucune production
    const { gains } = computeOfflineGains(s, 60_000);
    expect(gains.energy).toBeUndefined();
  });
});

describe('applyOfflineGains', () => {
  it('ajoute les gains aux ressources et au cumul produit', () => {
    const s = createInitialState();
    applyOfflineGains(s, { energy: 100, metal: 20 });
    expect(s.resources.energy).toBe(100);
    expect(s.resources.metal).toBe(20);
    expect(s.totalProduced.energy).toBe(100);
  });
});
