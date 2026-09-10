// Déclenchement des événements aléatoires.

import { CONFIG } from '../data/config.js';
import { RANDOM_EVENTS } from '../data/events.js';

function pickWeighted(events, rng) {
  const total = events.reduce((sum, e) => sum + e.weight, 0);
  let roll = rng() * total;
  for (const e of events) {
    roll -= e.weight;
    if (roll <= 0) return e;
  }
  return events[events.length - 1];
}

/**
 * Avance l'horloge des événements de `dtMs` et, le cas échéant, en déclenche un.
 * @returns {{ id: string, icon: string, grant: object } | null}
 */
export function tickEvents(state, dtMs, rng = Math.random) {
  const ev = state.events;
  ev.accumMs += dtMs;
  if (ev.accumMs < CONFIG.events.cooldownMs) return null;
  ev.accumMs = 0;

  if (rng() >= CONFIG.events.chance) return null;

  const eligible = RANDOM_EVENTS.filter(
    (e) => !e.requires || e.requires(state)
  );
  if (eligible.length === 0) return null;

  const event = pickWeighted(eligible, rng);
  const grant = event.grant(state);
  for (const [res, amount] of Object.entries(grant)) {
    state.resources[res] = (state.resources[res] ?? 0) + amount;
    state.totalProduced[res] = (state.totalProduced[res] ?? 0) + amount;
  }
  ev.lastAt = Date.now();
  return { id: event.id, grant };
}
