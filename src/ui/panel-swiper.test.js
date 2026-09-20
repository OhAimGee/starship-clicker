import { describe, it, expect } from 'vitest';
import { nextTabForDrag } from './panel-swiper.js';

const TABS = ['shop', 'fleet', 'exploration', 'technology', 'ascension'];

describe('nextTabForDrag', () => {
  it('un swipe vers la gauche ouvre le terminal suivant', () => {
    expect(nextTabForDrag(TABS, 'shop', { dx: -80, dy: 5, dt: 300 })).toBe('fleet');
    expect(nextTabForDrag(TABS, 'exploration', { dx: -80, dy: 0, dt: 300 })).toBe(
      'technology'
    );
  });

  it('un swipe vers la droite ouvre le terminal précédent', () => {
    expect(nextTabForDrag(TABS, 'fleet', { dx: 80, dy: 0, dt: 300 })).toBe('shop');
  });

  it('ignore un geste plus court que le seuil de 45 px s’il est lent', () => {
    expect(nextTabForDrag(TABS, 'fleet', { dx: -44, dy: 0, dt: 400 })).toBeNull();
    expect(nextTabForDrag(TABS, 'fleet', { dx: -45, dy: 0, dt: 400 })).toBe(
      'exploration'
    );
  });

  it('un geste court mais rapide (flick) bascule quand même', () => {
    expect(nextTabForDrag(TABS, 'fleet', { dx: -30, dy: 0, dt: 40 })).toBe(
      'exploration'
    );
    // Trop court même pour un flick : c'est un tap qui a bougé.
    expect(nextTabForDrag(TABS, 'fleet', { dx: -10, dy: 0, dt: 5 })).toBeNull();
  });

  it('ignore un geste plutôt vertical (défilement de liste)', () => {
    expect(nextTabForDrag(TABS, 'fleet', { dx: -60, dy: 90, dt: 200 })).toBeNull();
    expect(nextTabForDrag(TABS, 'fleet', { dx: -60, dy: 60, dt: 200 })).toBeNull();
  });

  it('ne dépasse pas les extrémités', () => {
    expect(nextTabForDrag(TABS, 'shop', { dx: 120, dy: 0, dt: 200 })).toBeNull();
    expect(nextTabForDrag(TABS, 'ascension', { dx: -120, dy: 0, dt: 200 })).toBeNull();
  });

  it('gère une durée nulle sans diviser par zéro', () => {
    expect(nextTabForDrag(TABS, 'fleet', { dx: -30, dy: 0, dt: 0 })).toBeNull();
    expect(nextTabForDrag(TABS, 'fleet', { dx: -60, dy: 0, dt: 0 })).toBe('exploration');
  });
});
