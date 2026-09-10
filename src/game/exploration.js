// Exploration : génération des systèmes et conquête.

import {
  SYSTEM_NAMES,
  ADVANCED_SYSTEM_NAMES,
  SYSTEM_ARCHETYPES,
  ADVANCED_ARCHETYPES,
  EXPLORATION,
} from '../data/systems.js';
import { fleetPower } from './economy.js';

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

/** (Re)génère la liste des systèmes disponibles selon l'état. */
export function regenerateSystems(state) {
  const list = [];
  for (let i = 0; i < EXPLORATION.basicCount; i++) {
    list.push(
      buildSystem(
        i,
        SYSTEM_NAMES[i] ?? `Système ${i + 1}`,
        SYSTEM_ARCHETYPES[i % SYSTEM_ARCHETYPES.length],
        EXPLORATION.baseReward,
        EXPLORATION.baseDefense,
        false
      )
    );
  }
  if (state.exploration.advancedUnlocked) {
    for (let i = 0; i < EXPLORATION.advancedCount; i++) {
      list.push(
        buildSystem(
          i,
          ADVANCED_SYSTEM_NAMES[i] ?? `Système distant ${i + 1}`,
          ADVANCED_ARCHETYPES[i % ADVANCED_ARCHETYPES.length],
          EXPLORATION.advancedBaseReward,
          EXPLORATION.advancedBaseDefense,
          true
        )
      );
    }
  }
  // Retirer ceux déjà conquis (comparaison par nom).
  const conquered = new Set(state.exploration.conquered.map((s) => s.name));
  state.exploration.available = list.filter((s) => !conquered.has(s.name));
}

/** Débloque les systèmes avancés (tech warpDrive) et régénère la liste. */
export function unlockAdvancedSystems(state) {
  if (state.exploration.advancedUnlocked) return false;
  state.exploration.advancedUnlocked = true;
  regenerateSystems(state);
  return true;
}

/**
 * Tente de conquérir `state.exploration.available[index]`.
 * @returns {{ ok: boolean, system?: object, required?: number }}
 */
export function conquer(state, index) {
  const system = state.exploration.available[index];
  if (!system) return { ok: false };

  const power = fleetPower(state);
  if (power < system.defenseRating) {
    return { ok: false, system, required: system.defenseRating };
  }

  state.exploration.available.splice(index, 1);
  state.exploration.conquered.push(system);
  return { ok: true, system };
}
