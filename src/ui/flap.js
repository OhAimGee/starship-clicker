// Afficheur à palettes (split-flap) — l'interaction signature.
//
// Chaque caractère est une palette. Quand la valeur change, seules les palettes
// dont le caractère change tournent, en cascade de gauche à droite. Le texte
// final est toujours présent dans le DOM (lecteurs d'écran). `prefers-reduced-
// motion` : bascule instantanée, aucune animation.

const REDUCED =
  typeof matchMedia === 'function' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

const SEP = new Set([' ', ' ', ' ', ',', '.', ':', '/', '+', '-', '·']);

export function createFlap(initialText = '') {
  const node = document.createElement('span');
  node.className = 'flaps';
  let current = '';

  function set(next) {
    next = String(next);
    if (next === current) return;

    const len = next.length;

    // Ajuster le nombre de palettes ; en cas de réduction, retirer par la
    // GAUCHE (le contenu est aligné à droite).
    while (node.childElementCount < len) node.append(makeFlap());
    while (node.childElementCount > len) node.firstElementChild.remove();

    const flaps = node.children;
    for (let i = 0; i < len; i++) {
      const ch = next[i];
      const flap = flaps[i];
      const isSep = SEP.has(ch);
      flap.classList.toggle('is-sep', isSep);
      flap.style.setProperty('--i', i);

      const changed = flap.textContent !== ch;
      flap.textContent = ch;
      if (changed && !REDUCED && !isSep) {
        flap.classList.remove('is-flipping');
        void flap.offsetWidth; // reflow pour rejouer l'animation
        flap.classList.add('is-flipping');
      }
    }
    current = next;
  }

  set(initialText);
  return { node, set };
}

function makeFlap() {
  const el = document.createElement('span');
  el.className = 'flap';
  el.textContent = ''; // vide : ne peut egaler aucun caractere affiche
  el.addEventListener('animationend', () => el.classList.remove('is-flipping'));
  return el;
}
