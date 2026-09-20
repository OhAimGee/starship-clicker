// Tiroir latéral (mobile) — remplace l'ancien menu de pause, qui était une
// modale ouverte depuis le pied de page. Un panneau à 78 % de largeur glisse
// depuis la gauche sous un rideau ; il reprend le profil du Commandant et les
// entrées Succès / Options / Menu principal / Recommencer. Succès et Options
// s'ouvrent en plein écran par-dessus (flèche de retour → rouvre le tiroir),
// jamais empilés sur lui.
//
// Tant qu'il est ouvert, le reste de l'appli est `inert` : le focus reste
// prisonnier du tiroir sans piège clavier à maintenir, et ni un tap sur le
// fond ni un swipe d'onglet ne traversent le rideau.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { formatNumber } from './format.js';
import { xpForLevel } from '../game/leveling.js';

const SWIPE_CLOSE_PX = 60;

/**
 * @typedef {object} DrawerEntry
 * @property {string} id
 * @property {string} iconId
 * @property {string} label
 * @property {string} [sub]
 * @property {boolean} [danger]      action destructive (bouton plein, sans chevron)
 * @property {(ctx: { back?: () => void }) => void} run   `back` est fourni quand
 *   l'entrée est lancée depuis le tiroir : l'écran ouvert affiche alors une
 *   flèche de retour qui rouvre le tiroir.
 */

/**
 * @param {HTMLElement} host conteneur de l'appli : le tiroir s'y ajoute, et
 *   ses autres enfants deviennent inertes à l'ouverture
 * @param {import('../game/engine.js').Engine} engine
 * @param {{ trigger: HTMLElement, getEntries: () => DrawerEntry[] }} opts
 *   `trigger` : le burger (reçoit `aria-expanded` et le focus à la fermeture) ;
 *   `getEntries` est relu à chaque ouverture (textes, compteurs à jour).
 */
export function createDrawer(host, engine, { trigger, getEntries }) {
  const scrim = el('div', { class: 'drawer-scrim' });
  const panel = el('aside', {
    class: 'drawer',
    role: 'dialog',
    'aria-modal': 'true',
    tabindex: '-1',
  });
  host.append(scrim, panel);
  let open = false;

  const others = () =>
    [...host.children].filter(
      (n) => n !== scrim && n !== panel && !n.classList.contains('announcements')
    );

  function profile() {
    const s = engine.state;
    const p = s.prestige.player;
    const need = xpForLevel(p.level);
    const factionId = s.run.factionId;
    const factionLevel = s.prestige.factions[factionId]?.level ?? 0;
    return {
      name: s.commander.name || t('mainMenu.defaultCommanderName'),
      level: p.level,
      ratio: Math.min(1, p.xp / need),
      detail:
        `${formatNumber(p.xp)} / ${formatNumber(need)} XP` +
        (factionId
          ? ` · ${t(`faction.${factionId}.name`)} ${t('ui.labels.levelShort', { n: factionLevel })}`
          : ''),
    };
  }

  function render() {
    const p = profile();
    const closeBtn = el(
      'button',
      {
        class: 'drawer-close',
        type: 'button',
        'aria-label': t('ui.drawer.close'),
      },
      [icon('close', 'drawer-close-icon')]
    );
    closeBtn.addEventListener('click', () => close());

    const xpFill = el('div', { class: 'xp-bar-fill' });
    xpFill.style.width = `${p.ratio * 100}%`;

    const items = getEntries().map((entry) => {
      const btn = entry.danger
        ? el('button', {
            class: 'btn btn-danger btn-block',
            type: 'button',
            text: entry.label,
          })
        : el('button', { class: 'drawer-entry', type: 'button' }, [
            icon(entry.iconId, 'drawer-entry-icon'),
            el('span', { class: 'drawer-entry-text' }, [
              el('span', { class: 'drawer-entry-name', text: entry.label }),
              entry.sub &&
                el('span', { class: 'drawer-entry-sub', text: entry.sub }),
            ]),
            icon('chevron', 'drawer-entry-chevron'),
          ]);
      btn.addEventListener('click', () => {
        close({ restoreFocus: false });
        entry.run({ back: () => openDrawer() });
      });
      return el('li', { class: entry.danger ? 'is-danger' : '' }, [btn]);
    });

    panel.setAttribute('aria-label', t('ui.drawer.title'));
    panel.replaceChildren(
      el('div', { class: 'drawer-head steel' }, [
        el('div', { class: 'drawer-head-text' }, [
          el('span', { class: 'drawer-kicker', text: t('ui.drawer.commander') }),
          el('div', { class: 'drawer-name-line' }, [
            el('b', { class: 'drawer-name', text: p.name }),
            el('span', {
              class: 'drawer-level',
              text: t('ui.labels.levelShort', { n: p.level }),
            }),
          ]),
        ]),
        closeBtn,
      ]),
      el('div', { class: 'drawer-xp' }, [
        el('div', { class: 'xp-bar' }, [xpFill]),
        el('span', { class: 'drawer-xp-label', text: p.detail }),
      ]),
      el('ul', { class: 'drawer-list' }, items),
      el('p', { class: 'drawer-note', text: t('ui.footer') })
    );
  }

  function openDrawer() {
    if (open) return;
    open = true;
    render();
    for (const n of others()) n.inert = true;
    scrim.classList.add('is-open');
    panel.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.querySelector('.drawer-entry')?.focus({ preventScroll: true });
  }

  function close({ restoreFocus = true } = {}) {
    if (!open) return;
    open = false;
    for (const n of others()) n.inert = false;
    scrim.classList.remove('is-open');
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) trigger.focus({ preventScroll: true });
  }

  scrim.addEventListener('click', () => close());
  panel.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Swipe vers la gauche pour refermer (tactile uniquement, geste net).
  let start = null;
  panel.addEventListener('pointerdown', (e) => {
    start = e.pointerType === 'touch' ? { x: e.clientX, y: e.clientY } : null;
  });
  panel.addEventListener('pointerup', (e) => {
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    start = null;
    if (dx < -SWIPE_CLOSE_PX && Math.abs(dx) > Math.abs(dy)) close();
  });
  panel.addEventListener('pointercancel', () => (start = null));

  return { open: openDrawer, close, isOpen: () => open };
}
