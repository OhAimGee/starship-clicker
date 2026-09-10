// Événements aléatoires. Passé le cooldown (CONFIG.events.cooldownMs), une
// chance CONFIG.events.chance déclenche un événement tiré au poids.
//
// `grant(state)` renvoie une map { resource: montant } ajoutée aux ressources,
// calculée à partir de l'état (souvent indexée sur le niveau de civilisation).
// `requires` (optionnel) : ne se déclenche que si la condition est remplie.

export const RANDOM_EVENTS = [
  {
    id: 'solarStorm',
    weight: 3,
    grant: (s) => ({ energy: Math.max(50, s.resources.energy * 0.4) }),
  },
  {
    id: 'archaeologicalFind',
    weight: 3,
    grant: (s) => ({ crystals: Math.floor(s.civilizationLevel * 120 + 50) }),
  },
  {
    id: 'quantumAnomaly',
    weight: 2,
    grant: (s) => ({ antimatter: Math.floor(s.civilizationLevel * 8 + 5) }),
  },
  {
    id: 'diplomaticContact',
    weight: 2,
    grant: (s) => ({ influence: Math.floor(s.civilizationLevel * 4 + 3) }),
  },
  {
    id: 'darkMatterVortex',
    weight: 1,
    requires: (s) => s.technologies.darkMatterPhysics?.unlocked,
    grant: (s) => ({
      darkMatter: Math.max(1, Math.floor(s.civilizationLevel)),
    }),
  },
];

export const EVENT_BY_ID = Object.fromEntries(
  RANDOM_EVENTS.map((e) => [e.id, e])
);
