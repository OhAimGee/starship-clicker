// File d'attente de notifications transitoires (toasts).

import { el } from './dom.js';

const MAX_VISIBLE = 4;
const LIFETIME_MS = 4500;

export function createNotifier(container) {
  function push(message, level = 'info') {
    const toast = el('div', {
      class: `toast toast-${level}`,
      role: 'status',
      text: message,
    });
    container.append(toast);
    while (container.children.length > MAX_VISIBLE) {
      container.firstElementChild.remove();
    }
    setTimeout(() => {
      toast.classList.add('toast-leaving');
      setTimeout(() => toast.remove(), 300);
    }, LIFETIME_MS);
  }
  return { push };
}
