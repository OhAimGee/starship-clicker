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
import { ACHIEVEMENTS } from '../data/achievements.js';
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
import { initExploration, ensureVisibleSystems } from './exploration.js';
import { resolveBattle } from './combat.js';
import { planetLoot, planetBuff, systemBuff } from './systems-map.js';
import { grantXp } from './leveling.js';
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

/** Flotte entière possédée, sous la forme attendue par `resolveBattle` —
 * l'allocation par défaut quand l'appelant n'en fournit pas (comportement
 * historique : engager toute la flotte). */
function fullFleetAllocation(state) {
  const out = {};
  for (const [id, s] of Object.entries(state.ships)) {
    if (s.count > 0) out[id] = s.count;
  }
  return out;
}

function applyLosses(state, losses) {
  for (const [id, n] of Object.entries(losses)) {
    const ship = state.ships[id];
    if (ship) ship.count = Math.max(0, ship.count - n);
  }
}

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
    this._scanAchievements();
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

  /** Octroi direct de ressources — réservé au tutoriel (mise à niveau
   * discrète des ressources juste avant une étape guidée, pour ne pas
   * imposer de grind ; jamais utilisé par le jeu normal). */
  grantResources(map) {
    gain(this.state, map);
    this._afterChange();
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
   * n'est déjà en cours — voir `ascend()`/`reset()`). Amorce la liste de
   * systèmes explorables. */
  selectFaction(factionId) {
    if (this.state.run.factionId) return false;
    if (!FACTION_BY_ID[factionId]) return false;
    if (!startRun(this.state, factionId)) return false;
    initExploration(this.state);
    this._seen = this._currentUnlockSet();
    this._emit('run-started', { factionId });
    this._afterChange();
    return true;
  }

  /** Possède-t-on au moins un vaisseau ? Condition d'accès à l'exploration —
   * un joueur sans flotte ne devrait pouvoir ni ouvrir un système, ni
   * engager le moindre combat de planète. */
  hasFleet() {
    return Object.values(this.state.ships).some((s) => s.count > 0);
  }

  /** Liste des systèmes explorables de la run (génère la fenêtre visible à
   * la volée en fonction du niveau du joueur — voir `exploration.js`). */
  explorationSystems() {
    ensureVisibleSystems(this.state, this.state.prestige.player.level);
    return this.state.run.exploration.systems;
  }

  /** Système dont le sous-menu de planètes est actuellement ouvert, ou
   * `null` (liste des systèmes affichée). */
  activeSystem() {
    const idx = this.state.run.exploration.activeSystemIndex;
    if (idx === null || idx === undefined) return null;
    return this.state.run.exploration.systems[idx] ?? null;
  }

  /** Ouvre le sous-menu de planètes du système `index` (vérifie le palier
   * de niveau requis). Première ouverture : résout immédiatement les
   * planètes `uninhabited`/`gas` (aucun combat requis pour elles — voir
   * DÉCISIONS du plan « systèmes à planètes »). */
  openSystem(index) {
    if (!this.hasFleet()) return false;
    const system = this.explorationSystems()[index];
    if (!system) return false;
    if (system.requiredLevel > this.state.prestige.player.level) {
      this._notify(
        'notify.systemLocked',
        { level: system.requiredLevel },
        'error'
      );
      return false;
    }

    this.state.run.exploration.activeSystemIndex = index;
    if (!system.opened) {
      system.opened = true;
      for (const planet of system.planets) {
        if (planet.type === 'uninhabited' || planet.type === 'gas') {
          planet.conquered = true;
          if (planet.type === 'uninhabited') {
            const buff = planetBuff(system.topResource, 'uninhabited');
            if (buff) this.state.run.buffs.push(buff);
          }
        }
      }
      this._checkSystemComplete(system);
    }
    this._afterChange();
    return true;
  }

  /** Referme le sous-menu de planètes (retour à la liste des systèmes). */
  closeSystemMenu() {
    this.state.run.exploration.activeSystemIndex = null;
    this._afterChange();
  }

  /** Résout une phase de combat sur la planète `planetId` (`invaded`/
   * `hostile`) du système actif. `allocation` (optionnelle, `{ shipId:
   * nombre engagé }`) — à défaut, toute la flotte possédée est engagée
   * (voir `src/ui/fleet-allocation.js`). Chaque victoire donne de l'XP et
   * un point de compétence de run ; toutes les phases gagnées conquièrent
   * la planète et versent sa récompense. */
  resolvePlanetCombat(planetId, allocation) {
    const system = this.activeSystem();
    if (!system) return false;
    const planet = system.planets.find((p) => p.id === planetId);
    if (!planet || planet.conquered) return false;
    if (planet.type !== 'invaded' && planet.type !== 'hostile') return false;
    // Une planète hostile sans `xenoColonization` ne rapporte rien et la
    // conquête est définitive (voir plus bas) : refuser le combat plutôt
    // que de laisser gâcher la planète pour aucune récompense (le bouton
    // « Engager » est déjà masqué dans ce cas, voir system-detail.js —
    // ce garde-fou couvre tout autre appelant).
    if (
      planet.type === 'hostile' &&
      !techMultipliers(this.state).unlockHostileColonization
    ) {
      return false;
    }

    const engaged = allocation ?? fullFleetAllocation(this.state);
    const battle = resolveBattle(this.state, engaged, planet.defenseRating);
    applyLosses(this.state, battle.losses);

    const entry = {
      planetId,
      systemName: system.name,
      planetType: planet.type,
      victory: battle.victory,
      committedPower: battle.committedPower,
      defenseRating: planet.defenseRating,
      losses: battle.losses,
      rewards: null,
    };

    if (battle.victory) {
      planet.phasesWon += 1;
      this._grantXp(CONFIG.player.xpPerCombatWin);
      this.state.run.skillPoints += 1;
      if (planet.phasesWon >= planet.phasesTotal) {
        planet.conquered = true;
        this._grantXp(CONFIG.player.xpPerPlanet);
        if (planet.type === 'invaded') {
          const loot = planetLoot(system);
          gain(this.state, loot);
          entry.rewards = loot;
        } else if (
          techMultipliers(this.state).unlockHostileColonization
        ) {
          const buff = planetBuff(system.topResource, 'hostile');
          if (buff) this.state.run.buffs.push(buff);
        }
        this._checkSystemComplete(system);
      }
    }

    this.state.run.combatLog = [entry, ...this.state.run.combatLog].slice(
      0,
      20
    );
    this._emit('battle-resolved', entry);

    if (!battle.victory) {
      this._notify(
        'notify.battleLost',
        { required: planet.defenseRating },
        'error'
      );
      this._afterChange();
      return false;
    }
    this._notify(
      planet.conquered ? 'notify.planetConquered' : 'notify.battleWon',
      {},
      'success'
    );
    this._seen = this._currentUnlockSet();
    this._afterChange();
    return true;
  }

  /** Ajoute de l'XP de joueur, notifie un passage de niveau. */
  _grantXp(amount) {
    const { leveledUp, newLevel } = grantXp(this.state, amount);
    if (leveledUp) this._notify('notify.levelUp', { level: newLevel }, 'success');
  }

  /** Système entièrement Conquis (toutes ses planètes) : récompense
   * système (buff + XP), alimente `run.exploration.conquered` (compté par
   * les objectifs `conquerOne`/`conquerAll`, voir `run.js#
   * isObjectiveComplete`, et par le revenu passif, voir `economy.js#
   * grossProduction`). */
  _checkSystemComplete(system) {
    if (system.conquered) return;
    if (!system.planets.every((p) => p.conquered)) return;
    system.conquered = true;
    this.state.run.exploration.conquered.push(system);
    this._grantXp(CONFIG.player.xpPerSystem);
    const buff = systemBuff(system.topResource);
    if (buff) this.state.run.buffs.push(buff);
    this._notify('notify.systemConquered', { name: system.name }, 'success');
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

  /** Succès (voir data/achievements.js) — contrairement à `_scanUnlocks()`,
   * pas besoin d'un Set-diff en mémoire : `state.achievements[id].unlocked`
   * porte déjà le verrou de façon persistante (survit à la sauvegarde), il
   * suffit de ne (re)vérifier que les succès pas encore débloqués. */
  _scanAchievements() {
    for (const def of ACHIEVEMENTS) {
      const entry = this.state.achievements[def.id];
      if (entry.unlocked) continue;
      if (def.check(this.state)) {
        entry.unlocked = true;
        this._notify('notify.achievementUnlocked', { id: def.id }, 'success');
        this._emit('achievement', { id: def.id });
      }
    }
  }
}

export { CLICK_UPGRADES, PRESTIGE_UPGRADES };
