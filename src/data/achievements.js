// Succès — jalons de progression purement informatifs (aucune récompense,
// voir DÉCISIONS du plan « écran d'accueil ») : une liste à cocher, pas un
// système de bonus de plus à équilibrer.
//
// Prédicats purs, sans texte (les libellés vivent en i18n,
// `achievement.<id>.name/desc`, comme pour les technologies/générateurs).
// Une fois vrai, `Engine#_scanAchievements` verrouille le succès « débloqué »
// pour toujours dans `state.achievements[id].unlocked` — même si la
// condition redevient fausse plus tard (ex. un compteur remis à zéro par
// `endRun()`), le joueur ne perd jamais un succès obtenu.
//
// Départ volontairement modeste, entièrement dérivé de state déjà existant
// (aucun nouveau compteur à inventer) : à étendre plus tard, c'est juste un
// tableau de données.

import { MEGASTRUCTURES } from './megastructures.js';

export const ACHIEVEMENTS = [
  { id: 'firstClick', check: (s) => s.totalClicks >= 1 },
  { id: 'hundredClicks', check: (s) => s.totalClicks >= 100 },
  {
    id: 'firstGenerator',
    check: (s) => Object.values(s.generators).some((g) => g.count >= 1),
  },
  {
    id: 'firstShip',
    check: (s) => Object.values(s.ships).some((sh) => sh.count >= 1),
  },
  {
    id: 'firstTech',
    check: (s) => Object.values(s.technologies).some((t) => t.unlocked),
  },
  {
    id: 'firstSystemConquered',
    check: (s) => s.run.exploration.conquered.length >= 1,
  },
  { id: 'firstEndRun', check: (s) => s.prestige.ascensions >= 1 },
  { id: 'firstAscension', check: (s) => s.ascension.count >= 1 },
  {
    id: 'fleetOf1000',
    check: (s) =>
      Object.values(s.ships).reduce((sum, sh) => sum + sh.count, 0) >= 1000,
  },
  {
    id: 'allGeneratorTypes',
    check: (s) => Object.values(s.generators).every((g) => g.count >= 1),
  },
  { id: 'playerLevel10', check: (s) => s.prestige.player.level >= 10 },
  // Combat vivant : compteurs à vie de `state.combatStats` et
  // `state.story.defeated` (voir Engine#resolvePlanetCombat).
  { id: 'firstBlood', check: (s) => s.combatStats.victories >= 1 },
  { id: 'flawlessVictory', check: (s) => s.combatStats.flawless >= 1 },
  { id: 'swarmCrusher', check: (s) => s.combatStats.enemiesDestroyed >= 100 },
  { id: 'nestSlayer', check: (s) => s.story.defeated.motherNest === true },
  // Grands Chantiers : `run.megastructures` / `run.decrees` sont propres à la
  // run, mais le verrou du succès, lui, est définitif.
  {
    id: 'firstMegastructure',
    check: (s) =>
      Object.values(s.run.megastructures).some((m) => m.level >= 1),
  },
  {
    id: 'wonderBuilder',
    check: (s) =>
      MEGASTRUCTURES.every(
        (m) => (s.run.megastructures[m.id]?.level ?? 0) >= m.maxLevel
      ),
  },
  { id: 'firstDecree', check: (s) => s.run.decrees.length >= 1 },
  { id: 'diplomat', check: (s) => s.combatStats.negotiations >= 1 },
  { id: 'bastionGates', check: (s) => s.story.defeated.sentinelBastion === true },
];

export const ACHIEVEMENT_IDS = ACHIEVEMENTS.map((a) => a.id);
