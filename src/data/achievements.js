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
];

export const ACHIEVEMENT_IDS = ACHIEVEMENTS.map((a) => a.id);
