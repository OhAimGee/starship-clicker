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
import { GENERATOR_BY_ID } from '../data/generators.js';
import { RESOURCE_IDS } from '../data/resources.js';

export const STORAGE_KEY = 'starshipClickerSave';
export const BACKUP_KEY = 'starshipClickerSave.bak';

// Correspondance des ids d'améliorations de prestige v1 -> v2 (effets proches).
const PRESTIGE_UPGRADE_MAP_V1 = {
  prestigeMultiplier: 'prestigeProduction',
  quantumCore: 'quantumAffinity',
};

/**
 * v1 = schéma monolithique d'avant la refonte. On récupère ce qui a du sens
 * (compteurs, technos, ascensions) ; les coûts et la production sont recalculés
 * depuis les données. L'économie ayant été rééquilibrée, la progression peut
 * légèrement bouger, mais la sauvegarde n'est jamais perdue.
 */
function migrateV1toV2(old) {
  const s = createInitialState();

  if (old.resources && typeof old.resources === 'object') {
    for (const res of RESOURCE_IDS) {
      if (typeof old.resources[res] === 'number') {
        s.resources[res] = old.resources[res];
        // On considère avoir « produit » au moins ce qu'on possède, pour ne pas
        // re-verrouiller des paliers déjà atteints.
        s.totalProduced[res] = old.resources[res];
      }
    }
  }

  if (typeof old.clickPower === 'number') s.clickPowerBase = old.clickPower;
  if (typeof old.totalEnergyGenerated === 'number') {
    s.totalProduced.energy = Math.max(
      s.totalProduced.energy,
      old.totalEnergyGenerated
    );
  }

  if (old.generators) {
    for (const [id, g] of Object.entries(old.generators)) {
      if (s.generators[id] && typeof g?.count === 'number') {
        s.generators[id].count = g.count;
        // Débloque la ressource produite proportionnellement au parc installé.
        const def = GENERATOR_BY_ID[id];
        if (def && g.count > 0) {
          s.totalProduced[def.resource] = Math.max(
            s.totalProduced[def.resource] ?? 0,
            g.count * def.baseCost
          );
        }
      }
    }
  }

  if (old.fleet) {
    for (const [id, f] of Object.entries(old.fleet)) {
      if (s.ships[id] && typeof f?.count === 'number')
        s.ships[id].count = f.count;
    }
  }

  if (old.upgrades) {
    if (typeof old.upgrades.clickUpgrade?.level === 'number') {
      s.clickUpgrades.clickPower.level = old.upgrades.clickUpgrade.level;
    }
    if (typeof old.upgrades.autoClicker?.count === 'number') {
      s.clickUpgrades.autoClicker.count = old.upgrades.autoClicker.count;
    }
    for (const [oldId, newId] of Object.entries(PRESTIGE_UPGRADE_MAP_V1)) {
      const level = old.upgrades[oldId]?.level;
      if (typeof level === 'number' && s.prestige.upgrades[newId]) {
        s.prestige.upgrades[newId].level = level;
      }
    }
  }

  if (old.technologies) {
    for (const [id, t] of Object.entries(old.technologies)) {
      if (s.technologies[id] && t?.unlocked) s.technologies[id].unlocked = true;
    }
  }

  if (old.prestige) {
    if (typeof old.prestige.totalAscensions === 'number') {
      s.prestige.ascensions = old.prestige.totalAscensions;
    }
    if (typeof old.prestige.lifetimeResources?.energy === 'number') {
      s.prestige.lifetime.energy = old.prestige.lifetimeResources.energy;
    }
  }

  if (Array.isArray(old.conqueredSystems)) {
    s.exploration.conquered = old.conqueredSystems
      .filter(
        (sys) => sys && sys.rewards && typeof sys.defenseRating === 'number'
      )
      .map((sys) => ({
        name: sys.name ?? 'Système',
        archetype: 'legacy',
        advanced: !!sys.isAdvanced,
        defenseRating: sys.defenseRating,
        rewards: sys.rewards,
      }));
  }
  s.exploration.advancedUnlocked = !!s.technologies.warpDrive?.unlocked;

  if (typeof old.createdAt === 'number') s.createdAt = old.createdAt;
  s.savedAt = typeof old.savedAt === 'number' ? old.savedAt : Date.now();

  return s;
}

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

/** Migrations successives vers le schéma courant. */
export function migrate(save) {
  const version = Number(save.schemaVersion) || 1; // absent => schéma d'origine

  let out = save;
  if (version < 2) {
    out = migrateV1toV2(save);
  }

  out.schemaVersion = SCHEMA_VERSION;
  return out;
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
