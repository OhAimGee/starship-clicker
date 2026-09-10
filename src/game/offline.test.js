import { describe, it, expect } from 'vitest';
import {
  ratesPerSecond,
  computeOfflineGains,
  applyOfflineGains,
  DEFAULT_OFFLINE_CAP_MS,
} from './offline.js';
import { createInitialState } from './initial-state.js';

describe('ratesPerSecond', () => {
  it('est vide sur un état neuf', () => {
    expect(Object.keys(ratesPerSecond(createInitialState()))).toHaveLength(0);
  });

  it('somme la production des générateurs possédés', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10; // 10 * 1 énergie/s
    s.generators.miningDrone.count = 4; // 4 * 1 métal/s
    const rates = ratesPerSecond(s);
    expect(rates.energy).toBe(10);
    expect(rates.metal).toBe(4);
  });

  it('applique les multiplicateurs de techno et de prestige', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10;
    s.technologies.quantumComputing.unlocked = true; // x1.5
    s.prestige.permanentBonuses.productionMultiplier = 2; // x2
    expect(ratesPerSecond(s).energy).toBe(30);
  });

  it('soustrait la maintenance de la flotte de l’énergie', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10;
    s.fleet.fighters.count = 3; // maintenance 1 -> -3 énergie/s
    expect(ratesPerSecond(s).energy).toBe(7);
  });
});

describe('computeOfflineGains', () => {
  it('multiplie le taux par les secondes écoulées', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 5;
    const { gains, cappedSeconds } = computeOfflineGains(s, 60_000);
    expect(cappedSeconds).toBe(60);
    expect(gains.energy).toBe(300);
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
    s.fleet.fighters.count = 5; // -5 énergie/s, aucune production
    const { gains } = computeOfflineGains(s, 60_000);
    expect(gains.energy).toBeUndefined();
  });
});

describe('applyOfflineGains', () => {
  it('ajoute les gains aux ressources et au total d’énergie', () => {
    const s = createInitialState();
    applyOfflineGains(s, { energy: 100, metal: 20 });
    expect(s.resources.energy).toBe(100);
    expect(s.resources.metal).toBe(20);
    expect(s.totalEnergyGenerated).toBe(100);
  });
});
