import { describe, it, expect } from 'vitest';
import { createInitialState, SCHEMA_VERSION } from './initial-state.js';

describe('createInitialState', () => {
  it('produit un état taggé avec la version de schéma', () => {
    const s = createInitialState();
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(typeof s.savedAt).toBe('number');
  });

  it('ne partage aucune référence entre deux instances', () => {
    const a = createInitialState();
    const b = createInitialState();
    a.resources.energy = 999;
    a.generators.solarPanel.count = 5;
    a.fleet.fighters.cost.energy = 1;
    expect(b.resources.energy).toBe(0);
    expect(b.generators.solarPanel.count).toBe(0);
    expect(b.fleet.fighters.cost.energy).toBe(150);
  });

  it('contient toutes les ressources, générateurs, technos et vaisseaux attendus', () => {
    const s = createInitialState();
    expect(Object.keys(s.resources)).toHaveLength(8);
    expect(Object.keys(s.generators)).toHaveLength(13);
    expect(Object.keys(s.fleet)).toHaveLength(8);
    expect(Object.keys(s.technologies)).toHaveLength(13);
    expect(Object.keys(s.upgrades)).toHaveLength(6);
  });

  it('démarre avec un pouvoir de clic de 1 et aucune ressource', () => {
    const s = createInitialState();
    expect(s.clickPower).toBe(1);
    expect(Object.values(s.resources).every((v) => v === 0)).toBe(true);
  });
});
