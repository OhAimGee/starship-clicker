// Deux paliers de prestige, dans l'esprit rogue-like :
//  - `endRun()` (fréquent) : gagné dès que l'objectif de la run est rempli.
//    Petite récompense permanente — le niveau de la faction active +1, ses
//    compétences (et l'arbre commun) achetables avec les PA gagnés.
//  - `ascend()` (rare) : gagné au niveau de faction seuil, indépendamment de
//    l'objectif de la run en cours. Récompense à fort impact — le joueur
//    choisit un bonus permanent parmi plusieurs propositions — puis New
//    Game+ : le niveau et les compétences de TOUTES les factions retombent
//    à 0. L'arbre commun et les PA déjà investis dedans ne bougent pas.

import { CONFIG } from '../data/config.js';
import { GENERATOR_IDS } from '../data/generators.js';
import { SHIP_IDS } from '../data/fleet.js';
import { RESOURCE_IDS } from '../data/resources.js';
import { FACTION_IDS } from '../data/factions.js';
import { ASCENSION_REWARDS } from '../data/ascensionRewards.js';
import { RUN_SKILLS } from '../data/runSkills.js';
import { isObjectiveComplete } from './run.js';

// ─── Terminer la run (fréquent) ─────────────────────────────────────────────

export function canEndRun(state) {
  return isObjectiveComplete(state);
}

export function potentialPoints(state) {
  return Math.floor(
    state.resources.quantumEnergy / CONFIG.ascension.pointsDivisor
  );
}

/**
 * Termine la run en cours : +points, +1 run terminée
 * (`state.prestige.ascensions` — le nom du champ est gardé pour limiter le
 * diff, mais il compte désormais les fins de run, l'action fréquente,
 * pas les vraies Ascensions, voir `state.ascension.count`), remise à zéro
 * partielle. Conservés : technologies recherchées, améliorations de
 * prestige, points d'ascension, progression méta de faction (son niveau
 * ainsi que ses compétences). Remis à zéro : le reste, l'exploration
 * incluse — et la run (faction active, objectif, bonus temporaires), qui
 * exige une nouvelle sélection de faction.
 * @returns {{ points: number, objectiveComplete: boolean, summary: { resources: Record<string, number>, systemsConquered: number } }}
 */
export function endRun(state) {
  const points = potentialPoints(state);
  const objectiveComplete = isObjectiveComplete(state);
  // Instantané pour la popup de résumé de fin de run (voir
  // `ui/run-summary.js`) — pris AVANT toute remise à zéro ci-dessous, sans
  // quoi `totalProduced`/`exploration.conquered` seraient déjà vidés au
  // moment où l'UI reçoit l'événement `run-ended`.
  const summary = {
    resources: { ...state.totalProduced },
    systemsConquered: state.run.exploration.conquered.length,
  };
  const factionId = state.run.factionId;
  const runSkillPoints = state.run.skillPoints;

  state.prestige.lifetime.energy += state.totalProduced.energy;
  state.prestige.ascensions += 1;

  // Ressources : tout à zéro sauf les points d'ascension (on ajoute les gains
  // de cette fin de run + le bonus de PA si l'objectif de run est atteint).
  let keptAscensionPoints = state.resources.ascensionPoints + points;
  if (objectiveComplete) {
    keptAscensionPoints += Math.floor(
      runSkillPoints * CONFIG.run.skillPointToApBonus
    );
  }
  for (const res of RESOURCE_IDS) state.resources[res] = 0;
  state.resources.ascensionPoints = keptAscensionPoints;

  // Petit capital de redémarrage, proportionnel au nombre de runs terminées.
  for (const [res, amount] of Object.entries(CONFIG.ascension.restartGrant)) {
    state.resources[res] = amount * state.prestige.ascensions;
  }

  // Cumul « à vie » remis à zéro (les déblocages se refont — progression rapide
  // grâce aux bonus permanents).
  for (const res of RESOURCE_IDS) state.totalProduced[res] = 0;

  for (const id of GENERATOR_IDS) state.generators[id].count = 0;
  for (const id of SHIP_IDS) state.ships[id].count = 0;
  state.clickPowerBase = 1;
  state.clickUpgrades.clickPower.level = 0;
  state.clickUpgrades.autoClicker.count = 0;
  state.civilizationLevel = 1;

  state.run.exploration.conquered = [];
  state.run.exploration.systems = [];
  state.run.exploration.activeSystemIndex = null;
  // Les technos sont conservées : les systèmes avancés restent débloqués si
  // warpDrive a déjà été recherché.
  state.run.exploration.advancedUnlocked =
    !!state.technologies.warpDrive?.unlocked;

  // Progression méta de la faction active (survit à endRun(), remise à zéro
  // uniquement par une vraie Ascension) : le niveau monte à chaque run
  // terminée, objectif atteint ou non — la fin de run anticipée reste
  // permise. La run se termine : il faudra resélectionner une faction (la
  // même ou une autre) pour la prochaine.
  if (factionId && state.prestige.factions[factionId]) {
    state.prestige.factions[factionId].level += 1;
  }
  state.run.factionId = null;
  state.run.objective = null;
  state.run.objectiveAnnounced = false;
  state.run.buffs = [];
  state.run.skillPoints = 0;
  state.run.skillTree = Object.fromEntries(
    RUN_SKILLS.map((s) => [s.id, { level: 0 }])
  );
  state.run.combatLog = [];

  state.events = { lastAt: 0, accumMs: 0 };

  return { points, objectiveComplete, summary };
}

// ─── Ascension (rare, New Game+) ────────────────────────────────────────────

/** La faction active a-t-elle atteint le niveau requis pour ascendre ?
 * Indépendant de l'objectif de la run en cours — disponible dès que la
 * faction est assez développée, à tout moment. */
export function canAscend(state) {
  const factionId = state.run.factionId;
  if (!factionId) return false;
  const level = state.prestige.factions[factionId]?.level ?? 0;
  return level >= CONFIG.ascension.factionLevelThreshold;
}

/** Pioche `n` récompenses distinctes, pondérées vers celles pas encore (ou
 * peu) possédées — sans jamais exclure une récompense déjà au niveau max
 * puisqu'il n'y en a pas (nivelable à l'infini, juste moins probable). */
function pickRewardOptions(state, n) {
  const remaining = ASCENSION_REWARDS.map((r) => ({
    id: r.id,
    weight: 1 / ((state.ascension.rewards[r.id]?.level ?? 0) + 1),
  }));
  const picked = [];
  for (let i = 0; i < n && remaining.length > 0; i++) {
    const total = remaining.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * total;
    let idx = remaining.length - 1;
    for (let j = 0; j < remaining.length; j++) {
      roll -= remaining[j].weight;
      if (roll <= 0) {
        idx = j;
        break;
      }
    }
    picked.push(remaining[idx].id);
    remaining.splice(idx, 1);
  }
  return picked;
}

/**
 * Vraie Ascension : termine la run comme `endRun()` (même reset run-scoped,
 * mêmes PA/capital gagnés), PUIS remet à 0 le niveau et les compétences de
 * TOUTES les factions (New Game+ — l'arbre commun et les PA déjà investis
 * dedans ne bougent pas) et incrémente `state.ascension.count`. Ne choisit
 * pas elle-même la récompense : renvoie 3 propositions (pondérées vers les
 * moins possédées) à appliquer via `applyAscensionReward`.
 * @returns {{ points: number, objectiveComplete: boolean, options: string[] }}
 */
export function ascend(state) {
  const { points, objectiveComplete } = endRun(state);

  for (const id of FACTION_IDS) {
    const entry = state.prestige.factions[id];
    entry.level = 0;
    for (const skillId of Object.keys(entry.skills)) {
      entry.skills[skillId].level = 0;
    }
  }
  // Le niveau de joueur (XP, voir game/leveling.js) repart aussi à zéro —
  // un vrai New Game+ pour l'accès aux systèmes lointains, pas seulement
  // pour les factions.
  state.prestige.player = { level: 0, xp: 0 };

  state.ascension.count += 1;
  const options = pickRewardOptions(state, 3);

  return { points, objectiveComplete, options };
}

/** Applique la récompense d'Ascension choisie par le joueur (nivelable :
 * repiochée = niveau +1). @returns {boolean} succès (faux si id inconnu) */
export function applyAscensionReward(state, id) {
  const entry = state.ascension.rewards[id];
  if (!entry) return false;
  entry.level += 1;
  return true;
}
