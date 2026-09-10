import { describe, it, expect, beforeEach } from 'vitest';
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
    _map: map,
  };
}

describe('loadState', () => {
  it('retourne un état neuf quand rien n’est stocké', () => {
    const { state, status } = loadState(memoryStorage());
    expect(status).toBe('fresh');
    expect(state.resources.energy).toBe(0);
  });

  it('charge et fusionne une sauvegarde valide dans la forme courante', () => {
    const saved = createInitialState();
    saved.resources.energy = 1234;
    saved.generators.solarPanel.count = 3;
    saved.unknownLegacyKey = 'à ignorer';
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) });

    const { state, status } = loadState(storage);
    expect(status).toBe('loaded');
    expect(state.resources.energy).toBe(1234);
    expect(state.generators.solarPanel.count).toBe(3);
    expect(state.unknownLegacyKey).toBeUndefined();
    expect(state.schemaVersion).toBe(SCHEMA_VERSION);
  });

  it('répare les clés manquantes d’une sauvegarde partielle', () => {
    const partial = { resources: { energy: 50 } };
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(partial) });
    const { state } = loadState(storage);
    expect(state.resources.energy).toBe(50);
    expect(state.resources.metal).toBe(0);
    expect(state.generators.solarPanel.cost).toBe(10);
    expect(state.prestige.permanentBonuses.productionMultiplier).toBe(1);
  });

  it('archive une sauvegarde corrompue dans .bak et repart proprement', () => {
    const storage = memoryStorage({
      [STORAGE_KEY]: '{ ceci n’est pas du JSON',
    });
    const { state, status } = loadState(storage);
    expect(status).toBe('recovered');
    expect(state.resources.energy).toBe(0);
    expect(storage.getItem(BACKUP_KEY)).toBe('{ ceci n’est pas du JSON');
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });
});

describe('migrate', () => {
  it('tague une sauvegarde legacy (sans version) à la version courante', () => {
    const legacy = { resources: { energy: 1 } };
    expect(migrate(legacy).schemaVersion).toBe(SCHEMA_VERSION);
  });
});

describe('saveState', () => {
  let storage;
  beforeEach(() => {
    storage = memoryStorage();
  });

  it('écrit un JSON rechargeable et met à jour savedAt', () => {
    const s = createInitialState();
    s.savedAt = 0;
    expect(saveState(s, storage)).toBe(true);
    expect(s.savedAt).toBeGreaterThan(0);

    const { state } = loadState(storage);
    expect(state.schemaVersion).toBe(SCHEMA_VERSION);
  });
});
