// Modales — panneau « service » plein cadre (en-tête acier, corps noir mat).

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { formatNumber, formatDuration } from './format.js';
import { resourceCode } from '../data/resources.js';

/** `dismissable: false` retire la fermeture par clic sur le fond / Échap
 *  (utilisé pour un choix obligatoire, ex. sélection de faction). */
export function openPanel(headline, body, { dismissable = true } = {}) {
  const panel = el('div', {
    class: 'board-modal',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': headline,
  });
  panel.append(
    el('div', { class: 'board-modal-head steel', text: headline }),
    el('div', { class: 'board-modal-body' }, body)
  );
  const scrim = el('div', { class: 'board-modal-scrim' }, [panel]);
  const close = () => scrim.remove();
  if (dismissable) {
    scrim.addEventListener('click', (e) => e.target === scrim && close());
    scrim.addEventListener('keydown', (e) => e.key === 'Escape' && close());
  }
  document.body.append(scrim);
  return { scrim, close };
}

export function showOfflineReport({ cappedSeconds, gains }) {
  const list = el(
    'p',
    { class: 'board-modal-gains' },
    Object.entries(gains)
      .filter(([, v]) => v > 0)
      .map(([res, amt]) => `${resourceCode(res)} +${formatNumber(amt)}`)
      .join('  ')
  );
  const btn = el('button', {
    class: 'btn btn-go btn-block',
    type: 'button',
    text: t('ui.buttons.resume'),
  });
  const { close } = openPanel(t('ui.offline.title'), [
    el('p', {
      text: t('ui.offline.body', { duration: formatDuration(cappedSeconds) }),
    }),
    el('p', { class: 'foot-note', text: t('ui.offline.gains') }),
    list,
    btn,
  ]);
  btn.addEventListener('click', close);
  btn.focus();
}

export function confirmDialog(message, onConfirm) {
  const yes = el('button', {
    class: 'btn btn-danger btn-block',
    type: 'button',
    text: t('ui.buttons.reset'),
  });
  const no = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('ui.buttons.cancel'),
  });
  const { close } = openPanel(t('ui.reset.title'), [
    el('p', { text: message }),
    el('div', { class: 'board-modal-actions' }, [no, yes]),
  ]);
  no.addEventListener('click', close);
  yes.addEventListener('click', () => {
    close();
    onConfirm();
  });
  no.focus();
}
