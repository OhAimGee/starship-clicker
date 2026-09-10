// Annonces transitoires — bandeaux qui glissent au-dessus du sélecteur de
// terminaux (l'équivalent « haut-parleur de gare » des toasts).

import { el } from './dom.js';
import { icon } from './icons.js';

const MAX = 3;
const LIFE_MS = 4200;

export function createNotifier(container) {
  function push(message, level = 'info') {
    const ICON = { success: 'check', error: 'lock', info: 'bolt' };
    const strip = el(
      'div',
      { class: `announce announce-${level}`, role: 'status' },
      [icon(ICON[level] ?? 'bolt', 'announce-icon'), message]
    );
    container.append(strip);
    while (container.children.length > MAX)
      container.firstElementChild.remove();
    setTimeout(() => {
      strip.classList.add('is-leaving');
      setTimeout(() => strip.remove(), 280);
    }, LIFE_MS);
  }
  return { push };
}
