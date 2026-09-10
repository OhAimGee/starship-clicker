// Retour tactile du contrôle LANCER.
//
// Held (maintien) : le contrôle passe en cadence auto — c'est le contrôle
// maître (raise « un contrôle continu pilote la surface »). Respecte
// prefers-reduced-motion.

const REDUCED =
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Câble le maintien du bouton LANCER sur un déclencheur répété.
 * @param {HTMLElement} button
 * @param {() => void} fire  action à répéter tant que maintenu
 * @param {{ intervalMs?: number, delayMs?: number }} [opts]
 */
export function bindHold(
  button,
  fire,
  { intervalMs = 220, delayMs = 320 } = {}
) {
  let holdTimer = null;
  let repeat = null;

  const stop = () => {
    clearTimeout(holdTimer);
    clearInterval(repeat);
    holdTimer = repeat = null;
    button.classList.remove('is-holding');
  };

  const start = () => {
    if (holdTimer || repeat) return;
    holdTimer = setTimeout(() => {
      button.classList.add('is-holding');
      repeat = setInterval(fire, intervalMs);
    }, delayMs);
  };

  button.addEventListener('pointerdown', start);
  for (const ev of ['pointerup', 'pointerleave', 'pointercancel', 'blur']) {
    button.addEventListener(ev, stop);
  }
}

export { REDUCED as reducedMotion };
