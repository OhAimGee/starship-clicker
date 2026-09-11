import { describe, it, expect } from 'vitest';
import { createInitialState, SCHEMA_VERSION } from './initial-state.js';
import { GENERATOR_IDS } from '../data/generators.js';
import { SHIP_IDS } from '../data/fleet.js';
import { TECH_IDS } from '../data/technologies.js';
import { RESOURCE_IDS } from '../data/resources.js';
import { FACTION_IDS, FACTION_BY_ID } from '../data/factions.js';

describe('createInitialState', () => {
  it('produit un état taggé v3 avec horodatages', () => {
    const s = createInitialState();
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(s.schemaVersion).toBe(3);
    expect(typeof s.savedAt).toBe('number');
    expect(typeof s.createdAt).toBe('number');
  });

  it('ne stocke que des compteurs (les définitions restent dans les données)', () => {
    const s = createInitialState();
    expect(s.generators.solarPanel).toEqual({ count: 0 });
    expect(s.ships.fighters).toEqual({ count: 0 });
    expect(s.technologies.advancedPropulsion).toEqual({ unlocked: false });
  });

  it('couvre toutes les entités des données', () => {
    const s = createInitialState();
    expect(Object.keys(s.resources).sort()).toEqual([...RESOURCE_IDS].sort());
    expect(Object.keys(s.generators).sort()).toEqual([...GENERATOR_IDS].sort());
    expect(Object.keys(s.ships).sort()).toEqual([...SHIP_IDS].sort());
    expect(Object.keys(s.technologies).sort()).toEqual([...TECH_IDS].sort());
  });

  it('prépare un compartiment méta par faction et un état de run vide', () => {
    const s = createInitialState();
    expect(Object.keys(s.prestige.factions).sort()).toEqual(
      [...FACTION_IDS].sort()
    );
    for (const id of FACTION_IDS) {
      expect(s.prestige.factions[id].level).toBe(0);
      expect(Object.keys(s.prestige.factions[id].skills).sort()).toEqual(
        FACTION_BY_ID[id].skillTree.map((sk) => sk.id).sort()
      );
    }
    expect(s.run.factionId).toBeNull();
    expect(s.run.buffs).toEqual([]);
    expect(s.run.skillPoints).toBe(0);
    expect(s.run.exploration.available).toEqual([]);
  });

  it('ne partage aucune référence entre deux instances', () => {
    const a = createInitialState();
    const b = createInitialState();
    a.resources.energy = 999;
    a.generators.solarPanel.count = 5;
    a.prestige.upgrades.prestigeProduction.level = 3;
    expect(b.resources.energy).toBe(0);
    expect(b.generators.solarPanel.count).toBe(0);
    expect(b.prestige.upgrades.prestigeProduction.level).toBe(0);
  });
});
