// Types de nœuds de la carte d'exploration (mini-jeu à nœuds, voir
// `src/game/nodemap.js`).
//
// - `invade`   : planète à envahir — gagné automatiquement si la puissance
//   de flotte suffit (comme l'ancienne exploration), rapporte un butin.
// - `bonus`    : jamais bloqué, rapporte un petit butin garanti.
// - `skillPoint` : jamais bloqué, +1 point de compétence de run.
// - `conquest` : nœud final de la carte (1 seul, dernière rangée) — gagné
//   comme `invade` mais contre la pleine défense du système ; le système
//   rejoint les systèmes conquis (revenu passif) et accorde un bonus
//   temporaire pour le reste de la run.
export const NODE_TYPES = {
  invade: {},
  bonus: {},
  skillPoint: {},
  conquest: {},
};

export const NODE_TYPE_IDS = Object.keys(NODE_TYPES);
