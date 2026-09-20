// Ennemis du combat vivant (voir game/enemy-fleet.js et game/battle.js).
//
// Une planète n'a plus « un nombre » de défense : `planet.defenseRating` est
// un BUDGET de puissance, réparti entre des classes d'unités selon le profil
// de la faction ennemie. La puissance d'attaque totale de la flotte ennemie
// vaut exactement ce budget — toute la courbe de progression (défense des
// systèmes, tutoriel) reste donc valide.
//
// La TAILLE d'une unité (0-7, même échelle que `armorTier` des vaisseaux de
// `data/fleet.js`) n'est pas fixée par sa classe : elle se déduit de sa
// puissance d'attaque individuelle, comme si c'était un vaisseau du joueur de
// même puissance (voir game/enemy-fleet.js#sizeForAttack). Un essaim de petites
// unités reste donc « petit » à tous les stades du jeu. La classe ajoute un
// rôle : `armorBonus` = crans de blindage en plus de sa taille (un bastion est
// plus dur à percer qu'un croiseur de même puissance). Un profil liste les
// classes qu'il aligne :
//  - `share`   : part du budget de puissance dépensée dans la classe ;
//  - `density` : effectif ≈ density × budget^0,25 (les effectifs restent
//                lisibles du premier au dernier système), borné par min/max.
//
// Ajouter une faction ennemie = une entrée dans ENEMY_PROFILES + clés i18n
// `enemy.profile.<id>.*` (nom, indice tactique, textes d'ouverture/fin).

export const ENEMY_CLASSES = [
  { id: 'drone', armorBonus: 0 },
  { id: 'frigate', armorBonus: 0 },
  { id: 'cruiser', armorBonus: 0 },
  { id: 'bastion', armorBonus: 2 },
  { id: 'leviathan', armorBonus: 1 },
  // Gardien du Sénat : bien plus blindé qu'un bastion de même puissance.
  { id: 'sentinel', armorBonus: 3 },
];

export const ENEMY_CLASS_BY_ID = Object.fromEntries(
  ENEMY_CLASSES.map((c) => [c.id, c])
);

export const ENEMY_PROFILES = [
  {
    // L'Essaim : nuées de drones fragiles — punit les gros vaisseaux, dont les
    // tirs sont gaspillés, et se laisse balayer par le nombre.
    id: 'swarm',
    classes: [
      { id: 'drone', share: 0.7, density: 4, min: 3, max: 80 },
      { id: 'frigate', share: 0.3, density: 1.2, min: 1, max: 20 },
    ],
  },
  {
    // Forces d'occupation : un mélange classique, avec un noyau blindé.
    id: 'garrison',
    classes: [
      { id: 'frigate', share: 0.3, density: 1.5, min: 1, max: 24 },
      { id: 'cruiser', share: 0.4, density: 0.9, min: 1, max: 14 },
      { id: 'bastion', share: 0.3, density: 0.3, min: 1, max: 6 },
    ],
  },
  {
    // Faune hostile (planètes à environnement hostile) : peu de créatures
    // massives, blindées — punit les petits vaisseaux.
    id: 'wilds',
    classes: [
      { id: 'cruiser', share: 0.35, density: 0.8, min: 1, max: 10 },
      { id: 'leviathan', share: 0.65, density: 0.2, min: 1, max: 4 },
    ],
  },
  {
    // Les Sentinelles (chapitre 2) : les gardiens que le Sénat a laissés en
    // faction. Des unités peu nombreuses et lourdement blindées, escortées de
    // croiseurs — plus dures que les forces d'occupation pour les flottes
    // de petits et moyens vaisseaux, à égalité pour les très gros. Elles ne
    // poursuivent pas et se laissent NÉGOCIER (voir game/diplomacy.js).
    id: 'sentinels',
    classes: [
      { id: 'sentinel', share: 0.5, density: 0.6, min: 2, max: 9 },
      { id: 'cruiser', share: 0.5, density: 1, min: 2, max: 12 },
    ],
  },
  {
    // La Nid-mère (planète-boss du chapitre 1) : une reine colossale au
    // milieu d'une nuée de drones. Il faut à la fois balayer la nuée et
    // percer la carapace de la reine — la flotte mixte l'emporte.
    id: 'nest',
    classes: [
      { id: 'drone', share: 0.4, density: 5, min: 6, max: 120 },
      { id: 'leviathan', share: 0.6, density: 1, min: 1, max: 1 },
    ],
  },
];

export const ENEMY_PROFILE_IDS = ENEMY_PROFILES.map((p) => p.id);
export const ENEMY_PROFILE_BY_ID = Object.fromEntries(
  ENEMY_PROFILES.map((p) => [p.id, p])
);
