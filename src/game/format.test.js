import { describe, it, expect } from 'vitest';
import { formatNumber, formatRateNumber } from './format.js';

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

describe('formatRateNumber', () => {
  it('garde les décimales entre 1 et 999 (formatNumber les tronque)', () => {
    expect(formatRateNumber(1.05)).toBe('1.05');
    expect(formatRateNumber(1.95)).toBe('1.95');
    expect(formatRateNumber(12.5)).toBe('12.50');
    expect(formatRateNumber(0.05)).toBe('0.05');
  });

  it('affiche les valeurs entières sans décimales', () => {
    expect(formatRateNumber(0)).toBe('0');
    expect(formatRateNumber(1)).toBe('1');
    expect(formatRateNumber(40)).toBe('40');
    expect(formatRateNumber(999)).toBe('999');
  });

  it('absorbe le bruit flottant (0.05 × 39 = 1.9500000000000002)', () => {
    expect(formatRateNumber(0.05 * 39)).toBe('1.95');
    expect(formatRateNumber(0.05 * 20)).toBe('1');
    expect(formatRateNumber(0.1 + 0.2)).toBe('0.30');
  });

  it('gère les négatifs (maintenance > production)', () => {
    expect(formatRateNumber(-1.5)).toBe('-1.50');
    expect(formatRateNumber(-3)).toBe('-3');
  });

  it('abrège à partir de 1000 comme formatNumber', () => {
    expect(formatRateNumber(1234)).toBe('1.23K');
    expect(formatRateNumber(5_000_000)).toBe('5.00M');
  });

  it('gère les valeurs invalides', () => {
    expect(formatRateNumber(NaN)).toBe('0');
    expect(formatRateNumber(undefined)).toBe('0');
  });
});
