// Moteur de jeu. Détient l'état, avance la simulation, applique les actions du
// joueur, et émet des événements que la couche UI écoute. Le moteur ne touche
// jamais au DOM et ne connaît pas l'i18n : il émet des messages structurés
// ({ type, key, params }) que l'UI traduit.

import { CONFIG } from '../data/config.js';
import { GENERATORS, GENERATOR_BY_ID } from '../data/generators.js';
import { SHIPS, SHIP_BY_ID } from '../data/fleet.js';
import { TECHNOLOGIES, TECH_BY_ID } from '../data/technologies.js';
import {
  CLICK_UPGRADES,
  CLICK_UPGRADE_BY_ID,
  PRESTIGE_UPGRADES,
  PRESTIGE_UPGRADE_BY_ID,
} from '../data/upgrades.js';
import { FACTION_BY_ID } from '../data/factions.js';
import { createInitialState } from './initial-state.js';
import {
  isUnlocked,
  generatorCost,
  shipCost,
  clickUpgradeCost,
  prestigeUpgradeCost,
  factionSkillCost,
  techMultipliers,
  clickPower,
  fleetPower,
  fleetMaintenance,
  grossProduction,
  netProduction,
  canAfford,
  missingResources,
  spend,
  gain,
} from './economy.js';
import { generateRunTargets, startNextMap } from './exploration.js';
import { resolveNode } from './nodemap.js';
import { canAscend, potentialPoints, ascend } from './prestige.js';
import { startRun, buyFactionSkill as buyFactionSkillRun } from './run.js';
import { tickEvents } from './events.js';
import { computeOfflineGains } from './offline.js';

export class Engine {
  constructor(state) {
    this.state = state ?? createInitialState();
    this._listeners = new Map();
    this._leftoverMs = 0;
    this._seen = this._currentUnlockSet();
  }

  // ─── Émetteur ──────────────────────────────────────────────────────────────
  on(type, fn) {
    if (!this._listeners.has(type)) this._listeners.set(type, new Set());
    this._listeners.get(type).add(fn);
    return () => this._listeners.get(type)?.delete(fn);
  }
  _emit(type, payload) {
    this._listeners.get(type)?.forEach((fn) => fn(payload));
  }
  _notify(key, params = {}, level = 'info') {
    this._emit('notify', { key, params, level });
  }

  // ─── Lecture (pour l'UI) ───────────────────────────────────────────────────
  get clickPower() {
    return clickPower(this.state);
  }
  get fleetPower() {
    return fleetPower(this.state);
  }
  get fleetMaintenance() {
    return fleetMaintenance(this.state);
  }
  netRates() {
    return netProduction(this.state);
  }
  generatorCost(id) {
    return generatorCost(this.state, id);
  }
  shipCost(id) {
    return shipCost(this.state, id);
  }
  clickUpgradeCost(id) {
    return clickUpgradeCost(this.state, id);
  }
  prestigeUpgradeCost(id) {
    return prestigeUpgradeCost(this.state, id);
  }
  factionSkillCost(skillId) {
    return factionSkillCost(this.state, this.state.run.factionId, skillId);
  }
  isUnlocked(unlock) {
    return isUnlocked(this.state, unlock);
  }
  canAscend() {
    return canAscend(this.state);
  }
  potentialAscensionPoints() {
    return potentialPoints(this.state);
  }

  // ─── Boucle ────────────────────────────────────────────────────────────────

  /** Avance de `realMs` de temps réel, en ticks logiques de CONFIG.tickMs. */
  advance(realMs) {
    this._leftoverMs += realMs;
    let ticks = Math.floor(this._leftoverMs / CONFIG.tickMs);
    this._leftoverMs -= ticks * CONFIG.tickMs;
    if (ticks > CONFIG.maxCatchupTicks) ticks = CONFIG.maxCatchupTicks;
    for (let i = 0; i < ticks; i++) this.tick(1);
    if (ticks > 0) this._afterChange();
  }

  /** Un tick logique de `seconds` secondes (1 par défaut). */
  tick(seconds = 1) {
    const s = this.state;

    // Production brute
    const gross = grossProduction(s);
    for (const [res, rate] of Object.entries(gross)) {
      if (rate > 0) gain(s, { [res]: rate * seconds });
    }

    // Maintenance de la flotte (payée en énergie)
    const maint = fleetMaintenance(s) * seconds;
    if (maint > 0) {
      if (s.resources.energy >= maint) {
        s.resources.energy -= maint;
      } else {
        s.resources.energy = 0;
        this._applyAttrition(seconds);
      }
    }

    // Auto-achat des générateurs (tech neuralNetworks)
    if (techMultipliers(s).autoBuyGenerators) this._autoBuyGenerators();

    // Systèmes avancés (tech warpDrive) — cas d'un chargement où le flag manque
    if (
      techMultipliers(s).unlockAdvancedSystems &&
      !s.run.exploration.advancedUnlocked
    ) {
      s.run.exploration.advancedUnlocked = true;
    }

    // Événements aléatoires
    const event = tickEvents(s, seconds * 1000);
    if (event) {
      this._emit('event', event);
      this._notify(`event.${event.id}`, { gains: event.grant }, 'success');
    }

    // Niveau de civilisation
    s.civilizationLevel = Math.max(
      1,
      Math.log10(s.totalProduced.energy + s.prestige.lifetime.energy + 10)
    );

    this._scanUnlocks();
  }

  _applyAttrition(seconds) {
    const rate = CONFIG.maintenanceAttritionRate * seconds;
    let lost = false;
    for (const ship of Object.values(this.state.ships)) {
      if (ship.count > 0) {
        const losses = Math.ceil(ship.count * rate);
        ship.count = Math.max(0, ship.count - losses);
        lost = true;
      }
    }
    if (lost) this._notify('notify.maintenanceLoss', {}, 'error');
  }

  _autoBuyGenerators() {
    for (const def of GENERATORS) {
      if (!isUnlocked(this.state, def.unlock)) continue;
      const cost = generatorCost(this.state, def.id);
      if (
        this.state.resources[def.costResource] >=
        cost * CONFIG.neuralNetBuyThreshold
      ) {
        this.state.resources[def.costResource] -= cost;
        this.state.generators[def.id].count += 1;
      }
    }
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  click() {
    const power = clickPower(this.state);
    gain(this.state, { energy: power });
    this.state.totalClicks += 1;
    this._emit('click', { power });
    this._afterChange();
    return power;
  }

  buyGenerator(id) {
    const def = GENERATOR_BY_ID[id];
    if (!def || !isUnlocked(this.state, def.unlock)) return false;
    const cost = generatorCost(this.state, id);
    if (this.state.resources[def.costResource] < cost) {
      this._notify('notify.cantAfford', {}, 'error');
      return false;
    }
    this.state.resources[def.costResource] -= cost;
    this.state.generators[id].count += 1;
    this._notify('notify.generatorBought', { id }, 'success');
    this._afterChange();
    return true;
  }

  buyShip(id) {
    const def = SHIP_BY_ID[id];
    if (!def || !isUnlocked(this.state, def.unlock)) return false;
    const cost = shipCost(this.state, id);
    if (!canAfford(this.state, cost)) {
      this._notify(
        'notify.missingResources',
        { missing: missingResources(this.state, cost) },
        'error'
      );
      return false;
    }
    spend(this.state, cost);
    this.state.ships[id].count += 1;
    this._notify('notify.shipBuilt', { id }, 'success');
    this._afterChange();
    return true;
  }

  buyClickUpgrade(id) {
    const def = CLICK_UPGRADE_BY_ID[id];
    if (!def) return false;
    const cost = clickUpgradeCost(this.state, id);
    if (this.state.resources.energy < cost) {
      this._notify('notify.cantAfford', {}, 'error');
      return false;
    }
    this.state.resources.energy -= cost;
    const entry = this.state.clickUpgrades[id];
    if (id === 'autoClicker') {
      entry.count = (entry.count ?? 0) + 1;
    } else {
      entry.level += 1;
      this.state.clickPowerBase += def.clickBonusPerLevel ?? 0;
    }
    this._notify('notify.upgradeBought', { id }, 'success');
    this._afterChange();
    return true;
  }

  research(id) {
    const def = TECH_BY_ID[id];
    if (!def) return false;
    const entry = this.state.technologies[id];
    if (entry.unlocked) return false;
    if (!isUnlocked(this.state, def.unlock)) return false;
    if (!canAfford(this.state, def.cost)) {
      this._notify(
        'notify.missingResources',
        { missing: missingResources(this.state, def.cost) },
        'error'
      );
      return false;
    }
    spend(this.state, def.cost);
    entry.unlocked = true;

    // Effets immédiats
    for (const e of def.effects) {
      if (e.type === 'unlockAdvancedSystems') {
        this.state.run.exploration.advancedUnlocked = true;
      }
    }
    this._notify('notify.techResearched', { id }, 'success');
    this._afterChange();
    return true;
  }

  buyPrestigeUpgrade(id) {
    const def = PRESTIGE_UPGRADE_BY_ID[id];
    if (!def) return false;
    const cost = prestigeUpgradeCost(this.state, id);
    if (this.state.resources.ascensionPoints < cost) {
      this._notify('notify.cantAffordPrestige', {}, 'error');
      return false;
    }
    this.state.resources.ascensionPoints -= cost;
    this.state.prestige.upgrades[id].level += 1;
    this._notify('notify.prestigeUpgraded', { id }, 'success');
    this._afterChange();
    return true;
  }

  buyFactionSkill(skillId) {
    const factionId = this.state.run.factionId;
    if (!factionId) return false;
    if (!buyFactionSkillRun(this.state, factionId, skillId)) {
      this._notify('notify.cantAffordPrestige', {}, 'error');
      return false;
    }
    this._notify('notify.factionSkillBought', { id: skillId }, 'success');
    this._afterChange();
    return true;
  }

  /** Démarre une run avec la faction `factionId` (uniquement si aucune run
   * n'est déjà en cours — voir `ascend()`/`reset()`). Amorce la file de
   * systèmes-objectif et sa première carte à nœuds. */
  selectFaction(factionId) {
    if (this.state.run.factionId) return false;
    if (!FACTION_BY_ID[factionId]) return false;
    if (!startRun(this.state, factionId)) return false;
    generateRunTargets(this.state);
    startNextMap(this.state);
    this._seen = this._currentUnlockSet();
    this._emit('run-started', { factionId });
    this._afterChange();
    return true;
  }

  /** Choisit le nœud `nodeId` sur la carte active (voir `run.exploration.
   * activeMap`, parmi les nœuds accessibles). */
  chooseNode(nodeId) {
    const map = this.state.run.exploration.activeMap;
    if (!map) return false;

    const result = resolveNode(this.state, map, nodeId);
    if (!result.ok) {
      if (result.required !== undefined) {
        this._notify(
          'notify.fleetTooWeak',
          { required: result.required },
          'error'
        );
      }
      return false;
    }

    if (result.type === 'conquest') {
      this._notify(
        'notify.systemConquered',
        { name: result.system.name },
        'success'
      );
      const nextMap = startNextMap(this.state);
      if (!nextMap) {
        this._notify('notify.objectiveComplete', {}, 'success');
      }
    } else if (result.type === 'skillPoint') {
      this._notify('notify.skillPointGained', {}, 'success');
    } else {
      this._notify('notify.nodeReward', { reward: result.reward }, 'success');
    }

    this._seen = this._currentUnlockSet();
    this._emit('node-resolved', result);
    this._afterChange();
    return true;
  }

  ascend() {
    if (!canAscend(this.state)) {
      this._notify('notify.cannotAscend', {}, 'error');
      return false;
    }
    const { points } = ascend(this.state);
    this._seen = this._currentUnlockSet();
    this._notify('notify.ascended', { points }, 'success');
    this._emit('ascend', { points });
    this._afterChange();
    return true;
  }

  reset() {
    this.state = createInitialState();
    this._seen = this._currentUnlockSet();
    this._leftoverMs = 0;
    this._emit('reset', {});
    this._afterChange();
  }

  // ─── Hors-ligne ────────────────────────────────────────────────────────────
  applyOfflineProgress(elapsedMs) {
    const { cappedSeconds, gains } = computeOfflineGains(this.state, elapsedMs);
    if (cappedSeconds <= 0 || Object.keys(gains).length === 0) return null;
    for (const [res, amount] of Object.entries(gains))
      gain(this.state, { [res]: amount });
    this._afterChange();
    return { cappedSeconds, gains };
  }

  // ─── Interne ───────────────────────────────────────────────────────────────
  _afterChange() {
    this._emit('changed', this.state);
  }

  _currentUnlockSet() {
    const set = new Set();
    for (const g of GENERATORS)
      if (isUnlocked(this.state, g.unlock)) set.add(`gen:${g.id}`);
    for (const s of SHIPS)
      if (isUnlocked(this.state, s.unlock)) set.add(`ship:${s.id}`);
    for (const t of TECHNOLOGIES)
      if (isUnlocked(this.state, t.unlock)) set.add(`tech:${t.id}`);
    return set;
  }

  _scanUnlocks() {
    const now = this._currentUnlockSet();
    for (const key of now) {
      if (!this._seen.has(key)) {
        const [kind, id] = key.split(':');
        this._emit('unlock', { kind, id });
        this._notify('notify.unlocked', { kind, id }, 'info');
      }
    }
    this._seen = now;
  }
}

export { CLICK_UPGRADES, PRESTIGE_UPGRADES };
