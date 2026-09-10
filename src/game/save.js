// Chargement / sauvegarde robustes.
//
// Améliorations vs l'ancien `saveGame`/`loadGame` :
//  - schéma versionné + `migrate()` par paliers ;
//  - sauvegarde corrompue archivée dans `starshipClickerSave.bak` au lieu
//    d'être jetée silencieusement ;
//  - fusion pilotée par la forme de l'état neuf (les clés inconnues sont
//    ignorées, les clés manquantes réparées) au lieu d'un `deepMerge` aveugle ;
//  - écriture regroupée (throttle) au lieu d'un write localStorage à chaque clic.

import { createInitialState, SCHEMA_VERSION } from './initial-state.js';

export const STORAGE_KEY = 'starshipClickerSave';
export const BACKUP_KEY = 'starshipClickerSave.bak';

/** Fusionne `saved` dans la forme de `template` (récursif, sans réf partagée). */
function mergeIntoShape(template, saved) {
  if (Array.isArray(template)) {
    return Array.isArray(saved) ? saved : template;
  }
  if (template && typeof template === 'object') {
    const out = {};
    for (const key of Object.keys(template)) {
      const t = template[key];
      const s = saved ? saved[key] : undefined;
      const sameKind =
        s !== undefined &&
        s !== null &&
        typeof s === typeof t &&
        Array.isArray(s) === Array.isArray(t);
      out[key] =
        t && typeof t === 'object'
          ? mergeIntoShape(t, sameKind ? s : undefined)
          : sameKind
            ? s
            : t;
    }
    return out;
  }
  return saved === undefined ? template : saved;
}

/** Migrations successives. `save` est muté puis retourné. */
export function migrate(save) {
  let version = Number(save.schemaVersion) || 0;

  // v0 -> v1 : le schéma d'origine (pré-refonte) n'avait ni version ni
  // horodatage. Rien à transformer, on tague simplement.
  if (version < 1) {
    version = 1;
  }

  save.schemaVersion = SCHEMA_VERSION;
  return save;
}

/**
 * @returns {{ state: object, status: 'fresh' | 'loaded' | 'recovered' }}
 */
export function loadState(storage = safeStorage()) {
  const fresh = createInitialState();
  if (!storage) return { state: fresh, status: 'fresh' };

  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return { state: fresh, status: 'fresh' };

  let parsed;
  try {
    parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('not an object');
  } catch {
    // Sauvegarde illisible : on l'archive et on repart proprement.
    try {
      storage.setItem(BACKUP_KEY, raw);
      storage.removeItem(STORAGE_KEY);
    } catch {
      /* stockage indisponible */
    }
    return { state: fresh, status: 'recovered' };
  }

  const migrated = migrate(parsed);
  const state = mergeIntoShape(fresh, migrated);
  state.schemaVersion = SCHEMA_VERSION;
  return { state, status: 'loaded' };
}

/** @returns {boolean} succès de l'écriture. */
export function saveState(state, storage = safeStorage()) {
  if (!storage) return false;
  state.schemaVersion = SCHEMA_VERSION;
  state.savedAt = Date.now();
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearSave(storage = safeStorage()) {
  try {
    storage?.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Sauvegarde regroupée : `request()` note qu'une écriture est due, `flush()`
 * écrit immédiatement si due. À appeler périodiquement + sur
 * `visibilitychange` / `beforeunload`.
 */
export function createThrottledSaver(getState, { minIntervalMs = 10000 } = {}) {
  let dirty = false;
  let lastWrite = 0;

  function flush(force = false) {
    if (!dirty && !force) return;
    const now = Date.now();
    if (!force && now - lastWrite < minIntervalMs) return;
    if (saveState(getState())) {
      dirty = false;
      lastWrite = now;
    }
  }

  return {
    request() {
      dirty = true;
    },
    flush,
    flushNow() {
      dirty = true;
      flush(true);
    },
  };
}

function safeStorage() {
  try {
    return typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    return null;
  }
}
