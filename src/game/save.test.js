import { describe, it, expect } from 'vitest';
import {
  loadState,
  saveState,
  migrate,
  STORAGE_KEY,
  BACKUP_KEY,
  ARCHIVE_KEY,
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

  it('charge une sauvegarde courante valide et ignore les clés inconnues', () => {
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

  it('répare les clés manquantes d’une sauvegarde courante partielle', () => {
    const partial = {
      schemaVersion: SCHEMA_VERSION,
      resources: { energy: 50 },
    };
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(partial) });
    const { state } = loadState(storage);
    expect(state.resources.energy).toBe(50);
    expect(state.resources.metal).toBe(0);
    expect(state.generators.solarPanel).toEqual({ count: 0 });
    expect(state.prestige.ascensions).toBe(0);
  });

  it('conserve run.factionId au rechargement (un champ null par défaut ' +
    'dont la vraie valeur est une chaîne — typeof null === "object" piégeait ' +
    'la fusion de forme)', () => {
    const saved = createInitialState();
    saved.run.factionId = 'ironLegion';
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) });

    const { state, status } = loadState(storage);
    expect(status).toBe('loaded');
    expect(state.run.factionId).toBe('ironLegion');
  });

  it('comble state.ascension et run.objectiveAnnounced sur une sauvegarde v3 (v3->v4 additif)', () => {
    // v3->v4 (fin de run vs Ascension) est purement additif — contrairement
    // au saut v1/v2->v3, pas de reset forcé : mergeIntoShape doit combler
    // les nouveaux champs sans perdre la progression v3 existante.
    const v3 = createInitialState();
    v3.schemaVersion = 3;
    delete v3.ascension;
    delete v3.run.objectiveAnnounced;
    v3.resources.energy = 42;
    v3.prestige.factions.ironLegion.level = 5;
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(v3) });

    const { state, status } = loadState(storage);
    expect(status).toBe('loaded');
    expect(state.schemaVersion).toBe(SCHEMA_VERSION);
    expect(state.resources.energy).toBe(42);
    expect(state.prestige.factions.ironLegion.level).toBe(5);
    expect(state.ascension.count).toBe(0);
    expect(state.run.objectiveAnnounced).toBe(false);
  });

  it('conserve clickUpgrades.autoClicker.count au rechargement (forme ' +
    '`{ count }`, pas `{ level }` — sinon mergeIntoShape le jette)', () => {
    const saved = createInitialState();
    saved.clickUpgrades.autoClicker.count = 7;
    const storage = memoryStorage({ [STORAGE_KEY]: JSON.stringify(saved) });

    const { state, status } = loadState(storage);
    expect(status).toBe('loaded');
    expect(state.clickUpgrades.autoClicker.count).toBe(7);
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

describe('reset propre vers v3 (refonte rogue-like)', () => {
  // Sauvegarde d'avant la refonte rogue-like (v1 ou v2) : aucune conversion
  // fidèle n'est tentée, on repart d'un état neuf, mais rien n'est perdu
  // silencieusement (archivage sous ARCHIVE_KEY).
  const old = {
    schemaVersion: 2,
    resources: { energy: 5000, metal: 800, ascensionPoints: 2 },
    generators: { solarPanel: { count: 25 } },
    prestige: { ascensions: 1 },
    createdAt: 1700000000000,
  };

  it('migrate() ignore le contenu et repart d’un état neuf', () => {
    const s = migrate(structuredClone(old));
    expect(s.schemaVersion).toBe(SCHEMA_VERSION);
    expect(s.resources.energy).toBe(0);
    expect(s.generators.solarPanel.count).toBe(0);
    expect(s.prestige.ascensions).toBe(0);
    expect(s.createdAt).toBe(1700000000000);
  });

  it('loadState() archive le JSON brut sous ARCHIVE_KEY et renvoie status "reset"', () => {
    const raw = JSON.stringify(old);
    const storage = memoryStorage({ [STORAGE_KEY]: raw });
    const { state, status } = loadState(storage);
    expect(status).toBe('reset');
    expect(state.schemaVersion).toBe(SCHEMA_VERSION);
    expect(state.resources.energy).toBe(0);
    expect(storage.getItem(ARCHIVE_KEY)).toBe(raw);
  });

  it('une sauvegarde sans schemaVersion (v1 d’origine) est traitée pareil', () => {
    const storage = memoryStorage({
      [STORAGE_KEY]: JSON.stringify({ resources: { energy: 1 } }),
    });
    const { status } = loadState(storage);
    expect(status).toBe('reset');
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
