// Modales : rapport hors-ligne + confirmation.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { formatNumber, formatDuration } from './format.js';
import { resourceIcon } from '../data/resources.js';

function overlay(content) {
  const box = el('div', {
    class: 'modal',
    role: 'dialog',
    'aria-modal': 'true',
  });
  box.append(content);
  const root = el('div', { class: 'modal-overlay' }, [box]);
  const close = () => root.remove();
  root.addEventListener('click', (e) => {
    if (e.target === root) close();
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
  document.body.append(root);
  return { root, close };
}

export function showOfflineReport({ cappedSeconds, gains }) {
  const list = el(
    'p',
    { class: 'modal-gains' },
    Object.entries(gains)
      .filter(([, v]) => v > 0)
      .map(([res, amount]) => `${resourceIcon(res)} +${formatNumber(amount)}`)
      .join('   ')
  );
  const btn = el('button', {
    class: 'btn btn-primary',
    type: 'button',
    text: t('ui.buttons.resume'),
  });
  const content = el('div', {}, [
    el('h2', { text: t('ui.offline.title') }),
    el('p', {
      text: t('ui.offline.body', { duration: formatDuration(cappedSeconds) }),
    }),
    el('p', { class: 'modal-label', text: t('ui.offline.gains') }),
    list,
    btn,
  ]);
  const { close } = overlay(content);
  btn.addEventListener('click', close);
  btn.focus();
}

export function confirmDialog(message, onConfirm) {
  const yes = el('button', {
    class: 'btn btn-danger',
    type: 'button',
    text: t('ui.buttons.reset'),
  });
  const no = el('button', { class: 'btn', type: 'button', text: '✕' });
  const content = el('div', {}, [
    el('p', { text: message }),
    el('div', { class: 'modal-actions' }, [no, yes]),
  ]);
  const { close } = overlay(content);
  no.addEventListener('click', close);
  yes.addEventListener('click', () => {
    close();
    onConfirm();
  });
  no.focus();
}
