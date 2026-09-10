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
    CONFIG.shipCostGrowth ** count * techMultipliers(state).shipCost;
  const out = {};
  for (const [res, base] of Object.entries(def.cost)) {
    out[res] = round(base * factor);
  }
  return out;
}

export function clickUpgradeCost(state, id) {
  const def = CLICK_UPGRADE_BY_ID[id];
  const level = state.clickUpgrades[id]?.level ?? 0;
  return round(def.baseCost * def.costGrowth ** level);
}

export function prestigeUpgradeCost(state, id) {
  const def = PRESTIGE_UPGRADE_BY_ID[id];
  const level = state.prestige.upgrades[id]?.level ?? 0;
  return round(def.baseCost * def.costGrowth ** level);
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

/** Bonus permanents : ascensions + améliorations de prestige. */
export function prestigeMultipliers(state) {
  const a = state.prestige.ascensions;
  const { clickPerAscension, productionPerAscension, fleetPerAscension } =
    CONFIG.ascension;

  const out = {
    production: 1 + a * productionPerAscension,
    click: 1 + a * clickPerAscension,
    fleet: 1 + a * fleetPerAscension,
    resourceProduction: {}, // { resourceId: mult }
  };

  for (const def of PRESTIGE_UPGRADES) {
    const level = state.prestige.upgrades[def.id]?.level ?? 0;
    if (level === 0) continue;
    const eff = def.effect;
    if (eff.type === 'productionMultiplier') {
      out.production *= 1 + eff.perLevel * level;
    } else if (eff.type === 'clickMultiplier') {
      out.click *= 1 + eff.perLevel * level;
    } else if (eff.type === 'fleetMultiplier') {
      out.fleet *= 1 + eff.perLevel * level;
    } else if (eff.type === 'resourceProductionMultiplier') {
      for (const res of eff.resources) {
        out.resourceProduction[res] =
          (out.resourceProduction[res] ?? 1) * (1 + eff.perLevel * level);
      }
    }
  }
  return out;
}

// ─── Pouvoir de clic ─────────────────────────────────────────────────────────

export function clickPower(state) {
  const tech = techMultipliers(state);
  const prestige = prestigeMultipliers(state);
  return Math.max(
    1,
    Math.floor(state.clickPowerBase * tech.clickPower * prestige.click)
  );
}

// ─── Flotte ──────────────────────────────────────────────────────────────────

export function fleetPower(state) {
  let total = 0;
  for (const [id, s] of Object.entries(state.ships)) {
    total += (s.count ?? 0) * SHIP_BY_ID[id].attack;
  }
  return Math.floor(total * prestigeMultipliers(state).fleet);
}

export function fleetMaintenance(state) {
  let total = 0;
  for (const [id, s] of Object.entries(state.ships)) {
    total += (s.count ?? 0) * SHIP_BY_ID[id].maintenance;
  }
  return total * techMultipliers(state).fleetMaintenance;
}

// ─── Production ──────────────────────────────────────────────────────────────

/**
 * Production brute par ressource et par seconde (générateurs + auto-clickers +
 * revenu des systèmes conquis). N'inclut PAS la maintenance de flotte.
 */
export function grossProduction(state) {
  const tech = techMultipliers(state);
  const prestige = prestigeMultipliers(state);
  const out = Object.fromEntries(RESOURCE_IDS.map((r) => [r, 0]));

  const resourceMult = (res) =>
    prestige.production *
    tech.generatorProduction *
    (tech.resourceProduction[res] ?? 1) *
    (prestige.resourceProduction[res] ?? 1);

  for (const def of GENERATORS) {
    const count = state.generators[def.id]?.count ?? 0;
    if (count > 0)
      out[def.resource] += count * def.rate * resourceMult(def.resource);
  }

  const autoClickers = state.clickUpgrades.autoClicker?.count ?? 0;
  if (autoClickers > 0) out.energy += autoClickers * clickPower(state);

  const explo = tech.explorationIncome;
  for (const system of state.exploration.conquered) {
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
