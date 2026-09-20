// Préférences d'affichage des combats — calquées sur ui/theme.js : propres à
// l'appareil (localStorage), indépendantes de l'état de jeu, donc modifiables
// depuis le menu principal comme depuis une partie.
//
//  - lecture `animated` : le journal de bataille se déroule ligne à ligne ;
//  - lecture `summary`  : seul le résumé s'affiche, le journal reste consultable ;
//  - vitesse de lecture : ×1 / ×2 / ×4 (bouton de la fenêtre de bataille).

export const PLAYBACK_MODES = ['animated', 'summary'];
export const PLAYBACK_SPEEDS = [1, 2, 4];
const DEFAULT_MODE = 'animated';
const MODE_KEY = 'starshipClickerCombatPlayback';
const SPEED_KEY = 'starshipClickerCombatSpeed';

export function getPlayback() {
  try {
    const mode = localStorage.getItem(MODE_KEY);
    return PLAYBACK_MODES.includes(mode) ? mode : DEFAULT_MODE;
  } catch {
    return DEFAULT_MODE;
  }
}

export function setPlayback(mode) {
  if (!PLAYBACK_MODES.includes(mode)) return;
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {
    /* stockage indisponible */
  }
}

export function getSpeed() {
  try {
    const speed = Number(localStorage.getItem(SPEED_KEY));
    return PLAYBACK_SPEEDS.includes(speed) ? speed : PLAYBACK_SPEEDS[0];
  } catch {
    return PLAYBACK_SPEEDS[0];
  }
}

export function setSpeed(speed) {
  if (!PLAYBACK_SPEEDS.includes(speed)) return;
  try {
    localStorage.setItem(SPEED_KEY, String(speed));
  } catch {
    /* stockage indisponible */
  }
}
