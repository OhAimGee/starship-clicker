// Exploration : génère les systèmes-objectif de la run et leur carte à
// nœuds (voir `nodemap.js`).

import {
  SYSTEM_NAMES,
  ADVANCED_SYSTEM_NAMES,
  SYSTEM_ARCHETYPES,
  ADVANCED_ARCHETYPES,
  EXPLORATION,
} from '../data/systems.js';
import { generateSystemMap } from './nodemap.js';

function buildSystem(
  index,
  name,
  archetype,
  baseReward,
  baseDefense,
  advanced
) {
  const rewards = {};
  const base = baseReward(index);
  for (const [res, amount] of Object.entries(base)) {
    rewards[res] = Math.floor(amount * (archetype.bonus[res] ?? 1));
  }
  // Ressources apportées uniquement par l'archétype (ex. darkMatter).
  for (const [res, mult] of Object.entries(archetype.bonus)) {
    if (rewards[res] === undefined) {
      rewards[res] = Math.max(1, Math.floor((index + 1) * mult));
    }
  }
  return {
    name,
    archetype: archetype.id,
    advanced,
    defenseRating: Math.floor(
      baseDefense(index) * (archetype.defenseMult ?? 1)
    ),
    rewards,
  };
}

/**
 * Construit la file des systèmes-objectif de la run en cours (un par
 * système à conquérir, `state.run.objective.target` au total), alternant
 * systèmes de base et avancés une fois `advancedUnlocked`. Stockée dans
 * `state.run.exploration.targets` ; consommée par `startNextMap`.
 */
export function generateRunTargets(state) {
  const n = state.run.objective?.target ?? 0;
  const advancedOn = state.run.exploration.advancedUnlocked;
  const targets = [];
  for (let i = 0; i < n; i++) {
    const advanced = advancedOn && i % 2 === 1;
    targets.push(
      advanced
        ? buildSystem(
            i,
            ADVANCED_SYSTEM_NAMES[i % ADVANCED_SYSTEM_NAMES.length],
            ADVANCED_ARCHETYPES[i % ADVANCED_ARCHETYPES.length],
            EXPLORATION.advancedBaseReward,
            EXPLORATION.advancedBaseDefense,
            true
          )
        : buildSystem(
            i,
            SYSTEM_NAMES[i % SYSTEM_NAMES.length],
            SYSTEM_ARCHETYPES[i % SYSTEM_ARCHETYPES.length],
            EXPLORATION.baseReward,
            EXPLORATION.baseDefense,
            false
          )
    );
  }
  state.run.exploration.targets = targets;
}

/**
 * Dépile le prochain système-objectif et construit sa carte à nœuds dans
 * `state.run.exploration.activeMap`.
 * @returns {object|null} la nouvelle carte, ou `null` si la file est vide
 * (tous les systèmes-objectif ont été traités).
 */
export function startNextMap(state) {
  const targets = state.run.exploration.targets;
  if (!targets || targets.length === 0) {
    state.run.exploration.activeMap = null;
    return null;
  }
  const systemDef = targets.shift();
  const queueIndex = state.run.exploration.conquered.length;
  const map = generateSystemMap(state, systemDef, queueIndex);
  state.run.exploration.activeMap = map;
  return map;
}
