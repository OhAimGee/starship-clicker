// Flottes ennemies du combat vivant : construit, pour une planète, la liste de
// piles d'unités qui la défendent (voir data/enemies.js). Tout est
// DÉTERMINISTE — mêmes planète et phase, même composition — pour que la
// fenêtre d'allocation affiche l'ennemi exact qui sera affronté.

import { CONFIG } from '../data/config.js';
import { SHIPS } from '../data/fleet.js';
import { BOSS_BY_ID } from '../data/systems.js';
import { ENEMY_CLASS_BY_ID, ENEMY_PROFILE_BY_ID } from '../data/enemies.js';
import { seededRng, hashString } from './rng.js';

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

/** PV par point d'attaque d'une unité de taille `size`. */
export function hpPerAttack(size) {
  const c = CONFIG.combat;
  return c.hpRatioBase + c.hpRatioPerTier * size;
}

// Points (log10 de l'attaque, taille) des vaisseaux du joueur, pour donner
// à une unité ennemie la taille du vaisseau de puissance équivalente.
const SIZE_CURVE = [...SHIPS]
  .sort((a, b) => a.attack - b.attack)
  .map((s) => [Math.log10(s.attack), s.armorTier]);

/** Taille (0-7, fractionnaire) d'une unité d'attaque individuelle `attack` :
 * interpolation, en échelle logarithmique, entre les vaisseaux du joueur. */
export function sizeForAttack(attack) {
  const x = Math.log10(Math.max(attack, 1e-9));
  if (x <= SIZE_CURVE[0][0]) return SIZE_CURVE[0][1];
  for (let i = 1; i < SIZE_CURVE.length; i++) {
    const [x1, y1] = SIZE_CURVE[i];
    if (x <= x1) {
      const [x0, y0] = SIZE_CURVE[i - 1];
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return SIZE_CURVE[SIZE_CURVE.length - 1][1];
}

// Part des planètes `invaded` des systèmes avancés tenues par les Sentinelles
// (les forteresses galactiques le sont toutes).
const SENTINEL_SHARE = 50;

/**
 * Profil de faction ennemie d'une planète — fonction pure de son id et de
 * son type (rien n'est stocké dans la sauvegarde). Le système 0, sur lequel
 * s'appuie le tutoriel, est toujours tenu par l'Essaim ; les Sentinelles
 * occupent les systèmes avancés (les vestiges du Sénat).
 * @param {{ index: number, advanced?: boolean, archetype?: string }} system
 * @param {{ id: string, type: string }} planet
 */
export function enemyProfileId(system, planet) {
  if (planet.boss) return BOSS_BY_ID[planet.boss].profile;
  if (planet.type === 'hostile') return 'wilds';
  if (system.index === 0) return 'swarm';
  const roll = hashString(planet.id) % 100;
  if (
    system.advanced &&
    (system.archetype === 'galacticFortress' || roll < SENTINEL_SHARE)
  ) {
    return 'sentinels';
  }
  return roll < 60 ? 'swarm' : 'garrison';
}

/**
 * Répartit le budget `defenseRating` entre les classes du profil.
 * @returns {{ id: string, count: number, attack: number, hp: number,
 *   size: number, armor: number }[]} `attack` et `hp` sont PAR unité ; la
 *   somme des `count × attack` vaut `defenseRating`.
 */
export function buildEnemyFleet(defenseRating, profileId, seed) {
  const profile = ENEMY_PROFILE_BY_ID[profileId];
  const rng = seededRng(seed);
  const root = Math.pow(Math.max(defenseRating, 1e-9), 0.25);

  const rows = profile.classes.map((c) => ({
    def: c,
    share: c.share * (0.85 + rng() * 0.3),
    count: clamp(
      Math.round(c.density * root * (0.9 + rng() * 0.2)),
      c.min,
      c.max
    ),
  }));
  const totalShare = rows.reduce((sum, r) => sum + r.share, 0);

  return rows.map(({ def, share, count }) => {
    const attack = (defenseRating * (share / totalShare)) / count;
    const size = sizeForAttack(attack);
    return {
      id: def.id,
      count,
      attack,
      hp: attack * hpPerAttack(size),
      size,
      armor: size + ENEMY_CLASS_BY_ID[def.id].armorBonus,
    };
  });
}

/** Flotte qui défend la phase en cours (`planet.phasesWon`) de la planète. */
export function enemyFleetForPlanet(system, planet) {
  const seed = (hashString(planet.id) + (planet.phasesWon ?? 0) * 7919) >>> 0;
  return buildEnemyFleet(
    planet.defenseRating,
    enemyProfileId(system, planet),
    seed
  );
}
