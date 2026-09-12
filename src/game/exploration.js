// Exploration : liste des systèmes explorables de la run, choisis librement
// par le joueur (pas une file imposée) et verrouillés par palier de niveau
// (voir `game/leveling.js#grantXp` / `data/systems.js#requiredLevelForIndex`).
// Chaque système est composé de plusieurs planètes (voir `systems-map.js`).

import {
  SYSTEM_NAMES,
  ADVANCED_SYSTEM_NAMES,
  SYSTEM_ARCHETYPES,
  ADVANCED_ARCHETYPES,
  EXPLORATION,
  requiredLevelForIndex,
} from '../data/systems.js';
import { generatePlanets } from './systems-map.js';

// Nombre de systèmes toujours visibles au-delà du niveau actuel du joueur —
// donne un aperçu de ce qui reste à débloquer, pas seulement l'accessible.
const LOOKAHEAD = 6;

/**
 * Construit le système d'index `index` — base ou avancé selon
 * `state.run.exploration.advancedUnlocked` **au moment de cet appel** (pas
 * figé au lancement de la run) : rechercher `warpDrive` en cours de run
 * donne donc accès aux systèmes avancés dès le prochain système généré
 * (ceux déjà générés gardent leur composition).
 */
function buildSystemDef(state, index) {
  const advancedOn = state.run.exploration.advancedUnlocked;
  const advanced = advancedOn && index % 2 === 1;
  const name = advanced
    ? ADVANCED_SYSTEM_NAMES[index % ADVANCED_SYSTEM_NAMES.length]
    : SYSTEM_NAMES[index % SYSTEM_NAMES.length];
  const archetype = advanced
    ? ADVANCED_ARCHETYPES[index % ADVANCED_ARCHETYPES.length]
    : SYSTEM_ARCHETYPES[index % SYSTEM_ARCHETYPES.length];
  const baseReward = advanced
    ? EXPLORATION.advancedBaseReward
    : EXPLORATION.baseReward;
  const baseDefense = advanced
    ? EXPLORATION.advancedBaseDefense
    : EXPLORATION.baseDefense;

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

  const defenseRating = Math.floor(
    baseDefense(index) * (archetype.defenseMult ?? 1)
  );
  const { planets, topResource } = generatePlanets(
    { defenseRating, rewards },
    index
  );

  return {
    index,
    name,
    archetype: archetype.id,
    advanced,
    requiredLevel: requiredLevelForIndex(index),
    defenseRating,
    rewards,
    topResource,
    planets,
    opened: false,
    conquered: false,
  };
}

/** S'assure que `state.run.exploration.systems` couvre au moins jusqu'à
 * l'index `uptoIndex` (génère les systèmes manquants à la volée — même
 * principe de génération paresseuse que l'ancienne file de cibles). */
export function ensureSystemsUpTo(state, uptoIndex) {
  const systems = state.run.exploration.systems;
  while (systems.length <= uptoIndex) {
    systems.push(buildSystemDef(state, systems.length));
  }
}

/** Garde toujours au moins `LOOKAHEAD` systèmes visibles au-delà du niveau
 * actuel du joueur (aperçu de ce qui reste à débloquer). À appeler avant
 * d'afficher/choisir dans la liste. */
export function ensureVisibleSystems(state, playerLevel) {
  ensureSystemsUpTo(state, playerLevel * 2 + LOOKAHEAD);
}

/** Initialise l'exploration au lancement d'une run. */
export function initExploration(state) {
  state.run.exploration.systems = [];
  state.run.exploration.activeSystemIndex = null;
  ensureVisibleSystems(state, state.prestige.player.level);
}
