// Ligne de tableau générique — un « service » (générateur, vaisseau, techno,
// amélioration). La ligne entière est le bouton d'achat ; un chevron ouvre le
// tiroir de détail (glissière mécanique, jamais de modale). Le tiroir est en
// lecture seule : construit une fois, seuls ses textes changent ensuite.

import { el } from './dom.js';
import { icon } from './icons.js';
import { t } from '../i18n/index.js';

/**
 * @param {object} o
 * @param {string} o.id
 * @param {string} o.action  data-action d'achat porté par la ligne
 * @param {string} o.iconId
 * @param {string} o.code    code horaire décoratif
 * @param {string} o.name
 * @param {string} o.desc    texte du tiroir
 */
export function boardRow(o) {
  const sub = el('span', { class: 'row-sub' });
  const loadBar = el('span', { class: 'load-bar' });
  const count = el('span', { class: 'row-count' });
  const cost = el('span', { class: 'row-cost' });

  const main = el(
    'button',
    {
      class: 'board-row-main',
      type: 'button',
      dataset: { action: o.action, id: o.id },
    },
    [
      el('span', { class: 'row-code', text: o.code }),
      icon(o.iconId, 'row-pictogram'),
      el('span', { class: 'row-label' }, [
        el('span', { class: 'row-name', text: o.name }),
        sub,
      ]),
      el('span', { class: 'row-tail' }, [loadBar, count, cost]),
    ]
  );

  const expand = el('button', {
    class: 'row-expand',
    type: 'button',
    'aria-label': t('ui.buttons.details'),
    dataset: { action: 'toggle-row', id: o.id },
  });
  expand.append(icon('chevron', 'row-expand-icon'));

  const drawerDesc = el('p', { class: 'drawer-desc', text: o.desc });
  const drawerFacts = el('dl', { class: 'drawer-facts' });
  const drawerLock = el('p', { class: 'drawer-lock', hidden: true });
  const drawerInner = el('div', { class: 'row-drawer-inner' }, [
    drawerDesc,
    drawerFacts,
    drawerLock,
  ]);

  const root = el('li', { class: 'board-row', dataset: { id: o.id } }, [
    el('div', { class: 'board-row-line' }, [main, expand]),
    el('div', { class: 'row-drawer' }, [drawerInner]),
  ]);
  root.setAttribute('aria-expanded', 'false');

  return {
    root,
    refs: { main, sub, loadBar, count, cost, drawerFacts, drawerLock },
    toggle() {
      const open = root.getAttribute('aria-expanded') === 'true';
      root.setAttribute('aria-expanded', open ? 'false' : 'true');
    },
  };
}

/** En-tête de section, style rail : intitulé à gauche, colonne « coût » à droite. */
export function sectionHead(label, right = t('ui.cols.cost')) {
  return el('div', { class: 'section-head' }, [
    el('span', { text: label }),
    el('span', { class: 'section-head-col', text: right }),
  ]);
}

/** Remplace les faits du tiroir : liste de [label, valeur]. */
export function setFacts(dl, pairs) {
  dl.replaceChildren(
    ...pairs.flatMap(([k, v]) => [el('dt', { text: k }), el('dd', { text: v })])
  );
}

/** Barre de charge : `n` segments allumés sur `max`. */
export function setLoadBar(node, n, max = 10) {
  if (node.childElementCount !== max) {
    node.replaceChildren(...Array.from({ length: max }, () => el('i')));
  }
  const filled = Math.min(max, Math.round(n));
  [...node.children].forEach((seg, i) =>
    seg.classList.toggle('on', i < filled)
  );
}
