import { describe, it, expect, beforeEach } from 'vitest';
import { fr } from './fr.js';
import { en } from './en.js';
import { t, setLang, getLang } from './index.js';
import { GENERATOR_IDS } from '../data/generators.js';
import { SHIP_IDS } from '../data/fleet.js';
import { TECH_IDS } from '../data/technologies.js';
import { RESOURCE_IDS } from '../data/resources.js';

function paths(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object') out.push(...paths(v, p));
    else out.push(p);
  }
  return out;
}

describe('parité des dictionnaires', () => {
  it('fr et en ont exactement les mêmes clés', () => {
    const frKeys = paths(fr).sort();
    const enKeys = paths(en).sort();
    expect(enKeys).toEqual(frKeys);
  });
});

describe('couverture des données', () => {
  const hasBoth = (ns, id) => fr[ns]?.[id]?.name && en[ns]?.[id]?.name;
  it('chaque générateur, vaisseau et techno a un nom fr + en', () => {
    for (const id of GENERATOR_IDS)
      expect(hasBoth('generator', id), id).toBeTruthy();
    for (const id of SHIP_IDS) expect(hasBoth('ship', id), id).toBeTruthy();
    for (const id of TECH_IDS) expect(hasBoth('tech', id), id).toBeTruthy();
  });
  it('chaque ressource est nommée', () => {
    for (const id of RESOURCE_IDS) {
      expect(fr.resource[id], id).toBeTruthy();
      expect(en.resource[id], id).toBeTruthy();
    }
  });
});

describe('t()', () => {
  beforeEach(() => setLang('fr'));

  it('résout une clé pointée', () => {
    expect(t('resource.energy')).toBe('Énergie');
  });

  it('interpole les paramètres', () => {
    expect(t('ui.perClick', { n: 5 })).toBe('+5 ⚡ par clic');
  });

  it('change de langue', () => {
    setLang('en');
    expect(getLang()).toBe('en');
    expect(t('resource.energy')).toBe('Energy');
  });

  it('retourne la clé si absente', () => {
    expect(t('rien.du.tout')).toBe('rien.du.tout');
  });
});
