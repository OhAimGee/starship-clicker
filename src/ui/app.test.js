import { describe, it, expect } from 'vitest';
import { nextTabForSwipe } from './app.js';

const TABS = ['shop', 'fleet', 'exploration', 'technology', 'ascension'];

describe('nextTabForSwipe', () => {
  it('swipe vers la gauche (dx négatif) -> onglet suivant', () => {
    expect(nextTabForSwipe(TABS, 'fleet', -80, 0)).toBe('exploration');
  });

  it('swipe vers la droite (dx positif) -> onglet précédent', () => {
    expect(nextTabForSwipe(TABS, 'fleet', 80, 0)).toBe('shop');
  });

  it('ignore un déplacement horizontal trop court', () => {
    expect(nextTabForSwipe(TABS, 'fleet', 30, 0)).toBeNull();
  });

  it('ignore un geste trop vertical (défilement de liste)', () => {
    expect(nextTabForSwipe(TABS, 'fleet', 80, 90)).toBeNull();
  });

  it('ne dépasse pas la borne de droite (dernier onglet)', () => {
    expect(nextTabForSwipe(TABS, 'ascension', -80, 0)).toBeNull();
  });

  it('ne dépasse pas la borne de gauche (premier onglet)', () => {
    expect(nextTabForSwipe(TABS, 'shop', 80, 0)).toBeNull();
  });
});
