// Cycle de vie de la run : sélection de faction, objectif, achat de
// compétences de faction. Fonctions pures sur l'état (même convention que
// `economy.js` — aucun effet de bord hors mutation de `state`).

import { FACTION_BY_ID } from '../data/factions.js';
import { OBJECTIVES } from '../data/objectives.js';
import { RUN_SKILLS, RUN_SKILL_BY_ID } from '../data/runSkills.js';
import { factionSkillCost, fleetPower } from './economy.js';

const round = Math.round;

/**
 * Choisit le type d'objectif selon le niveau de faction — une rampe
 * pédagogique plutôt qu'un tirage aléatoire : niveau 0 ne demande ni
 * vaisseau ni exploration (amasser une ressource), niveau 1 introduit la
 * flotte (atteindre une puissance donnée), niveau 2 introduit la carte à
 * nœuds avec un objectif minimal (conquérir 1 seul système), niveau 3+
 * bascule sur l'objectif complet (conquérir plusieurs systèmes).
 */
export function pickObjective(level) {
  if (level === 0) return OBJECTIVES.gatherResources;
  if (level === 1) return OBJECTIVES.reachFleetPower;
  if (level === 2) return OBJECTIVES.conquerOne;
  return OBJECTIVES.conquerAll;
}

/**
 * Démarre une run avec la faction `factionId` : réinitialise les bonus/
 * points de compétence de run, construit l'objectif (type + difficulté
 * dépendant du niveau actuel de la faction, voir `pickObjective`). Ne
 * construit PAS la file de systèmes ni la première carte à nœuds : c'est
 * `Engine#selectFaction` qui enchaîne `exploration.generateRunTargets` +
 * `exploration.startNextMap` juste après.
 * @returns {boolean} succès (faux si `factionId` est invalide)
 */
export function startRun(state, factionId) {
  const def = FACTION_BY_ID[factionId];
  if (!def) return false;

  const level = state.prestige.factions[factionId]?.level ?? 0;
  const objective = pickObjective(level);

  state.run.factionId = factionId;
  state.run.objectiveAnnounced = false;
  state.run.buffs = [];
  state.run.skillPoints = 0;
  state.run.skillTree = Object.fromEntries(
    RUN_SKILLS.map((s) => [s.id, { level: 0 }])
  );
  state.run.combatLog = [];
  state.run.objective = {
    type: objective.id,
    target: objective.target(level),
    resource: objective.resource ?? null,
    defenseMult: objective.defenseGrowth ? objective.defenseGrowth(level) : 1,
  };

  return true;
}

/** L'objectif de la run en cours est-il atteint ? */
export function isObjectiveComplete(state) {
  const obj = state.run.objective;
  if (!obj) return false;
  switch (obj.type) {
    case 'conquerAll':
    case 'conquerOne':
      return state.run.exploration.conquered.length >= obj.target;
    case 'reachFleetPower':
      return fleetPower(state) >= obj.target;
    case 'gatherResources':
      return (state.totalProduced[obj.resource] ?? 0) >= obj.target;
    default:
      return false;
  }
}

/**
 * Achète (ou monte d'un niveau) une compétence de la faction `factionId`.
 * @returns {boolean} succès (faux si compétence inconnue ou PA insuffisants)
 */
export function buyFactionSkill(state, factionId, skillId) {
  const def = FACTION_BY_ID[factionId];
  const skill = def?.skillTree.find((s) => s.id === skillId);
  if (!skill) return false;

  const cost = factionSkillCost(state, factionId, skillId);
  if (state.resources.ascensionPoints < cost) return false;

  state.resources.ascensionPoints -= cost;
  state.prestige.factions[factionId].skills[skillId].level += 1;
  return true;
}

/** Coût du prochain niveau d'une compétence de l'arbre de run (payé en
 * `run.skillPoints`, pas en points d'ascension). */
export function runSkillCost(state, skillId) {
  const skill = RUN_SKILL_BY_ID[skillId];
  if (!skill) return Infinity;
  const level = state.run.skillTree[skillId]?.level ?? 0;
  return round(skill.baseCost * skill.costGrowth ** level);
}

/**
 * Achète (ou monte d'un niveau) une compétence de l'arbre de run — effet
 * temporaire, ne dure que la run en cours (voir `startRun`/`endRun`).
 * @returns {boolean} succès (faux si compétence inconnue ou points insuffisants)
 */
export function buyRunSkill(state, skillId) {
  if (!RUN_SKILL_BY_ID[skillId]) return false;
  const cost = runSkillCost(state, skillId);
  if (state.run.skillPoints < cost) return false;

  state.run.skillPoints -= cost;
  state.run.skillTree[skillId].level += 1;
  return true;
}
