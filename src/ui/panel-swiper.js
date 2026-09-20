// Swipe horizontal entre terminaux (mobile). Pointer Events, TACTILE
// uniquement (`pointerType === 'touch'`) : la souris ne déclenche jamais rien,
// donc aucune interférence avec la sélection de texte ni le glisser-déposer.
// Aucune capture de pointeur : un simple tap sur une ligne continue de
// produire son `click` normal.
//
// Le conteneur doit porter `touch-action: pan-y` (voir styles.css) : le
// navigateur garde le défilement vertical, et nous laisse les mouvements
// horizontaux. Après un verrou d'axe, un geste vertical est abandonné ; un
// geste horizontal fait suivre le doigt au panneau courant 1:1 (avec
// résistance aux extrémités) puis bascule ou revient.

const AXIS_LOCK_PX = 6; // en deçà, on ne sait pas encore si c'est un tap ou un swipe
const COMMIT_PX = 45; // distance qui valide la bascule…
const FLICK_MIN_PX = 20; // …ou un geste plus court mais rapide :
const FLICK_PX_PER_MS = 0.5;
const EDGE_RESISTANCE = 0.25; // fraction du déplacement conservée sur un bord

/**
 * Décision pure (testable sans DOM) : quel terminal ouvrir après un geste ?
 * @param {string[]} tabs clés des terminaux, dans l'ordre du pager
 * @param {string} active terminal courant
 * @param {{ dx: number, dy: number, dt: number }} gesture déplacements en px,
 *   durée en ms
 * @returns {string | null} la clé à ouvrir, ou null (geste vertical, trop
 *   court, ou déjà à l'extrémité)
 */
export function nextTabForDrag(tabs, active, { dx, dy, dt }) {
  if (Math.abs(dx) <= Math.abs(dy)) return null;
  const distance = Math.abs(dx);
  const flick =
    dt > 0 && distance >= FLICK_MIN_PX && distance / dt >= FLICK_PX_PER_MS;
  if (distance < COMMIT_PX && !flick) return null;
  const i = tabs.indexOf(active) + (dx < 0 ? 1 : -1);
  return i >= 0 && i < tabs.length ? tabs[i] : null;
}

/**
 * @param {HTMLElement} target zone qui reçoit les gestes (le contenu défilant)
 * @param {object} o
 * @param {HTMLElement} o.track élément déplacé pendant le geste (le panneau)
 * @param {string[]} o.tabs
 * @param {() => string} o.getActive
 * @param {() => boolean} o.isEnabled faux hors mobile, tiroir ouvert…
 * @param {(key: string) => void} o.onSwitch appelé pour ouvrir un terminal
 */
export function createPanelSwiper(target, { track, tabs, getActive, isEnabled, onSwitch }) {
  let drag = null; // { id, x, y, t, axis }

  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function release() {
    track.style.transition = '';
    track.style.transform = '';
    target.classList.remove('is-swiping');
  }

  function snapBack() {
    if (reduceMotion()) return release();
    track.style.transition = 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)';
    track.style.transform = 'translateX(0)';
    const done = () => {
      track.removeEventListener('transitionend', done);
      release();
    };
    track.addEventListener('transitionend', done);
    // Filet de sécurité si `transitionend` ne vient pas (onglet en arrière-plan).
    setTimeout(done, 300);
  }

  target.addEventListener('pointerdown', (e) => {
    if (
      e.pointerType !== 'touch' ||
      !e.isPrimary ||
      !isEnabled() ||
      e.target.closest('input, select, textarea')
    ) {
      return;
    }
    drag = { id: e.pointerId, x: e.clientX, y: e.clientY, t: e.timeStamp, axis: null };
  });

  target.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    if (!drag.axis) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_LOCK_PX) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (drag.axis === 'y') {
        drag = null; // défilement vertical : on laisse faire le navigateur
        return;
      }
      target.classList.add('is-swiping');
    }
    const i = tabs.indexOf(getActive());
    const atEdge = (dx > 0 && i === 0) || (dx < 0 && i === tabs.length - 1);
    track.style.transition = 'none';
    track.style.transform = `translateX(${atEdge ? dx * EDGE_RESISTANCE : dx}px)`;
  });

  function finish(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    const g = { dx: e.clientX - drag.x, dy: e.clientY - drag.y, dt: e.timeStamp - drag.t };
    const swiped = drag.axis === 'x';
    drag = null;
    if (!swiped) return;
    const next = cancelled ? null : nextTabForDrag(tabs, getActive(), g);
    if (next) {
      release(); // le nouveau panneau fait sa propre glissade d'entrée
      onSwitch(next);
    } else {
      snapBack();
    }
  }
  target.addEventListener('pointerup', (e) => finish(e, false));
  target.addEventListener('pointercancel', (e) => finish(e, true));
}
