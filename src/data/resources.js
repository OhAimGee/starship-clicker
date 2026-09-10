// Les ressources du jeu. `order` fixe l'affichage. `key` référence une chaîne
// i18n (`resource.<id>`). `icon` reste un emoji pour l'instant (la Phase 3
// décidera de l'iconographie définitive).

export const RESOURCES = [
  { id: 'energy', icon: '⚡', order: 0 },
  { id: 'metal', icon: '🛠️', order: 1 },
  { id: 'crystals', icon: '💎', order: 2 },
  { id: 'antimatter', icon: '⚛️', order: 3 },
  { id: 'influence', icon: '👑', order: 4 },
  { id: 'darkMatter', icon: '🌑', order: 5 },
  { id: 'quantumEnergy', icon: '🔮', order: 6 },
  { id: 'ascensionPoints', icon: '✨', order: 7 },
];

export const RESOURCE_IDS = RESOURCES.map((r) => r.id);

export const RESOURCE_BY_ID = Object.fromEntries(
  RESOURCES.map((r) => [r.id, r])
);

export function resourceIcon(id) {
  return RESOURCE_BY_ID[id]?.icon ?? '';
}
