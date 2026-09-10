// Carte d'achat générique (générateur, vaisseau, amélioration, techno).
// Renvoie { root, refs } ; `refs` sert au rafraîchissement par mutation.

import { el } from '../dom.js';
import { t } from '../../i18n/index.js';

/**
 * @param {object} opts
 * @param {string} opts.action   valeur data-action du bouton
 * @param {string} opts.id       valeur data-id
 * @param {string} opts.icon
 * @param {string} opts.name
 * @param {string} opts.desc
 * @param {string} opts.buttonLabel
 * @param {boolean} opts.teased  affiché grisé (verrouillé mais proche)
 * @param {string} [opts.lockHint]
 */
export function purchaseCard(opts) {
  const meta = el('p', { class: 'card-meta' });
  const cost = el('p', { class: 'card-cost' });
  const button = el('button', {
    class: 'btn btn-buy',
    type: 'button',
    dataset: opts.teased ? {} : { action: opts.action, id: opts.id },
    text: opts.buttonLabel,
  });

  const body = [
    el('div', { class: 'card-head' }, [
      el('span', {
        class: 'card-icon',
        'aria-hidden': 'true',
        text: opts.icon,
      }),
      el('h4', { class: 'card-name', text: opts.name }),
    ]),
    el('p', { class: 'card-desc', text: opts.desc }),
    meta,
    cost,
  ];

  if (opts.teased) {
    body.push(
      el('p', {
        class: 'card-lock',
        text: opts.lockHint ?? t('ui.labels.locked'),
      })
    );
  } else {
    body.push(button);
  }

  const root = el(
    'li',
    {
      class: `card${opts.teased ? ' card-teased' : ''}`,
      dataset: { id: opts.id },
    },
    body
  );

  return { root, refs: { meta, cost, button } };
}
