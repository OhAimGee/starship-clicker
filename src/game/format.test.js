import { describe, it, expect } from 'vitest';
import { formatNumber } from './format.js';

describe('formatNumber', () => {
  it('rend "0" pour zéro (et non "0.00")', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('rend les petits entiers sans décimales', () => {
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(999)).toBe('999');
  });

  it('abrège avec K / M / B / T', () => {
    expect(formatNumber(1234)).toBe('1.23K');
    expect(formatNumber(5_000_000)).toBe('5.00M');
    expect(formatNumber(2_500_000_000)).toBe('2.50B');
    expect(formatNumber(1e12)).toBe('1.00T');
  });

  it('continue au-delà de 1e12 (ancien plafond)', () => {
    expect(formatNumber(1e15)).toBe('1.00aa');
    expect(formatNumber(1e18)).toBe('1.00ab');
  });

  it('bascule en notation scientifique pour les nombres extrêmes', () => {
    expect(formatNumber(1e50)).toMatch(/^1\.00e\+?50$/);
  });

  it('gère les valeurs invalides', () => {
    expect(formatNumber(NaN)).toBe('0');
    expect(formatNumber(Infinity)).toBe('0');
    expect(formatNumber(undefined)).toBe('0');
  });

  it('gère les fractions et les négatifs', () => {
    expect(formatNumber(0.5)).toBe('0.50');
    expect(formatNumber(-1500)).toBe('-1.50K');
  });
});
