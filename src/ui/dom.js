// Petits utilitaires DOM. Pas de framework : l'UI est reconstruite une fois par
// panneau (mount) puis rafraîchie par mutation de refs (update).

/**
 * @param {string} tag
 * @param {object} [props] - attributs ; `class`, `text`, `html`, `dataset`, on*
 * @param {(Node|string)[]} [children]
 */
export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'text') node.textContent = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === 'disabled' || k === 'hidden') node[k] = !!v;
    else node.setAttribute(k, v);
  }
  for (const child of [].concat(children)) {
    if (child == null || child === false) continue;
    node.append(
      child.nodeType ? child : document.createTextNode(String(child))
    );
  }
  return node;
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export function clear(node) {
  node.replaceChildren();
  return node;
}

/** Délègue les clics : appelle `handler(action, id, event)` pour tout élément
 *  portant `data-action` (l'`id` vient de `data-id`). */
export function delegate(root, handler) {
  root.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target || !root.contains(target)) return;
    handler(target.dataset.action, target.dataset.id, e);
  });
}
