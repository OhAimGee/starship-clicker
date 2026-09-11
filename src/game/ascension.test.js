// Tests d'intégration (niveau Engine) pour la vraie Ascension — complète
// prestige.test.js (fonctions pures) en vérifiant les événements et le
// câblage Engine#ascend / Engine#chooseAscensionReward.

import { describe, it, expect } from 'vitest';
import { Engine } from './engine.js';
import { createInitialState } from './initial-state.js';
import { grossProduction } from './economy.js';
import { CONFIG } from '../data/config.js';
import { ASCENSION_REWARD_IDS } from '../data/ascensionRewards.js';

function readyToAscend() {
  const e = new Engine(createInitialState());
  e.selectFaction('ironLegion');
  e.state.prestige.factions.ironLegion.level =
    CONFIG.ascension.factionLevelThreshold;
  e.state.prestige.factions.ironLegion.skills.shipyards.level = 3;
  e.state.prestige.factions.miningCollective.level = 2;
  e.state.prestige.factions.miningCollective.skills.deepCoreDrilling.level = 1;
  e.state.prestige.upgrades.prestigeProduction.level = 4;
  e.state.resources.ascensionPoints = 42;
  return e;
}

describe('Engine — ascend (seuil)', () => {
  it('refuse sous le seuil, réussit au seuil', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion');
    e.state.prestige.factions.ironLegion.level =
      CONFIG.ascension.factionLevelThreshold - 1;
    expect(e.ascend()).toBe(false);

    e.state.prestige.factions.ironLegion.level =
      CONFIG.ascension.factionLevelThreshold;
    expect(e.ascend()).toBe(true);
  });

  it('émet "ascend-choice" avec 3 options valides', () => {
    const e = readyToAscend();
    let payload;
    e.on('ascend-choice', (p) => (payload = p));
    expect(e.ascend()).toBe(true);
    expect(payload.options).toHaveLength(3);
    for (const id of payload.options) expect(ASCENSION_REWARD_IDS).toContain(id);
  });
});

describe('Engine — ascend (New Game+)', () => {
  it('remet à 0 le niveau et les compétences de TOUTES les factions, pas seulement l’active', () => {
    const e = readyToAscend();
    e.ascend();
    for (const factionId of Object.keys(e.state.prestige.factions)) {
      const entry = e.state.prestige.factions[factionId];
      expect(entry.level, factionId).toBe(0);
      for (const skill of Object.values(entry.skills)) {
        expect(skill.level).toBe(0);
      }
    }
  });

  it('laisse l’arbre commun et les PA déjà investis intacts', () => {
    const e = readyToAscend();
    e.ascend();
    expect(e.state.prestige.upgrades.prestigeProduction.level).toBe(4);
  });

  it('incrémente state.ascension.count', () => {
    const e = readyToAscend();
    expect(e.state.ascension.count).toBe(0);
    e.ascend();
    expect(e.state.ascension.count).toBe(1);
  });
});

describe('Engine — chooseAscensionReward', () => {
  it('applique la récompense choisie et redéclenche la sélection de faction', () => {
    const e = readyToAscend();
    let options;
    e.on('ascend-choice', (p) => (options = p.options));
    e.ascend();
    const chosenId = options[0];

    expect(e.chooseAscensionReward(chosenId)).toBe(true);
    expect(e.state.ascension.rewards[chosenId].level).toBe(1);
    expect(e.state.run.factionId).toBeNull(); // faction à re-sélectionner
  });

  it('échoue sur un id de récompense inconnu', () => {
    const e = readyToAscend();
    e.ascend();
    expect(e.chooseAscensionReward('nope')).toBe(false);
  });

  it('la récompense choisie est mesurable dans la production', () => {
    const withoutReward = createInitialState();
    withoutReward.generators.solarPanel.count = 10;
    const before = grossProduction(withoutReward).energy;

    const withReward = createInitialState();
    withReward.generators.solarPanel.count = 10;
    withReward.ascension.rewards.hyperProduction.level = 1; // +50% production
    const after = grossProduction(withReward).energy;

    expect(after).toBeCloseTo(before * 1.5);
  });
});

describe('Engine — récompense d’Ascension persiste après un endRun() ultérieur', () => {
  it('reste au même niveau après avoir terminé une nouvelle run', () => {
    const e = readyToAscend();
    let options;
    e.on('ascend-choice', (p) => (options = p.options));
    e.ascend();
    const chosenId = options[0];
    e.chooseAscensionReward(chosenId);

    e.selectFaction('quantumOrder');
    // Force l'objectif à être rempli immédiatement pour pouvoir terminer la run.
    e.state.run.objective = { type: 'gatherResources', resource: 'energy', target: 0 };
    expect(e.canEndRun()).toBe(true);
    expect(e.endRun()).toBe(true);

    expect(e.state.ascension.rewards[chosenId].level).toBe(1);
  });
});
