// Fil rouge narratif — le Journal de bord (voir docs/ROADMAP.md).
//
// Un chapitre ≈ une mise à jour ; ses entrées sont révélées par des jalons de
// gameplay. Comme les succès (data/achievements.js), chaque entrée est un
// PRÉDICAT PUR sur l'état : `Engine#_scanStory` la révèle dès qu'il est vrai,
// pour toujours (`state.story.entries[id]`). Un joueur avancé qui charge une
// ancienne sauvegarde obtient donc d'un coup les entrées déjà « méritées ».
//
// Textes : i18n `story.chapter.<id>.title` et `story.entry.<id>.title/text`.
// Ajouter une entrée = un objet ici + ses clés FR/EN (le test de balance
// vérifie leur présence).

/** Chapitres, dans l'ordre du récit. */
export const CHAPTERS = ['prologue', 'tide', 'sentinels'];

// Le chapitre 1 s'ouvre à la première run terminée.
const tideBegun = (s) => s.prestige.ascensions >= 1;
// Le chapitre 2 s'ouvre quand le joueur, déjà aguerri (5 systèmes conquis, toutes
// runs confondues), a de quoi parler : la technologie Diplomatie spatiale.
const sentinelsHeard = (s) =>
  s.combatStats.systemsConquered >= 5 &&
  s.technologies.spaceDiplomacy?.unlocked === true;

export const STORY_ENTRIES = [
  // — Prologue « Réveil » —
  { id: 'awakening', chapter: 'prologue', check: () => true },
  {
    id: 'firstFleet',
    chapter: 'prologue',
    check: (s) => Object.values(s.ships).some((sh) => sh.count >= 1),
  },
  {
    id: 'firstContact',
    chapter: 'prologue',
    // `combatLog` couvre les sauvegardes d'avant les compteurs de combat.
    check: (s) => s.combatStats.battles >= 1 || s.run.combatLog.length > 0,
  },
  {
    id: 'firstFlag',
    chapter: 'prologue',
    check: (s) => s.achievements.firstSystemConquered?.unlocked === true,
  },

  // — Chapitre 1 « La Marée » —
  { id: 'tideRises', chapter: 'tide', check: tideBegun },
  {
    id: 'swarmNature',
    chapter: 'tide',
    check: (s) =>
      tideBegun(s) &&
      s.story.bestiary.swarm &&
      s.combatStats.enemiesDestroyed >= 40,
  },
  {
    id: 'motherNestSighted',
    chapter: 'tide',
    check: (s) =>
      tideBegun(s) &&
      s.run.exploration.systems.some(
        (sys) => sys.opened && sys.planets.some((p) => p.boss === 'motherNest')
      ),
  },
  {
    id: 'nestFallen',
    chapter: 'tide',
    check: (s) => s.story.defeated.motherNest === true,
  },

  // — Chapitre 2 « Les Sentinelles » —
  { id: 'sentinelsSignal', chapter: 'sentinels', check: sentinelsHeard },
  {
    id: 'sentinelsWardens',
    chapter: 'sentinels',
    check: (s) => sentinelsHeard(s) && s.story.bestiary.sentinels,
  },
  {
    id: 'bastionSighted',
    chapter: 'sentinels',
    check: (s) =>
      sentinelsHeard(s) &&
      s.run.exploration.systems.some(
        (sys) =>
          sys.opened && sys.planets.some((p) => p.boss === 'sentinelBastion')
      ),
  },
  // Les deux issues du Bastion : la décision du Cycle (`story.choices`) les
  // révèle. Une entrée révélée le reste, même si l'on prend l'autre voie au
  // Cycle suivant.
  {
    id: 'bastionAllied',
    chapter: 'sentinels',
    check: (s) => s.story.choices.sentinels === 'ally',
  },
  {
    id: 'bastionRazed',
    chapter: 'sentinels',
    check: (s) => s.story.choices.sentinels === 'destroy',
  },
];

// Choix d'histoire attachés à une planète-boss (voir `Engine#_defeatBoss`) :
// conquérir le boss par la force ou par la négociation enregistre l'option
// correspondante dans `state.story.choices[key]` (remis à zéro à
// l'Ascension) et accorde son bonus de run (vocabulaire de `economy.js#
// applyLeveledEffect`, empilé dans `run.buffs`). Aucun contenu ne dépend du
// choix pour rester jouable — les deux voies sont récompensées.
export const STORY_CHOICES = {
  sentinelBastion: {
    key: 'sentinels',
    force: 'destroy',
    negotiation: 'ally',
    options: {
      ally: { buff: { type: 'fleetDurability', perLevel: 0.25 } },
      destroy: { buff: { type: 'lootMultiplier', perLevel: 0.25 } },
    },
  },
};

export const STORY_ENTRY_IDS = STORY_ENTRIES.map((e) => e.id);
