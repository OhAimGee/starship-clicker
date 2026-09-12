import { describe, it, expect } from 'vitest';
import { generatePlanets, planetLoot, planetBuff, systemBuff } from './systems-map.js';
import { requiredLevelForIndex } from '../data/systems.js';

const SYSTEM = { defenseRating: 100, rewards: { metal: 500, energy: 200 } };

describe('generatePlanets', () => {
  it('est déterministe : même index -> même composition', () => {
    const a = generatePlanets(SYSTEM, 5);
    const b = generatePlanets(SYSTEM, 5);
    expect(a).toEqual(b);
  });

  it('des index différents donnent (généralement) des compositions différentes', () => {
    const a = generatePlanets(SYSTEM, 0);
    const b = generatePlanets(SYSTEM, 1);
    expect(a).not.toEqual(b);
  });

  it('entre 2 et 6 planètes, plafonné', () => {
    for (const index of [0, 3, 6, 12, 30]) {
      const { planets } = generatePlanets(SYSTEM, index);
      expect(planets.length).toBeGreaterThanOrEqual(2);
      expect(planets.length).toBeLessThanOrEqual(6);
    }
  });

  it('un système tardif a au moins autant de planètes qu’un système proche', () => {
    const near = generatePlanets(SYSTEM, 0).planets.length;
    const far = generatePlanets(SYSTEM, 20).planets.length;
    expect(far).toBeGreaterThanOrEqual(near);
  });

  it('chaque planète invaded/hostile a 1 à 5 phases et une défense positive', () => {
    for (let index = 0; index < 15; index++) {
      const { planets } = generatePlanets(SYSTEM, index);
      for (const p of planets) {
        if (p.type === 'invaded' || p.type === 'hostile') {
          expect(p.phasesTotal).toBeGreaterThanOrEqual(1);
          expect(p.phasesTotal).toBeLessThanOrEqual(5);
          expect(p.phasesWon).toBe(0);
          expect(p.defenseRating).toBeGreaterThan(0);
          expect(p.conquered).toBe(false);
        } else {
          expect(['uninhabited', 'gas']).toContain(p.type);
          expect(p.conquered).toBe(false);
        }
      }
    }
  });

  it('renvoie la ressource dominante des récompenses du système', () => {
    const { topResource } = generatePlanets(SYSTEM, 0);
    expect(topResource).toBe('metal');
  });
});

describe('requiredLevelForIndex', () => {
  it('croît avec l’index, jamais négatif', () => {
    expect(requiredLevelForIndex(0)).toBe(0);
    expect(requiredLevelForIndex(1)).toBe(0);
    expect(requiredLevelForIndex(2)).toBe(1);
    expect(requiredLevelForIndex(20)).toBeGreaterThan(requiredLevelForIndex(2));
  });
});

describe('planetLoot / planetBuff / systemBuff', () => {
  it('planetLoot dérive du système, au moins 1 par ressource', () => {
    const loot = planetLoot(SYSTEM);
    expect(loot.metal).toBeGreaterThanOrEqual(1);
    expect(loot.energy).toBeGreaterThanOrEqual(1);
  });

  it('planetBuff/systemBuff réutilisent le vocabulaire d’effet existant', () => {
    const buff = planetBuff('metal', 'hostile');
    expect(buff).toEqual({
      type: 'resourceProductionMultiplier',
      resources: ['metal'],
      perLevel: expect.any(Number),
    });
    expect(systemBuff('metal').perLevel).toBeGreaterThan(buff.perLevel);
  });

  it('renvoie null sans ressource dominante', () => {
    expect(planetBuff(null, 'hostile')).toBeNull();
    expect(systemBuff(null)).toBeNull();
  });
});
