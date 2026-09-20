// Négociation avec les Sentinelles : conquérir une planète qu'elles tiennent en
// payant de l'influence plutôt qu'en combattant. Elle exige la technologie
// `spaceDiplomacy` et une planète tenue par les Sentinelles (profil ennemi
// `sentinels`) ; `Engine#negotiatePlanet` en fait une action.

import { CONFIG } from '../data/config.js';
import { enemyProfileId } from './enemy-fleet.js';
import { techMultipliers } from './economy.js';

/** Phases de combat restant à mener sur la planète. */
export function phasesRemaining(planet) {
  return Math.max(0, planet.phasesTotal - (planet.phasesWon ?? 0));
}

/** Coût en influence pour conquérir d'un coup ce qui reste de la planète. */
export function negotiationCost(planet) {
  return Math.max(
    1,
    Math.ceil(
      planet.defenseRating *
        phasesRemaining(planet) *
        CONFIG.negotiation.influencePerDefense
    )
  );
}

/** Peut-on négocier (indépendamment des moyens du joueur) ? */
export function canNegotiate(state, system, planet) {
  return (
    techMultipliers(state).unlockDecrees &&
    planet.type === 'invaded' &&
    !planet.conquered &&
    enemyProfileId(system, planet) === 'sentinels'
  );
}
