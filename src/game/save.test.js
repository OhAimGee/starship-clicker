import { describe, it, expect } from 'vitest';
import {
  loadState,
  saveState,
  migrate,
  STORAGE_KEY,
  BACKUP_KEY,
} from './save.js';
import { createInitialState, SCHEMA_VERSION } from './initial-state.js';

function memoryStorage(seed = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
  };
}

describe('loadState', () => {
  it('retourne un état neuf quand rien n’est stocké', () => {
    const { state, status } = loadState(memoryStorage());
    expect(status).toBe('fresh');
    expect(state.resources.energy).toBe(0);
  });

  it('charge une sauvegarde v2 valide et ignore les clés inconnues', () => {
    const saved = createInitialState();
    saved.resources.energy = 1234;
    saved.generators.solarPanel.count = 3;
    saved.clefLegacyInconnue = 'à ignorer';
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) });

    const { state, status } = loadState(storage);
    expect(status).toBe('loaded');
    expect(state.resources.energy).toBe(1234);
    expect(state.generators.solarPanel.count).toBe(3);
    expect(state.clefLegacyInconnue).toBeUndefined();
    expect(state.schemaVersion).toBe(SCHEMA_VERSION);
  });

  it('répare les clés manquantes d’une sauvegarde v2 partielle', () => {
    const partial = { schemaVersion: 2, resources: { energy: 50 } };
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(partial) });
    const { state } = loadState(storage);
    expect(state.resources.energy).toBe(50);
    expect(state.resources.metal).toBe(0);
    expect(state.generators.solarPanel).toEqual({ count: 0 });
    expect(state.prestige.ascensions).toBe(0);
  });

  it('archive une sauvegarde corrompue dans .bak et repart proprement', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: '{{{ pas du JSON' });
    const { state, status } = loadState(storage);
    expect(status).toBe('recovered');
    expect(state.resources.energy).toBe(0);
    expect(storage.getItem(BACKUP_KEY)).toBe('{{{ pas du JSON');
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('migration v1 -> v2', () => {
  const v1 = {
    // pas de schemaVersion (schéma d'origine)
    resources: {
      energy: 5000,
      metal: 800,
      crystals: 300,
      antimatter: 40,
      influence: 5,
      darkMatter: 0,
      quantumEnergy: 0,
      ascensionPoints: 2,
    },
    clickPower: 8,
    totalEnergyGenerated: 120000,
    generators: {
      solarPanel: { count: 25, cost: 999, production: 1, resource: 'energy' },
      miningDrone: { count: 10, cost: 99, production: 1, resource: 'metal' },
    },
    upgrades: {
      clickUpgrade: { level: 4, cost: 1, multiplier: 1.5 },
      autoClicker: { count: 2, cost: 1, multiplier: 2 },
      prestigeMultiplier: { level: 3, cost: 1, multiplier: 2 },
    },
    fleet: { fighters: { count: 6, cost: {}, attack: 1, maintenance: 1 } },
    technologies: {
      quantumComputing: { unlocked: true },
      warpDrive: { unlocked: true },
    },
    prestige: {
      totalAscensions: 1,
      permanentBonuses: {},
      lifetimeResources: { energy: 90000 },
    },
    conqueredSystems: [
      { name: 'Véga', defenseRating: 30, rewards: { energy: 100, metal: 50 } },
    ],
  };

  it('reporte compteurs, technos, ascensions et flotte', () => {
    const s = migrate(structuredClone(v1));
    expect(s.schemaVersion).toBe(2);
    expect(s.resources.energy).toBe(5000);
    expect(s.resources.ascensionPoints).toBe(2);
    expect(s.clickPowerBase).toBe(8);
    expect(s.generators.solarPanel.count).toBe(25);
    expect(s.ships.fighters.count).toBe(6);
    expect(s.clickUpgrades.clickPower.level).toBe(4);
    expect(s.clickUpgrades.autoClicker.count).toBe(2);
    expect(s.technologies.quantumComputing.unlocked).toBe(true);
    expect(s.technologies.warpDrive.unlocked).toBe(true);
    expect(s.prestige.ascensions).toBe(1);
    expect(s.prestige.lifetime.energy).toBe(90000);
    expect(s.prestige.upgrades.prestigeProduction.level).toBe(3);
    expect(s.exploration.conquered).toHaveLength(1);
    expect(s.exploration.advancedUnlocked).toBe(true);
  });

  it('ne re-verrouille pas des paliers déjà atteints', () => {
    const s = migrate(structuredClone(v1));
    // le joueur possédait 40 antimatière -> les technos gated sur l'antimatière
    // basique doivent rester accessibles
    expect(s.totalProduced.antimatter).toBeGreaterThanOrEqual(40);
    expect(s.totalProduced.crystals).toBeGreaterThanOrEqual(300);
  });

  it('charge une vraie sauvegarde v1 depuis le storage', () => {
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v1) });
    const { state, status } = loadState(storage);
    expect(status).toBe('loaded');
    expect(state.schemaVersion).toBe(2);
    expect(state.generators.solarPanel.count).toBe(25);
  });
});

describe('saveState', () => {
  it('écrit un JSON rechargeable et met à jour savedAt', () => {
    const storage = memoryStorage();
    const s = createInitialState();
    s.savedAt = 0;
    expect(saveState(s, storage)).toBe(true);
    expect(s.savedAt).toBeGreaterThan(0);
    const { state } = loadState(storage);
    expect(state.schemaVersion).toBe(SCHEMA_VERSION);
  });
});
