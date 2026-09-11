// Cycle de vie de la run : sélection de faction, objectif, achat de
// compétences de faction. Fonctions pures sur l'état (même convention que
// `economy.js` — aucun effet de bord hors mutation de `state`).

import { FACTION_BY_ID } from '../data/factions.js';
import { OBJECTIVES } from '../data/objectives.js';
import { factionSkillCost } from './economy.js';
import { regenerateSystems } from './exploration.js';

/**
 * Démarre une run avec la faction `factionId` : réinitialise les bonus/
 * points de compétence de run, construit l'objectif (difficulté dépendant
 * du niveau actuel de la faction), régénère les systèmes disponibles.
 * @returns {boolean} succès (faux si `factionId` est invalide)
 */
export function startRun(state, factionId) {
  const def = FACTION_BY_ID[factionId];
  if (!def) return false;

  const level = state.prestige.factions[factionId]?.level ?? 0;
  const objective = OBJECTIVES.conquerAll;

  state.run.factionId = factionId;
  state.run.buffs = [];
  state.run.skillPoints = 0;
  state.run.objective = {
    type: objective.id,
    target: objective.systemCount(level),
    defenseMult: objective.defenseGrowth(level),
  };

  regenerateSystems(state);
  return true;
}

/** L'objectif de la run en cours est-il atteint ? */
export function isObjectiveComplete(state) {
  const obj = state.run.objective;
  if (!obj) return false;
  return state.run.exploration.conquered.length >= obj.target;
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
