// Tutoriel guidé interactif — overlay "spotlight" par-dessus une vraie
// partie déjà montée (voir main.js#onTutorial). Pointe le vrai bouton à
// cliquer, n'avance qu'après une vraie action du joueur (ou un clic
// "Suivant" pour les étapes purement explicatives) — voir le plan
// (src/data/tutorialSteps.js) pour le script complet.
//
// Aucune référence de nœud DOM n'est jamais conservée pour une cible :
// chaque frame re-résout `step.target` par sélecteur, ce qui rend
// l'overlay immunisé aux reconstructions de panneau (`clear(root)` +
// nouvelles lignes à chaque `refresh()` dans shop.js/fleet.js/etc.).

import { el, clear, delegate } from './dom.js';
import { t } from '../i18n/index.js';
import { TUTORIAL_STEPS } from '../data/tutorialSteps.js';
import { markTutorialSeen } from './tutorial-progress.js';

const PAD = 8;
const GAP = 16;

/**
 * Démarre le tutoriel par-dessus la partie déjà montée par `mountApp()`.
 * @param {import('../game/engine.js').Engine} engine
 * @returns {{ dispose: () => void }}
 */
export function startTutorial(engine) {
  const dimTop = el('div', { class: 'tutorial-dim tutorial-dim-top' });
  const dimBottom = el('div', { class: 'tutorial-dim tutorial-dim-bottom' });
  const dimLeft = el('div', { class: 'tutorial-dim tutorial-dim-left' });
  const dimRight = el('div', { class: 'tutorial-dim tutorial-dim-right' });
  const ring = el('div', { class: 'tutorial-ring' });
  const dimNodes = [dimTop, dimBottom, dimLeft, dimRight, ring];

  const eyebrow = el('p', { class: 'tutorial-card-eyebrow' });
  const textHost = el('div', { class: 'tutorial-card-text-host' });
  const skipBtn = el('button', {
    class: 'btn',
    type: 'button',
    text: t('tutorial.skip'),
  });
  const nextBtn = el('button', { class: 'btn btn-go', type: 'button' });
  const card = el('div', { class: 'tutorial-card' }, [
    eyebrow,
    textHost,
    el('div', { class: 'tutorial-card-actions' }, [skipBtn, nextBtn]),
  ]);

  const frame = el('div', { class: 'tutorial-frame' }, [card]);
  document.body.append(frame);

  let disposed = false;
  let rafId = null;
  let stepIndex = 0;
  let currentUnsub = null;
  let revealedTarget = null;

  function step() {
    return TUTORIAL_STEPS[stepIndex];
  }

  function renderText(overrideKeys) {
    clear(textHost);
    eyebrow.textContent = t('tutorial.stepCounter', {
      n: stepIndex + 1,
      total: TUTORIAL_STEPS.length,
    });
    for (const key of overrideKeys ?? step().bodyKeys) {
      textHost.append(el('p', { class: 'tutorial-card-text', text: t(key) }));
    }
  }

  function finish() {
    dispose();
    markTutorialSeen();
  }

  function advance() {
    unsubscribeCurrent();
    if (stepIndex >= TUTORIAL_STEPS.length - 1) {
      finish();
      return;
    }
    stepIndex += 1;
    showCurrentStep();
  }

  function attachWaitFor() {
    const s = step();
    const wf = s.waitFor;
    if (!wf || wf.tab) return null; // les onglets sont gérés par l'écouteur permanent ci-dessous
    return engine.on(wf.engineEvent, (payload) => {
      const ok = wf.check ? wf.check(engine, payload) : true;
      if (ok) {
        advance();
      } else {
        s.topUp?.(engine);
        if (s.retryTextKey) renderText([s.retryTextKey]);
      }
    });
  }

  function unsubscribeCurrent() {
    currentUnsub?.();
    currentUnsub = null;
  }

  function showCurrentStep() {
    const s = step();
    s.topUp?.(engine);
    renderText();
    const advanceByButton = s.advance === 'button';
    nextBtn.hidden = !advanceByButton;
    nextBtn.textContent = s.isLast ? t('tutorial.finish') : t('tutorial.next');
    nextBtn.onclick = advanceByButton ? advance : null;
    currentUnsub = attachWaitFor();
  }

  // Écouteur permanent (pas par étape) : détecte les clics d'onglet en
  // parallèle du délégué propre à app.js, sans jamais interférer avec lui
  // (deux écouteurs indépendants sur le même clic).
  const detachTabWatch = delegate(document.body, (action, id) => {
    if (action !== 'tab') return;
    if (step().waitFor?.tab === id) advance();
  });

  // Garde-fou : un Reset pendant le tutoriel est un abandon, pas un skip
  // volontaire — on ne marque pas le tutoriel comme vu.
  const detachResetGuard = engine.on('reset', () => dispose());

  skipBtn.addEventListener('click', finish);

  function setRect(node, top, left, width, height) {
    node.style.top = `${top}px`;
    node.style.left = `${left}px`;
    node.style.width = `${Math.max(0, width)}px`;
    node.style.height = `${Math.max(0, height)}px`;
  }

  function positionCardNear(rect, vw, vh) {
    card.dataset.placement = 'auto';
    const cw = card.offsetWidth || 320;
    const ch = card.offsetHeight || 140;
    const spaceBelow = vh - rect.bottom - GAP;
    const spaceAbove = rect.top - GAP;
    // Choisit le côté (dessous/dessus) qui a le plus de place et s'y colle
    // sans jamais empiéter sur la cible — quitte à déborder du viewport si
    // le texte de l'étape rend la carte plus haute que la place disponible
    // des deux côtés (écrans mobiles étroits) : mieux vaut une carte
    // partiellement hors écran qu'une carte qui recouvre le bouton à
    // cliquer et bloque la progression.
    const top =
      spaceBelow >= spaceAbove ? rect.bottom + GAP : rect.top - GAP - ch;
    let left = rect.left + rect.width / 2 - cw / 2;
    left = Math.min(Math.max(8, left), Math.max(8, vw - cw - 8));
    card.style.top = `${top}px`;
    card.style.left = `${left}px`;
  }

  function positionCardFixed(mode) {
    card.dataset.placement = mode;
    card.style.top = '';
    card.style.left = '';
  }

  /** Étapes `fixed-bottom` : se déroulent par-dessus une vraie modale de jeu
   * déjà ouverte (détail de système, allocation de flotte…). Un ancrage
   * bas fixe la recouvrait sur petit écran (le popup, centré, peut occuper
   * toute la hauteur visible et pousser ses boutons près du bas) — on se
   * cale donc plutôt au-dessus ou en dessous de la modale la plus récente
   * (la plus haute dans l'empilement), quel que soit son contenu. */
  function positionCardNearModal(vw, vh) {
    const modals = document.querySelectorAll('.board-modal');
    const modal = modals[modals.length - 1];
    if (!modal) {
      positionCardFixed('fixed-bottom');
      return;
    }
    card.dataset.placement = 'auto';
    const r = modal.getBoundingClientRect();
    const cw = card.offsetWidth || 320;
    const ch = card.offsetHeight || 140;
    const spaceBelow = vh - r.bottom - GAP;
    const spaceAbove = r.top - GAP;
    const top = spaceBelow >= spaceAbove ? r.bottom + GAP : r.top - GAP - ch;
    let left = vw / 2 - cw / 2;
    left = Math.min(Math.max(8, left), Math.max(8, vw - cw - 8));
    card.style.top = `${top}px`;
    card.style.left = `${left}px`;
  }

  function resolveTarget() {
    const s = step();
    if (!s.target) return null;
    const direct = document.querySelector(s.target);
    if (direct) return direct;
    // Dégradation : la cible n'est plus dans le DOM (le joueur a changé
    // d'onglet) — on redirige vers le bouton de l'onglet requis le temps
    // qu'il y revienne ; se résout tout seul au frame suivant.
    if (s.requiresTab) {
      const active = document.querySelector(
        '.terminal-bar [aria-selected="true"]'
      )?.dataset.id;
      if (active !== s.requiresTab) {
        return document.querySelector(
          `.terminal-bar [data-action="tab"][data-id="${s.requiresTab}"]`
        );
      }
    }
    return null;
  }

  /** Sur mobile le contenu défile dans `.app-main` (et non plus dans la
   * page) : les bandes d'assombrissement interceptent les gestes, le joueur
   * ne peut donc pas y amener lui-même une cible située sous la ligne de
   * flottaison (ex. « Terminer la run », en bas du panneau Ascension). On la
   * fait défiler dans la zone visible, une fois par cible. Sans effet
   * dès 720 px, où `.app-main` ne défile pas. */
  function revealInScroller(node) {
    const scroller = node.closest('.app-main');
    if (!scroller || scroller.scrollHeight <= scroller.clientHeight) return;
    const view = scroller.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    const margin = PAD + GAP;
    if (r.top < view.top + margin) {
      scroller.scrollTop -= view.top + margin - r.top;
    } else if (r.bottom > view.bottom - margin) {
      scroller.scrollTop += r.bottom - (view.bottom - margin);
    }
  }

  function positionOverlay() {
    const s = step();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetEl =
      s.placement === 'center' || s.placement === 'fixed-bottom'
        ? null
        : resolveTarget();

    if (targetEl) {
      if (targetEl !== revealedTarget) {
        revealedTarget = targetEl;
        revealInScroller(targetEl);
      }
      const r = targetEl.getBoundingClientRect();
      const top = Math.max(0, r.top - PAD);
      const bottom = Math.min(vh, r.bottom + PAD);
      const left = Math.max(0, r.left - PAD);
      const right = Math.min(vw, r.right + PAD);
      setRect(dimTop, 0, 0, vw, top);
      setRect(dimBottom, bottom, 0, vw, vh - bottom);
      setRect(dimLeft, top, 0, left, bottom - top);
      setRect(dimRight, top, right, vw - right, bottom - top);
      setRect(ring, top, left, right - left, bottom - top);
      for (const n of dimNodes) if (!n.isConnected) frame.append(n);
      positionCardNear(r, vw, vh);
    } else {
      for (const n of dimNodes) n.remove();
      if (s.placement === 'fixed-bottom') positionCardNearModal(vw, vh);
      else positionCardFixed('center');
    }
  }

  function frameLoop() {
    if (disposed) return;
    positionOverlay();
    rafId = requestAnimationFrame(frameLoop);
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (rafId != null) cancelAnimationFrame(rafId);
    unsubscribeCurrent();
    detachTabWatch();
    detachResetGuard();
    frame.remove();
  }

  showCurrentStep();
  rafId = requestAnimationFrame(frameLoop);

  return { dispose };
}
