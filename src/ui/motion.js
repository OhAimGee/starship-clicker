// Retour visuel du clic. Remplace l'ancien visual-enhancements.js (qui injectait
// des <style> au runtime, ajoutait 15 particules DOM permanentes et posait des
// styles inline au survol). Ici : un effet léger, désactivé si l'utilisateur
// préfère moins d'animations.

const reduced =
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export function clickBurst(host, event, amount) {
  if (reduced || !host) return;
  const rect = host.getBoundingClientRect();
  const x = (event?.clientX ?? rect.left + rect.width / 2) - rect.left;
  const y = (event?.clientY ?? rect.top + rect.height / 2) - rect.top;

  const float = document.createElement('span');
  float.className = 'click-float';
  float.textContent = `+${amount}`;
  float.style.left = `${x}px`;
  float.style.top = `${y}px`;
  host.append(float);
  float.addEventListener('animationend', () => float.remove());
}
