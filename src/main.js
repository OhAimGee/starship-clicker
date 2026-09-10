// Point d'entrée de l'application (bootstrap Vite).
//
// Phase 0 : on se contente de recharger le jeu historique tel quel via Vite,
// pour valider le socle de build sans changer le comportement. Les phases
// suivantes remplacent progressivement `./legacy/*` par les modules `src/game`
// et `src/ui`.
import './legacy/style_new.css';
import './legacy/quantum-expansion.css';
import './legacy/game.js';
import './legacy/visual-enhancements.js';
