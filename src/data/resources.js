// Les ressources du jeu. `order` fixe l'affichage. Le nom localisé est en i18n
// (`resource.<id>`). `code` est une étiquette courte pour les contextes
// purement texte (annonces, coûts). L'iconographie est fournie par
// `src/ui/icons.js` (pictogrammes SVG, lignée signalétique transport).

export const RESOURCES = [
  { id: 'energy', code: 'NRG', order: 0 },
  { id: 'metal', code: 'MTL', order: 1 },
  { id: 'crystals', code: 'CRY', order: 2 },
  { id: 'antimatter', code: 'AM', order: 3 },
  { id: 'influence', code: 'INF', order: 4 },
  { id: 'darkMatter', code: 'DM', order: 5 },
  { id: 'quantumEnergy', code: 'QE', order: 6 },
  { id: 'ascensionPoints', code: 'AP', order: 7 },
];

export const RESOURCE_IDS = RESOURCES.map((r) => r.id);

export const RESOURCE_BY_ID = Object.fromEntries(
  RESOURCES.map((r) => [r.id, r])
);

export function resourceCode(id) {
  return RESOURCE_BY_ID[id]?.code ?? id;
}
