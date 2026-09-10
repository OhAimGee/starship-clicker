// i18n minimaliste. `t('a.b.c', { name })` résout une clé pointée dans le
// dictionnaire de la langue courante et interpole `{param}`. Fallback : la
// langue par défaut, puis la clé elle-même.

import { fr } from './fr.js';
import { en } from './en.js';

const DICTS = { fr, en };
export const AVAILABLE_LANGS = Object.keys(DICTS);
const DEFAULT_LANG = 'fr';

let current = DEFAULT_LANG;
const listeners = new Set();

export function getLang() {
  return current;
}

export function setLang(lang) {
  if (!DICTS[lang] || lang === current) return;
  current = lang;
  try {
    localStorage.setItem('starshipClickerLang', lang);
  } catch {
    /* stockage indisponible */
  }
  listeners.forEach((fn) => fn(lang));
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Restaure la langue depuis le localStorage ou l'état de sauvegarde. */
export function initLang(fallback) {
  let lang;
  try {
    lang = localStorage.getItem('starshipClickerLang');
  } catch {
    lang = null;
  }
  lang = lang || fallback || DEFAULT_LANG;
  current = DICTS[lang] ? lang : DEFAULT_LANG;
  return current;
}

function lookup(dict, key) {
  return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);
}

function interpolate(str, params) {
  if (!params || typeof str !== 'string') return str;
  return str.replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m));
}

export function t(key, params) {
  let value = lookup(DICTS[current], key);
  if (value === undefined && current !== DEFAULT_LANG) {
    value = lookup(DICTS[DEFAULT_LANG], key);
  }
  if (value === undefined) return key;
  return interpolate(value, params);
}
