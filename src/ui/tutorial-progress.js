// Suivi "tutoriel vu" — calqué sur theme.js/i18n/index.js : clé
// localStorage dédiée, totalement indépendante de la sauvegarde de partie
// (voir game/save.js). Ne conditionne rien pour l'instant (pas de libellé
// "recommencer" différent) ; existe pour être disponible plus tard.

const STORAGE_KEY = 'starshipClickerTutorialSeen';

let seen = false;

export function hasTutorialBeenSeen() {
  return seen;
}

export function markTutorialSeen() {
  seen = true;
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* stockage indisponible */
  }
}

/** Restaure le drapeau depuis le localStorage. */
export function initTutorialProgress() {
  let v;
  try {
    v = localStorage.getItem(STORAGE_KEY);
  } catch {
    v = null;
  }
  seen = v === '1';
  return seen;
}
