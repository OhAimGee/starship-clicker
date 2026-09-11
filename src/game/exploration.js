// Exploration : génère les systèmes-objectif de la run et leur carte à
// nœuds (voir `nodemap.js`).

import {
  SYSTEM_NAMES,
  ADVANCED_SYSTEM_NAMES,
  SYSTEM_ARCHETYPES,
  ADVANCED_ARCHETYPES,
  EXPLORATION,
} from '../data/systems.js';
import { CONFIG } from '../data/config.js';
import { generateSystemMap } from './nodemap.js';

const CONQUEST_OBJECTIVE_TYPES = new Set(['conquerAll', 'conquerOne']);

/**
 * Construit le système-objectif d'index `index` — base ou avancé selon
 * `state.run.exploration.advancedUnlocked`, **relu à chaque appel** (pas
 * figé au lancement de la run) : rechercher `warpDrive` en cours de run
 * donne donc accès aux systèmes avancés dès le prochain système généré.
 */
function generateNextTarget(state, index) {
  const advancedOn = state.run.exploration.advancedUnlocked;
  const advanced = advancedOn && index % 2 === 1;
  return advanced
    ? buildSystem(
        index,
        ADVANCED_SYSTEM_NAMES[index % ADVANCED_SYSTEM_NAMES.length],
        ADVANCED_ARCHETYPES[index % ADVANCED_ARCHETYPES.length],
        EXPLORATION.advancedBaseReward,
        EXPLORATION.advancedBaseDefense,
        true
      )
    : buildSystem(
        index,
        SYSTEM_NAMES[index % SYSTEM_NAMES.length],
        SYSTEM_ARCHETYPES[index % SYSTEM_ARCHETYPES.length],
        EXPLORATION.baseReward,
        EXPLORATION.baseDefense,
        false
      );
}

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
 * Construit la file des systèmes-objectif de la run en cours, alternant
 * systèmes de base et avancés une fois `advancedUnlocked`. Stockée dans
 * `state.run.exploration.targets` ; consommée par `startNextMap`. Pour un
 * objectif de conquête (`conquerAll`/`conquerOne`), la file compte
 * `state.run.objective.target` systèmes (c'est un nombre de systèmes).
 * Pour les autres types d'objectif (puissance de flotte, ressources — voir
 * `data/objectives.js`), `target` n'est PAS un nombre de systèmes : on
 * génère quand même une file de taille normale, pour que l'exploration
 * reste possible (bonus, points de compétence) même si elle n'est pas
 * requise pour compléter l'objectif.
 */
export function generateRunTargets(state) {
  const obj = state.run.objective;
  const n =
    obj && CONQUEST_OBJECTIVE_TYPES.has(obj.type)
      ? obj.target
      : CONFIG.run.baseSystems;
  const targets = [];
  for (let i = 0; i < n; i++) {
    targets.push(generateNextTarget(state, i));
  }
  state.run.exploration.targets = targets;
}

/**
 * Dépile le prochain système-objectif et construit sa carte à nœuds dans
 * `state.run.exploration.activeMap`. Si la file est épuisée, un nouveau
 * système est généré à la volée au lieu de s'arrêter — SAUF pour un
 * objectif de conquête (`conquerAll`/`conquerOne`) déjà atteint, où le
 * nombre de systèmes EST l'objectif et doit rester fini (voir DÉCISIONS du
 * plan « exploration infinie »). Les objectifs `gatherResources`/
 * `reachFleetPower` ne dépendent pas d'un compte de systèmes : l'explo-
 * ration y reste une source de récompenses/points de compétence à volonté.
 * @returns {object|null} la nouvelle carte, ou `null` si un objectif de
 * conquête déjà rempli n'a plus besoin de systèmes supplémentaires.
 */
export function startNextMap(state) {
  const targets = state.run.exploration.targets;
  const obj = state.run.objective;
  const conquestSatisfied =
    !!obj &&
    CONQUEST_OBJECTIVE_TYPES.has(obj.type) &&
    state.run.exploration.conquered.length >= obj.target;

  let systemDef;
  if (targets && targets.length > 0) {
    systemDef = targets.shift();
  } else if (conquestSatisfied) {
    state.run.exploration.activeMap = null;
    return null;
  } else {
    systemDef = generateNextTarget(
      state,
      state.run.exploration.conquered.length
    );
  }

  const queueIndex = state.run.exploration.conquered.length;
  const map = generateSystemMap(state, systemDef, queueIndex);
  state.run.exploration.activeMap = map;
  return map;
}
