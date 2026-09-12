// État de départ, entièrement construit à partir des données de `src/data/`.
// L'état ne stocke QUE ce qui varie (compteurs, niveaux, flags). Les
// définitions (coûts, taux, effets) vivent dans les données.

import { RESOURCE_IDS } from '../data/resources.js';
import { GENERATOR_IDS } from '../data/generators.js';
import { SHIP_IDS } from '../data/fleet.js';
import { TECH_IDS } from '../data/technologies.js';
import { CLICK_UPGRADES, PRESTIGE_UPGRADES } from '../data/upgrades.js';
import { FACTION_IDS, FACTION_BY_ID } from '../data/factions.js';
import { ASCENSION_REWARDS } from '../data/ascensionRewards.js';
import { RUN_SKILLS } from '../data/runSkills.js';
import { ACHIEVEMENT_IDS } from '../data/achievements.js';

// v1 = schéma monolithique d'avant la refonte (généré par l'ancien script.js).
// v2 = schéma piloté par les données.
// v3 = refonte rogue-like (factions, run/méta, carte à nœuds).
// v4 = fin de run vs Ascension (state.ascension, run.objectiveAnnounced) —
// purement additif, `mergeIntoShape` comble les nouveaux champs sur une
// sauvegarde v3 existante sans y toucher (pas de reset forcé).
// v5 = arbre de compétences de run (run.skillTree) — additif également.
// v6 = combat réel (run.combatLog) — additif également.
// v7 = systèmes à planètes + niveau de joueur (prestige.player,
// run.exploration.systems/activeSystemIndex remplacent targets/activeMap)
// — additif également : mergeIntoShape comble les nouveaux champs, les
// anciens (targets/activeMap) sont simplement ignorés (clés inconnues).
// v8 = écran d'accueil : commander (nom choisi à la création) + achievements
// (succès, voir data/achievements.js) — additif également. Une sauvegarde
// v7 qui passe par `mergeIntoShape` reçoit `commander.name: ''` et tous ses
// succès à `unlocked: false`, puis `Engine#_scanAchievements` les débloque
// dès le prochain tick si leur condition est déjà remplie (ex. une run déjà
// terminée avant cette mise à jour débloque `firstEndRun` immédiatement).
export const SCHEMA_VERSION = 8;

const zeroMap = (keys) => Object.fromEntries(keys.map((k) => [k, 0]));

/** @returns {object} un état neuf, sans référence partagée. */
export function createInitialState() {
  const now = Date.now();
  return {
    schemaVersion: SCHEMA_VERSION,
    savedAt: now,
    createdAt: now,
    lang: 'fr',

    // Nom choisi à la création de la partie (fiche de Commandant, voir
    // ui/commander-creation.js). Comme le reste de cet état, ne survit
    // qu'à `endRun()`/`ascend()` (run-scoped) — une remise à zéro complète
    // (`reset()`/nouvelle fiche de Commandant) en repart à vide, comme pour
    // le niveau de faction ou le compte d'Ascensions.
    commander: { name: '' },

    // Succès — jalons purement informatifs, voir data/achievements.js. Une
    // fois débloqué, un succès le reste pour toujours au sein d'une même
    // partie (voir Engine#_scanAchievements) : `endRun()`/`ascend()` ne les
    // réinitialisent jamais, même si le compteur sous-jacent (ex. systèmes
    // conquis cette run) retombe à zéro. Comme `commander` ci-dessus, une
    // remise à zéro complète (`reset()`/nouvelle fiche de Commandant) les
    // efface : ce sont des jalons de LA partie en cours, pas du navigateur.
    achievements: Object.fromEntries(
      ACHIEVEMENT_IDS.map((id) => [id, { unlocked: false }])
    ),

    resources: zeroMap(RESOURCE_IDS),
    totalProduced: zeroMap(RESOURCE_IDS), // cumul « à vie » (sert aux déblocages)
    totalClicks: 0,
    clickPowerBase: 1,
    civilizationLevel: 1,

    generators: Object.fromEntries(
      GENERATOR_IDS.map((id) => [id, { count: 0 }])
    ),
    ships: Object.fromEntries(SHIP_IDS.map((id) => [id, { count: 0 }])),
    // autoClicker s'achète en exemplaires (`count`), les autres en niveaux
    // (`level`) — voir Engine#buyClickUpgrade. La forme doit suivre : sinon
    // `mergeIntoShape` (save.js), qui ne recopie que les clés présentes dans
    // le gabarit, jette silencieusement `count` à chaque sauvegarde/rechargement.
    clickUpgrades: Object.fromEntries(
      CLICK_UPGRADES.map((u) => [
        u.id,
        u.id === 'autoClicker' ? { count: 0 } : { level: 0 },
      ])
    ),
    technologies: Object.fromEntries(
      TECH_IDS.map((id) => [id, { unlocked: false }])
    ),

    prestige: {
      ascensions: 0,
      upgrades: Object.fromEntries(
        PRESTIGE_UPGRADES.map((u) => [u.id, { level: 0 }])
      ),
      lifetime: { energy: 0 }, // énergie produite sur toutes les vies
      // Progression méta par faction : survit à ascend() (contrairement à
      // `run`, remis à zéro à chaque nouvelle run).
      factions: Object.fromEntries(
        FACTION_IDS.map((id) => [
          id,
          {
            level: 0,
            skills: Object.fromEntries(
              FACTION_BY_ID[id].skillTree.map((s) => [s.id, { level: 0 }])
            ),
          },
        ])
      ),
      // Niveau de joueur (XP) — voir game/leveling.js. Survit à endRun()
      // comme le niveau de faction ; remis à zéro par ascend() seulement.
      player: { level: 0, xp: 0 },
    },

    // État de la run en cours — vidé/reconstruit à chaque `selectFaction()`
    // et à chaque `endRun()`/`ascend()`.
    run: {
      factionId: null,
      objective: null,
      objectiveAnnounced: false, // notifié une seule fois par run (voir Engine#_afterChange)
      buffs: [], // effets temporaires accumulés cette run (nœuds bonus/conquête)
      skillPoints: 0, // points de compétence de run (nœuds "skillPoint")
      // Arbre de compétences de run (temporaire, dépensé avec skillPoints
      // ci-dessus) — remis à zéro par startRun()/endRun(), comme le reste de
      // `run` (voir data/runSkills.js).
      skillTree: Object.fromEntries(
        RUN_SKILLS.map((s) => [s.id, { level: 0 }])
      ),
      // Journal de combat de la run en cours — liste bornée (voir
      // Engine#resolvePlanetCombat), remise à zéro comme le reste de `run`.
      combatLog: [],
      exploration: {
        // Systèmes explorables générés pour cette run (voir
        // game/exploration.js#ensureVisibleSystems) — le joueur choisit
        // librement lequel ouvrir, verrouillé par palier de niveau
        // (system.requiredLevel vs prestige.player.level).
        systems: [],
        // Index (dans `systems`) du système dont le sous-menu de planètes
        // est ouvert, ou `null` (liste des systèmes affichée).
        activeSystemIndex: null,
        conquered: [],
        advancedUnlocked: false,
      },
    },

    // Vraie Ascension (rare) : ne reset JAMAIS, ni par `endRun()` ni par
    // `ascend()` — c'est justement ce qui survit au New Game+.
    ascension: {
      count: 0,
      rewards: Object.fromEntries(
        ASCENSION_REWARDS.map((r) => [r.id, { level: 0 }])
      ),
    },

    events: { lastAt: 0, accumMs: 0 },
  };
}
