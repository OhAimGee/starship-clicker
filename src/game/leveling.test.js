import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import { endRun, ascend } from './prestige.js';
import { xpForLevel, grantXp } from './leveling.js';
import { CONFIG } from '../data/config.js';

describe('xpForLevel', () => {
  it('grandit avec le niveau', () => {
    expect(xpForLevel(1)).toBeGreaterThan(xpForLevel(0));
    expect(xpForLevel(5)).toBeGreaterThan(xpForLevel(1));
  });
});

describe('grantXp', () => {
  it('ajoute de l’XP sans passage de niveau', () => {
    const s = createInitialState();
    const result = grantXp(s, 1);
    expect(result.leveledUp).toBe(false);
    expect(s.prestige.player.level).toBe(0);
    expect(s.prestige.player.xp).toBe(1);
  });

  it('passe un niveau une fois le seuil atteint, garde le surplus', () => {
    const s = createInitialState();
    const need = xpForLevel(0);
    const result = grantXp(s, need + 3);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(1);
    expect(s.prestige.player.level).toBe(1);
    expect(s.prestige.player.xp).toBe(3);
  });

  it('peut monter plusieurs niveaux d’un seul coup', () => {
    const s = createInitialState();
    const big = xpForLevel(0) + xpForLevel(1) + xpForLevel(2) + 1;
    const result = grantXp(s, big);
    expect(result.leveledUp).toBe(true);
    expect(s.prestige.player.level).toBe(3);
    expect(s.prestige.player.xp).toBe(1);
  });

  it('un montant nul ou négatif ne fait rien', () => {
    const s = createInitialState();
    expect(grantXp(s, 0).leveledUp).toBe(false);
    expect(s.prestige.player.xp).toBe(0);
  });
});

describe('persistance du niveau de joueur', () => {
  it('survit à endRun()', () => {
    const s = createInitialState();
    startRun(s, 'ironLegion');
    grantXp(s, xpForLevel(0) + 5);
    expect(s.prestige.player.level).toBe(1);
    endRun(s);
    expect(s.prestige.player.level).toBe(1);
  });

  it('repart à zéro avec ascend()', () => {
    const s = createInitialState();
    s.prestige.factions.ironLegion.level = CONFIG.ascension.factionLevelThreshold;
    startRun(s, 'ironLegion');
    grantXp(s, xpForLevel(0) + 5);
    expect(s.prestige.player.level).toBe(1);
    ascend(s);
    expect(s.prestige.player.level).toBe(0);
    expect(s.prestige.player.xp).toBe(0);
  });
});
