// Portraits de planète/système — illustrations SVG fabriquées à la main, une
// par archétype de src/data/systems.js (12 au total : 6 SYSTEM_ARCHETYPES +
// 6 ADVANCED_ARCHETYPES). Même convention d'accès que icons.js
// (planetArt(id, className) -> SVGElement live, planetArtMarkup(id) -> string)
// mais catégorie d'art plus riche : sphère en dégradé + lueur néon + détail de
// surface distinct par archétype, sur un fond étoilé procédural commun. Aucune
// dépendance externe, aucun raster — cohérent avec l'absence d'outil de
// génération d'image dans cet environnement (voir DESIGN.md).

const VB = '0 0 120 120';
const CX = 60;
const CY = 58;
const R = 34;

/** Petit champ d'étoiles partagé (mêmes coordonnées que --starfield en CSS,
 * réduites au viewBox 120x120, pour une cohérence visuelle avec le reste de
 * l'habillage néon). */
function starfield() {
  const stars = [
    [9, 12, 0.6],
    [31, 6, 0.9],
    [56, 9, 0.5],
    [75, 14, 0.8],
    [99, 20, 0.6],
    [15, 44, 0.7],
    [104, 40, 0.5],
    [6, 78, 0.6],
    [110, 72, 0.8],
    [20, 104, 0.5],
    [50, 110, 0.7],
    [90, 106, 0.6],
    [112, 98, 0.5],
  ];
  return stars
    .map(
      ([x, y, o]) =>
        `<circle cx="${x}" cy="${y}" r="${o}" fill="#fff" opacity="${o}"/>`
    )
    .join('');
}

/** Config par archétype : dégradé de la sphère, couleur de lueur, anneau
 * optionnel, détail de surface. Les teintes restent dans la palette néon du
 * jeu (magenta/cyan/violet, voir styles.css :root) tout en variant par thème
 * de ressource (métal -> bronze/rouille, énergie -> corona chaude, etc.). */
const ARCHETYPES = {
  // — Systèmes de base —
  mining: {
    stops: ['#3a2a1c', '#a0653a', '#e0a35c'],
    glow: '#ff9a4d',
    detail: 'craters',
  },
  energetic: {
    stops: ['#3a0f1a', '#ff6a2f', '#ffe07a'],
    glow: '#ff8a3d',
    detail: 'corona',
  },
  crystalline: {
    stops: ['#1c0f3a', '#7a2fd6', '#e07aff'],
    glow: '#d24dff',
    detail: 'facets',
  },
  balanced: {
    stops: ['#0f2a3a', '#2f7ad6', '#7ad6ff'],
    glow: '#5fb8ff',
    detail: 'bands',
  },
  hostile: {
    stops: ['#3a0f0f', '#d62f2f', '#ff7a4d'],
    glow: '#ff4757',
    detail: 'cracks',
  },
  diplomatic: {
    stops: ['#2a2410', '#d6a52f', '#ffe07a'],
    glow: '#ffcf5f',
    detail: 'ring',
  },

  // — Systèmes avancés —
  antimatterComplex: {
    stops: ['#150a2e', '#5a1fae', '#ff2fd0'],
    glow: '#ff2fd0',
    detail: 'cracks',
  },
  quantumStation: {
    stops: ['#0a1e2e', '#1f8fae', '#5fffe8'],
    glow: '#35ffb0',
    detail: 'lattice',
  },
  galacticFortress: {
    stops: ['#1c1c26', '#4a3a6a', '#8f7ac0'],
    glow: '#8f7ac0',
    detail: 'plates',
  },
  tradeHub: {
    stops: ['#1c1530', '#7a4dae', '#ffb85f'],
    glow: '#ffb85f',
    detail: 'satellites',
  },
  cosmicLab: {
    stops: ['#0a2e1e', '#1fae7a', '#d24dff'],
    glow: '#35ffb0',
    detail: 'lattice',
  },
  voidBastion: {
    stops: ['#020104', '#150a2e', '#4a2f8f'],
    glow: '#6c8cff',
    detail: 'void',
  },
};

function detailMarkup(kind, seed) {
  switch (kind) {
    case 'craters':
      return `<circle cx="${CX - 12}" cy="${CY - 6}" r="4.5" fill="#000" opacity="0.25"/>
        <circle cx="${CX + 10}" cy="${CY + 10}" r="6.5" fill="#000" opacity="0.2"/>
        <circle cx="${CX + 4}" cy="${CY - 14}" r="3" fill="#000" opacity="0.22"/>`;
    case 'corona':
      return `<circle cx="${CX}" cy="${CY}" r="${R + 8}" fill="none" stroke="${seed.glow}" stroke-width="1.5" opacity="0.35"/>
        <circle cx="${CX}" cy="${CY}" r="${R + 14}" fill="none" stroke="${seed.glow}" stroke-width="1" opacity="0.18"/>`;
    case 'facets':
      return `<path d="M${CX} ${CY - R} L${CX + R * 0.6} ${CY - R * 0.3} L${CX + R * 0.3} ${CY + R * 0.7} L${CX - R * 0.4} ${CY + R * 0.4} Z" fill="#fff" opacity="0.08"/>
        <path d="M${CX - R * 0.7} ${CY - R * 0.2} L${CX} ${CY - R} L${CX - R * 0.3} ${CY + R * 0.2} Z" fill="#fff" opacity="0.14"/>`;
    case 'bands':
      return `<ellipse cx="${CX}" cy="${CY - 8}" rx="${R}" ry="4" fill="#fff" opacity="0.07"/>
        <ellipse cx="${CX}" cy="${CY + 10}" rx="${R * 0.9}" ry="5" fill="#000" opacity="0.12"/>`;
    case 'cracks':
      return `<path d="M${CX - R} ${CY} Q${CX - 6} ${CY - 10} ${CX + 4} ${CY - 2} T${CX + R * 0.8} ${CY - 16}" fill="none" stroke="${seed.glow}" stroke-width="1.4" opacity="0.6"/>
        <path d="M${CX - 10} ${CY + R * 0.6} Q${CX} ${CY + 6} ${CX + 14} ${CY + 14}" fill="none" stroke="${seed.glow}" stroke-width="1" opacity="0.4"/>`;
    case 'ring':
      return `<ellipse cx="${CX}" cy="${CY + 2}" rx="${R + 16}" ry="6" fill="none" stroke="${seed.glow}" stroke-width="2" opacity="0.55"/>
        <ellipse cx="${CX}" cy="${CY + 2}" rx="${R + 16}" ry="6" fill="none" stroke="#fff" stroke-width="0.6" opacity="0.3"/>`;
    case 'lattice':
      return `<g opacity="0.5" stroke="${seed.glow}" stroke-width="0.9" fill="none">
        <path d="M${CX - 18} ${CY - 10} L${CX} ${CY - 20} L${CX + 18} ${CY - 10} L${CX + 18} ${CY + 10} L${CX} ${CY + 20} L${CX - 18} ${CY + 10} Z"/>
      </g>`;
    case 'plates':
      return `<path d="M${CX - R} ${CY - 4} L${CX - 6} ${CY - R + 2} L${CX + 8} ${CY - R + 6} L${CX + R} ${CY - 2}" fill="none" stroke="#000" stroke-width="1.2" opacity="0.35"/>
        <path d="M${CX - R + 4} ${CY + 10} L${CX + 4} ${CY + R - 4} L${CX + R - 2} ${CY + 8}" fill="none" stroke="#000" stroke-width="1.2" opacity="0.3"/>`;
    case 'satellites':
      return `<circle cx="${CX + R + 10}" cy="${CY - 6}" r="2.4" fill="${seed.glow}"/>
        <circle cx="${CX - R - 8}" cy="${CY + 12}" r="1.8" fill="#fff" opacity="0.8"/>
        <circle cx="${CX + 6}" cy="${CY - R - 10}" r="1.6" fill="${seed.glow}" opacity="0.8"/>`;
    case 'void':
      return `<circle cx="${CX}" cy="${CY}" r="${R * 0.55}" fill="#000"/>
        <circle cx="${CX}" cy="${CY}" r="${R * 0.62}" fill="none" stroke="${seed.glow}" stroke-width="1.4" opacity="0.7"/>`;
    default:
      return '';
  }
}

function buildMarkup(archetypeId) {
  const seed = ARCHETYPES[archetypeId] ?? ARCHETYPES.balanced;
  const gradId = `planet-${archetypeId}`;
  const [c1, c2, c3] = seed.stops;
  return `
    <defs>
      <radialGradient id="${gradId}" cx="38%" cy="34%" r="70%">
        <stop offset="0%" stop-color="${c3}"/>
        <stop offset="55%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c1}"/>
      </radialGradient>
    </defs>
    ${starfield()}
    <circle cx="${CX}" cy="${CY}" r="${R + 10}" fill="none" stroke="${seed.glow}" stroke-width="2" opacity="0.18"/>
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="url(#${gradId})"/>
    ${detailMarkup(seed.detail, seed)}
    <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="${seed.glow}" stroke-width="1" opacity="0.5"/>
  `;
}

/** id d'archétype -> id connu (repli sur 'balanced'). */
export function planetArtId(id) {
  return id in ARCHETYPES ? id : 'balanced';
}

/** @returns {SVGElement} portrait vivant, prêt à insérer dans le DOM. */
export function planetArt(archetypeId, className) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', VB);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  if (className) svg.setAttribute('class', className);
  svg.innerHTML = buildMarkup(planetArtId(archetypeId));
  return svg;
}

/** Markup string (pour des contextes hors DOM live). */
export function planetArtMarkup(archetypeId) {
  return `<svg viewBox="${VB}" aria-hidden="true">${buildMarkup(planetArtId(archetypeId))}</svg>`;
}

export const PLANET_ARCHETYPE_IDS = Object.keys(ARCHETYPES);
