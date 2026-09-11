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
import {
  canEndRun,
  endRun as endRunState,
  canAscend,
  ascend as ascendState,
  potentialPoints,
  applyAscensionReward,
} from './prestige.js';
import {
  startRun,
  buyFactionSkill as buyFactionSkillRun,
  runSkillCost,
  buyRunSkill as buyRunSkillRun,
  isObjectiveComplete,
} from './run.js';
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
  runSkillCost(skillId) {
    return runSkillCost(this.state, skillId);
  }
  isUnlocked(unlock) {
    return isUnlocked(this.state, unlock);
  }
  canEndRun() {
    return canEndRun(this.state);
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

  /** Achète (ou monte d'un niveau) une compétence de l'arbre de RUN — payée
   * en `run.skillPoints` (nœuds "skillPoint" de la carte), effet temporaire
   * qui ne dure que la run en cours (voir `data/runSkills.js`). */
  buyRunSkill(skillId) {
    if (!buyRunSkillRun(this.state, skillId)) {
      this._notify('notify.cantAffordRunSkill', {}, 'error');
      return false;
    }
    this._notify('notify.runSkillBought', { id: skillId }, 'success');
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

  /** Possède-t-on au moins un vaisseau ? Condition d'accès à l'exploration
   * (voir `chooseNode` — un joueur sans flotte ne devrait pas pouvoir
   * résoudre le moindre nœud, même un nœud « gratuit » type bonus). */
  hasFleet() {
    return Object.values(this.state.ships).some((s) => s.count > 0);
  }

  /** Choisit le nœud `nodeId` sur la carte active (voir `run.exploration.
   * activeMap`, parmi les nœuds accessibles). Exige de posséder au moins un
   * vaisseau — l'exploration n'est pas jouable à flotte nulle. `allocation`
   * (optionnelle, `{ shipId: nombre engagé }`) ne s'applique qu'aux nœuds
   * `invade`/`conquest` — voir `src/ui/fleet-allocation.js` ; à défaut, toute
   * la flotte possédée est engagée. */
  chooseNode(nodeId, allocation) {
    if (!this.hasFleet()) return false;
    const map = this.state.run.exploration.activeMap;
    if (!map) return false;

    const result = resolveNode(this.state, map, nodeId, allocation);

    // Nœud de combat (invade/conquest) : un journal + un événement dédié,
    // que le combat soit gagné ou perdu — les pertes s'appliquent dans les
    // deux cas (voir `resolveNode`/`combat.js`).
    if (result.battle) {
      const entry = {
        nodeId,
        systemName: map.systemDef.name,
        nodeType: result.type,
        victory: result.battle.victory,
        committedPower: result.battle.committedPower,
        defenseRating: result.required ?? map.nodes[nodeId]?.data.defenseRating,
        losses: result.battle.losses,
        rewards: result.ok ? (result.reward ?? null) : null,
      };
      this.state.run.combatLog = [entry, ...this.state.run.combatLog].slice(
        0,
        20
      );
      this._emit('battle-resolved', entry);
    }

    if (!result.ok) {
      if (result.required !== undefined) {
        this._notify(
          result.battle ? 'notify.battleLost' : 'notify.fleetTooWeak',
          { required: result.required },
          'error'
        );
      }
      // Un échec de combat mute quand même l'état (pertes de flotte) —
      // contrairement à un simple refus (nœud déjà résolu, inaccessible…).
      if (result.battle) this._afterChange();
      return false;
    }

    if (result.type === 'conquest') {
      this._notify(
        'notify.systemConquered',
        { name: result.system.name },
        'success'
      );
      // La complétion d'objectif (carte épuisée incluse) est détectée de
      // façon centralisée dans `_afterChange()`, pour tous les types
      // d'objectif — pas seulement la conquête.
      startNextMap(this.state);
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

  /** Termine la run en cours (fréquent) : gagné dès l'objectif de run rempli
   * (voir `canEndRun`). Petite récompense permanente — niveau de faction +1. */
  endRun() {
    if (!canEndRun(this.state)) {
      this._notify('notify.cannotEndRun', {}, 'error');
      return false;
    }
    const { points } = endRunState(this.state);
    this._seen = this._currentUnlockSet();
    this._notify('notify.runEnded', { points }, 'success');
    this._emit('run-ended', { points });
    this._afterChange();
    return true;
  }

  /** Vraie Ascension (rare) : gagnée au niveau de faction seuil (voir
   * `canAscend`), indépendamment de l'objectif de la run en cours. Termine
   * la run, remet à 0 le niveau et les compétences de toutes les factions
   * (New Game+), et propose un choix de récompense permanente à fort
   * impact — voir `chooseAscensionReward()`. */
  ascend() {
    if (!canAscend(this.state)) {
      this._notify('notify.cannotAscend', {}, 'error');
      return false;
    }
    const { options } = ascendState(this.state);
    this._seen = this._currentUnlockSet();
    this._notify('notify.ascended', {}, 'success');
    this._emit('ascend-choice', { options });
    this._afterChange();
    return true;
  }

  /** Applique la récompense d'Ascension choisie par le joueur parmi les
   * options proposées par le dernier `ascend()`. */
  chooseAscensionReward(id) {
    if (!applyAscensionReward(this.state, id)) return false;
    this._notify('notify.ascensionRewardChosen', { id }, 'success');
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

  /** Vérifie l'objectif de run en continu (après TOUTE action qui modifie
   * l'état — clic, achat, recherche, tick, résolution de nœud...), pas
   * seulement au moment précis d'une conquête : les objectifs
   * `reachFleetPower`/`gatherResources` n'ont pas d'événement dédié qui
   * marquerait leur complétion. Notifie une seule fois par run
   * (`run.objectiveAnnounced`, réinitialisé par `startRun()`). */
  _afterChange() {
    const s = this.state;
    if (s.run.objective && !s.run.objectiveAnnounced && isObjectiveComplete(s)) {
      s.run.objectiveAnnounced = true;
      this._notify('notify.objectiveComplete', {}, 'success');
      this._emit('objective-complete', {});
    }
    this._emit('changed', s);
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
