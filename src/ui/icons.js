// Jeu de pictogrammes unique — lignée signalétique transport (AIGA/DOT) :
// silhouettes pleines, un seul poids, grille 24×24. Remplace intégralement les
// emojis. On garde le set volontairement court et on le réemploie par sens
// (un générateur emprunte le pictogramme de la ressource qu'il produit).

const V = '0 0 24 24';

/** id -> markup interne SVG (chemins pleins, currentColor via CSS `fill`). */
const PATHS = {
  // — Ressources —
  energy: '<path d="M13 2 4 14h6l-2 8 12-13h-6z"/>',
  metal: '<path d="M4 16 7.5 9h9L20 16zM3.5 16h17v2.5h-17z"/>',
  crystals: '<path d="M12 2.5 21 10l-9 11.5L3 10z"/>',
  // atome : gros noyau + trois électrons sur une orbite en losange
  antimatter:
    '<circle cx="12" cy="12" r="3.4"/><circle cx="12" cy="3.4" r="1.9"/><circle cx="12" cy="20.6" r="1.9"/><circle cx="3.4" cy="12" r="1.9"/><circle cx="20.6" cy="12" r="1.9"/>',
  influence: '<path d="M3.5 8.5 8 12.5l4-6.5 4 6.5 4.5-4v10.5H3.5z"/>',
  // matière noire : disque plein entamé par un vide (croissant), pas un anneau
  darkMatter:
    '<path d="M12 3a9 9 0 1 0 0 18A9 9 0 0 0 12 3zm2 4.2a6.4 6.4 0 1 1 0 9.6 8 8 0 0 0 0-9.6z" fill-rule="evenodd"/>',
  // énergie quantique : cellule (carré arrondi) + noyau + coins marqués
  quantumEnergy:
    '<path d="M6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4zm0 2.2a.3.3 0 0 0-.3.3v2.3h2.3V6.2zm11 0h-2.3v2.6h2.6V6.5a.3.3 0 0 0-.3-.3zm-11 11.6h2.3v-2.6H6.2v2.3c0 .17.13.3.3.3zm11 0a.3.3 0 0 0 .3-.3v-2.3h-2.6v2.6z" fill-rule="evenodd"/><circle cx="12" cy="12" r="2.7"/>',
  ascensionPoints:
    '<path d="m12 1.5 2.2 7 7-2.3-4.6 5.8 5.4 4.5-7 .3-1.4 7.4L12 21l-3-6.2-7 .3 5.4-4.5-4.6-5.8 7 2.3z"/>',

  // — Terminaux —
  shop: '<path d="M3 4h18v3.5H3zM3 9.5h18V13H3zM3 15h11v3.5H3z"/>',
  fleet:
    '<path d="M12 2c3 3.4 4.4 7.6 4.4 11.6l2 3.2v3.4l-4.4-2.2h-4L5.6 23.2v-3.4l2-3.2C7.6 9.6 9 5.4 12 2z"/>',
  exploration: '<path d="M12 2 14 10l8 2-8 2-2 8-2-8-8-2 8-2z"/>',
  technology:
    '<path d="M8 8h8v8H8zM10.5 3.5h3V6h-3zM10.5 18h3v2.5h-3zM3.5 10.5H6v3H3.5zM18 10.5h2.5v3H18z"/><circle cx="12" cy="12" r="2.3" fill="#0c0d10"/>',
  ascension:
    '<path d="M4.5 12.5 12 5l7.5 7.5H15L12 9.5 9 12.5zM4.5 19 12 11.5 19.5 19H15L12 16l-3 3z"/>',

  // — Grands Chantiers —
  // mégastructure : anneau autour d'un noyau (sphère de Dyson, anneau-monde)
  megastructure:
    '<path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19zm0 2.3a7.2 7.2 0 1 1 0 14.4 7.2 7.2 0 0 1 0-14.4z" fill-rule="evenodd"/><circle cx="12" cy="12" r="3.6"/>',
  // décret : parchemin à coin plié, deux lignes de texte évidées
  decree:
    '<path d="M6 3h9l4 4v14H6zm2.6 8v1.8h6.8V11zm0 3.6v1.8h6.8v-1.8z" fill-rule="evenodd"/>',

  // — Chrome —
  lock: '<path d="M7 10V8a5 5 0 0 1 10 0v2h1.5v10.5h-13V10zm2.2 0h5.6V8a2.8 2.8 0 0 0-5.6 0z" fill-rule="evenodd"/>',
  trendUp: '<path d="M4 16.5 12 8l8 8.5z"/>',
  close:
    '<path d="M5.5 7 7 5.5l5 5 5-5L18.5 7l-5 5 5 5L17 18.5l-5-5-5 5L5.5 17l5-5z"/>',
  check: '<path d="M4 12.5 9.8 18.5 20.5 6.5 18 4.2 9.8 13.7 6.4 9.7z"/>',
  menu: '<path d="M3.5 6h17v2.4h-17zM3.5 10.8h17v2.4h-17zM3.5 15.6h17V18h-17z"/>',
  chevron: '<path d="M9 4 17 12 9 20 6.2 17.2 11.4 12 6.2 6.8z"/>',
  bolt: '<path d="M13 2 4 14h6l-2 8 12-13h-6z"/>',
};

/** id -> id d'un pictogramme du set (repli inclus). */
export function iconId(id) {
  return id in PATHS ? id : 'shop';
}

/**
 * @param {string} id
 * @param {string} [className]
 * @returns {SVGElement}
 */
export function icon(id, className) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', V);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  if (className) svg.setAttribute('class', className);
  svg.innerHTML = PATHS[iconId(id)];
  return svg;
}

/** Markup string (pour l'en-tête, le favicon, etc.). */
export function iconMarkup(id) {
  return `<svg viewBox="${V}" aria-hidden="true">${PATHS[iconId(id)]}</svg>`;
}

export const ICON_IDS = Object.keys(PATHS);
