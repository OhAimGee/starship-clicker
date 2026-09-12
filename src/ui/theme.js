// Thème visuel — calqué sur i18n/index.js (même indépendance vis-à-vis du
// state de jeu, utilisable avant qu'un Engine existe, donc depuis l'écran
// d'accueil). Un seul thème disponible aujourd'hui (le CyberSpace bleu
// actuel, seules variables définies sous `:root` dans styles.css) ; cette
// plomberie pose déjà l'attribut `data-theme` sur `<html>` pour qu'un futur
// thème puisse se cibler (`:root[data-theme="autre"]`) sans y retoucher.

export const AVAILABLE_THEMES = ['cyberspace'];
const DEFAULT_THEME = 'cyberspace';
const STORAGE_KEY = 'starshipClickerTheme';

let current = DEFAULT_THEME;

export function getTheme() {
  return current;
}

export function setTheme(theme) {
  if (!AVAILABLE_THEMES.includes(theme) || theme === current) return;
  current = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* stockage indisponible */
  }
  document.documentElement.dataset.theme = current;
}

/** Restaure le thème depuis le localStorage et l'applique. */
export function initTheme() {
  let theme;
  try {
    theme = localStorage.getItem(STORAGE_KEY);
  } catch {
    theme = null;
  }
  current = AVAILABLE_THEMES.includes(theme) ? theme : DEFAULT_THEME;
  document.documentElement.dataset.theme = current;
  return current;
}
