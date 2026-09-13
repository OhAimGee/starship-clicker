// Suivi "dernière mise à jour vue" — calqué sur tutorial-progress.js : clé
// localStorage dédiée, indépendante de la sauvegarde de partie. Stocke
// l'id de la mise à jour (pas juste un booléen) pour qu'une future mise à
// jour (nouvel id) redéclenche la popup même chez un joueur ayant déjà vu
// la précédente.

const STORAGE_KEY = 'starshipClickerLastSeenUpdate';

let lastSeen = null;

export function hasSeenUpdate(id) {
  return lastSeen === id;
}

export function markUpdateSeen(id) {
  lastSeen = id;
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* stockage indisponible */
  }
}

/** Restaure le dernier id vu depuis le localStorage. */
export function initUpdateProgress() {
  try {
    lastSeen = localStorage.getItem(STORAGE_KEY);
  } catch {
    lastSeen = null;
  }
  return lastSeen;
}
