// Calculs d'économie — fonctions pures sur l'état. Aucun effet de bord, aucun
// accès au DOM. C'est ici que vivent toutes les formules (coûts, production,
// multiplicateurs) : la boucle en ligne ET le calcul hors-ligne les partagent,
// donc les deux donnent exactement le même résultat.

import { CONFIG } from '../data/config.js';
import { RESOURCE_IDS } from '../data/resources.js';
import { GENERATORS, GENERATOR_BY_ID } from '../data/generators.js';
import { SHIP_BY_ID } from '../data/fleet.js';
import { TECHNOLOGIES } from '../data/technologies.js';
import {
  CLICK_UPGRADE_BY_ID,
  PRESTIGE_UPGRADES,
  PRESTIGE_UPGRADE_BY_ID,
} from '../data/upgrades.js';
import { FACTION_BY_ID } from '../data/factions.js';

const round = Math.round;

// ─── Déblocages ──────────────────────────────────────────────────────────────

export function isUnlocked(state, unlock) {
  if (!unlock) return true;
  if ('tech' in unlock) return !!state.technologies[unlock.tech]?.unlocked;
  return (state.totalProduced[unlock.resource] ?? 0) >= unlock.total;
}

// ─── Coûts ───────────────────────────────────────────────────────────────────

/** Réduction permanente du coût des générateurs, cumulée par ascension. */
export function generatorCostFactor(state) {
  return CONFIG.ascension.generatorCostReduction ** state.prestige.ascensions;
}

export function generatorCost(state, id, extraCount = 0) {
  const def = GENERATOR_BY_ID[id];
  const count = (state.generators[id]?.count ?? 0) + extraCount;
  return round(
    def.baseCost * def.costGrowth ** count * generatorCostFactor(state)
  );
}

/** Coût du prochain vaisseau : map { resource: montant }. */
export function shipCost(state, id) {
  const def = SHIP_BY_ID[id];
  const count = state.ships[id]?.count ?? 0;
  const factor =
    CONFIG.shipCostGrowth ** count *
    techMultipliers(state).shipCost *
    prestigeMultipliers(state).shipCost *
    factionMultipliers(state).shipCost *
    runMultipliers(state).shipCost;
  const out = {};
  for (const [res, base] of Object.entries(def.cost)) {
    out[res] = round(base * factor);
  }
  return out;
}

export function clickUpgradeCost(state, id) {
  const def = CLICK_UPGRADE_BY_ID[id];
  const entry = state.clickUpgrades[id];
  // autoClicker s'achète en exemplaires (`count`), clickPower en niveaux
  // (`level`) — voir Engine#buyClickUpgrade.
  const owned =
    id === 'autoClicker' ? (entry?.count ?? 0) : (entry?.level ?? 0);
  return round(def.baseCost * def.costGrowth ** owned);
}

export function prestigeUpgradeCost(state, id) {
  const def = PRESTIGE_UPGRADE_BY_ID[id];
  const level = state.prestige.upgrades[id]?.level ?? 0;
  return round(def.baseCost * def.costGrowth ** level);
}

/** Coût de la prochaine amélioration d'une compétence de faction. */
export function factionSkillCost(state, factionId, skillId) {
  const skill = FACTION_BY_ID[factionId]?.skillTree.find(
    (s) => s.id === skillId
  );
  if (!skill) return Infinity;
  const level = state.prestige.factions[factionId]?.skills[skillId]?.level ?? 0;
  return round(skill.baseCost * skill.costGrowth ** level);
}

// ─── Multiplicateurs ─────────────────────────────────────────────────────────

/** Agrège les effets des technologies recherchées. */
export function techMultipliers(state) {
  const m = {
    generatorProduction: 1,
    resourceProduction: {}, // { resourceId: mult }
    shipCost: 1,
    fleetMaintenance: 1,
    explorationIncome: 1,
    clickPower: 1,
    autoBuyGenerators: false,
    unlockAdvancedSystems: false,
  };
  for (const tech of TECHNOLOGIES) {
    if (!state.technologies[tech.id]?.unlocked) continue;
    for (const e of tech.effects) {
      switch (e.type) {
        case 'generatorProduction':
          m.generatorProduction *= e.mult;
          break;
        case 'resourceProduction':
          m.resourceProduction[e.resource] =
            (m.resourceProduction[e.resource] ?? 1) * e.mult;
          break;
        case 'shipCost':
          m.shipCost *= e.mult;
          break;
        case 'fleetMaintenance':
          m.fleetMaintenance *= e.mult;
          break;
        case 'explorationIncome':
          m.explorationIncome *= e.mult;
          break;
        case 'clickPower':
          m.clickPower *= e.mult;
          break;
        case 'autoBuyGenerators':
          m.autoBuyGenerators = true;
          break;
        case 'unlockAdvancedSystems':
          m.unlockAdvancedSystems = true;
          break;
      }
    }
  }
  return m;
}

/** @returns {object} un accumulateur neutre pour `applyLeveledEffect`. */
function neutralMultipliers() {
  return {
    production: 1,
    click: 1,
    fleet: 1,
    shipCost: 1,
    fleetMaintenance: 1,
    resourceProduction: {}, // { resourceId: mult }
  };
}

/**
 * Applique un effet « à niveaux » (commun aux améliorations de prestige, aux
 * compétences de faction et aux bonus de run) sur un accumulateur créé par
 * `neutralMultipliers()`. `shipCost`/`fleetMaintenance` sont des réductions
 * (perLevel = fraction retirée par niveau, plafonnée à 95 % de réduction) ;
 * les autres types sont des bonus multiplicatifs classiques.
 */
export function applyLeveledEffect(out, effect, level) {
  if (level <= 0) return;
  switch (effect.type) {
    case 'productionMultiplier':
      out.production *= 1 + effect.perLevel * level;
      break;
    case 'clickMultiplier':
      out.click *= 1 + effect.perLevel * level;
      break;
    case 'fleetMultiplier':
      out.fleet *= 1 + effect.perLevel * level;
      break;
    case 'shipCost':
      out.shipCost *= Math.max(0.05, 1 - effect.perLevel * level);
      break;
    case 'fleetMaintenance':
      out.fleetMaintenance *= Math.max(0.05, 1 - effect.perLevel * level);
      break;
    case 'resourceProductionMultiplier':
      for (const res of effect.resources) {
        out.resourceProduction[res] =
          (out.resourceProduction[res] ?? 1) * (1 + effect.perLevel * level);
      }
      break;
  }
}

/** Bonus permanents : ascensions + améliorations de prestige (communes). */
export function prestigeMultipliers(state) {
  const a = state.prestige.ascensions;
  const { clickPerAscension, productionPerAscension, fleetPerAscension } =
    CONFIG.ascension;

  const out = neutralMultipliers();
  out.production += a * productionPerAscension;
  out.click += a * clickPerAscension;
  out.fleet += a * fleetPerAscension;

  for (const def of PRESTIGE_UPGRADES) {
    const level = state.prestige.upgrades[def.id]?.level ?? 0;
    applyLeveledEffect(out, def.effect, level);
  }
  return out;
}

/** Bonus de la faction active pour cette run : bonus de départ + arbre de
 * compétences (acheté entre les runs, persiste dans `state.prestige.factions`). */
export function factionMultipliers(state) {
  const out = neutralMultipliers();
  const id = state.run.factionId;
  if (!id) return out;
  const def = FACTION_BY_ID[id];
  if (!def) return out;

  for (const bonus of def.startBonuses) applyLeveledEffect(out, bonus, 1);
  for (const skill of def.skillTree) {
    const level = state.prestige.factions[id]?.skills[skill.id]?.level ?? 0;
    applyLeveledEffect(out, skill.effect, level);
  }
  return out;
}

/** Bonus temporaires accumulés pendant la run en cours (nœuds « bonus » et
 * « conquête » de la carte d'exploration). Remis à zéro par `ascend()`. */
export function runMultipliers(state) {
  const out = neutralMultipliers();
  for (const effect of state.run.buffs) applyLeveledEffect(out, effect, 1);
  return out;
}

// ─── Pouvoir de clic ─────────────────────────────────────────────────────────

export function clickPower(state) {
  const tech = techMultipliers(state);
  const prestige = prestigeMultipliers(state);
  const faction = factionMultipliers(state);
  const run = runMultipliers(state);
  return Math.max(
    1,
    Math.floor(
      state.clickPowerBase *
        tech.clickPower *
        prestige.click *
        faction.click *
        run.click
    )
  );
}

// ─── Flotte ──────────────────────────────────────────────────────────────────

export function fleetPower(state) {
  let total = 0;
  for (const [id, s] of Object.entries(state.ships)) {
    total += (s.count ?? 0) * SHIP_BY_ID[id].attack;
  }
  const prestige = prestigeMultipliers(state);
  const faction = factionMultipliers(state);
  const run = runMultipliers(state);
  return Math.floor(total * prestige.fleet * faction.fleet * run.fleet);
}

export function fleetMaintenance(state) {
  let total = 0;
  for (const [id, s] of Object.entries(state.ships)) {
    total += (s.count ?? 0) * SHIP_BY_ID[id].maintenance;
  }
  const prestige = prestigeMultipliers(state);
  const faction = factionMultipliers(state);
  const run = runMultipliers(state);
  return (
    total *
    techMultipliers(state).fleetMaintenance *
    prestige.fleetMaintenance *
    faction.fleetMaintenance *
    run.fleetMaintenance
  );
}

// ─── Production ──────────────────────────────────────────────────────────────

/**
 * Production brute par ressource et par seconde (générateurs + auto-clickers +
 * revenu des systèmes conquis). N'inclut PAS la maintenance de flotte.
 */
export function grossProduction(state) {
  const tech = techMultipliers(state);
  const prestige = prestigeMultipliers(state);
  const faction = factionMultipliers(state);
  const run = runMultipliers(state);
  const out = Object.fromEntries(RESOURCE_IDS.map((r) => [r, 0]));

  const resourceMult = (res) =>
    prestige.production *
    faction.production *
    run.production *
    tech.generatorProduction *
    (tech.resourceProduction[res] ?? 1) *
    (prestige.resourceProduction[res] ?? 1) *
    (faction.resourceProduction[res] ?? 1) *
    (run.resourceProduction[res] ?? 1);

  for (const def of GENERATORS) {
    const count = state.generators[def.id]?.count ?? 0;
    if (count > 0)
      out[def.resource] += count * def.rate * resourceMult(def.resource);
  }

  const autoClickers = state.clickUpgrades.autoClicker?.count ?? 0;
  if (autoClickers > 0) out.energy += autoClickers * clickPower(state);

  const explo = tech.explorationIncome;
  for (const system of state.run.exploration.conquered) {
    for (const [res, amount] of Object.entries(system.rewards)) {
      out[res] += amount * CONFIG.conqueredIncomeFraction * explo;
    }
  }

  return out;
}

/**
 * Production nette par ressource et par seconde (brute − maintenance de flotte,
 * imputée sur l'énergie). Peut être négative pour l'énergie.
 */
export function netProduction(state) {
  const out = grossProduction(state);
  out.energy -= fleetMaintenance(state);
  return out;
}

// ─── Solde / dépense ─────────────────────────────────────────────────────────

export function canAfford(state, costMap) {
  for (const [res, amount] of Object.entries(costMap)) {
    if ((state.resources[res] ?? 0) < amount) return false;
  }
  return true;
}

export function missingResources(state, costMap) {
  const out = {};
  for (const [res, amount] of Object.entries(costMap)) {
    const deficit = amount - (state.resources[res] ?? 0);
    if (deficit > 0) out[res] = deficit;
  }
  return out;
}

/** Débite `costMap` (suppose `canAfford`). */
export function spend(state, costMap) {
  for (const [res, amount] of Object.entries(costMap)) {
    state.resources[res] -= amount;
  }
}

/** Crédite `gainMap` en tenant à jour `totalProduced`. */
export function gain(state, gainMap) {
  for (const [res, amount] of Object.entries(gainMap)) {
    if (amount === 0) continue;
    state.resources[res] = (state.resources[res] ?? 0) + amount;
    if (amount > 0) {
      state.totalProduced[res] = (state.totalProduced[res] ?? 0) + amount;
    }
  }
}
