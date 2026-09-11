import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import {
  canEndRun,
  endRun,
  potentialPoints,
  canAscend,
  ascend,
  applyAscensionReward,
} from './prestige.js';
import { CONFIG } from '../data/config.js';
import { ASCENSION_REWARD_IDS } from '../data/ascensionRewards.js';

function advancedState() {
  const s = createInitialState();
  s.resources.quantumEnergy = 3500;
  s.resources.energy = 1e6;
  s.resources.ascensionPoints = 4;
  s.generators.solarPanel.count = 50;
  s.ships.fighters.count = 20;
  s.clickPowerBase = 12;
  s.clickUpgrades.clickPower.level = 11;
  s.technologies.quantumComputing.unlocked = true;
  s.technologies.warpDrive.unlocked = true;
  s.totalProduced.energy = 5e6;
  s.run.exploration.advancedUnlocked = true;
  s.run.exploration.conquered = [
    { name: 'X', archetype: 'a', rewards: { energy: 1 }, defenseRating: 1 },
  ];
  return s;
}

describe('canEndRun / potentialPoints', () => {
  it('suit l’objectif de run, plus du tout quantumEnergy', () => {
    const s = createInitialState();
    s.run.objective = { type: 'conquerAll', target: 1, defenseMult: 1 };
    expect(canEndRun(s)).toBe(false);
    s.run.exploration.conquered = [{ name: 'X' }];
    expect(canEndRun(s)).toBe(true);
    // même sans la moindre quantumEnergy
    expect(s.resources.quantumEnergy).toBe(0);
  });

  it('points = floor(quantumEnergy / divisor) — conservé comme bonus optionnel', () => {
    const s = createInitialState();
    s.resources.quantumEnergy = 3500;
    expect(potentialPoints(s)).toBe(3);
  });
});

describe('endRun', () => {
  it('accorde les points et incrémente le compteur de runs terminées', () => {
    const s = advancedState();
    const { points } = endRun(s);
    expect(points).toBe(3);
    expect(s.prestige.ascensions).toBe(1);
    expect(s.resources.ascensionPoints).toBe(4 + 3);
  });

  it('remet à zéro générateurs, flotte, cumul produit et énergie', () => {
    const s = advancedState();
    endRun(s);
    expect(s.generators.solarPanel.count).toBe(0);
    expect(s.ships.fighters.count).toBe(0);
    expect(s.totalProduced.energy).toBe(0);
    expect(s.clickPowerBase).toBe(1);
    expect(s.clickUpgrades.clickPower.level).toBe(0);
    expect(s.run.exploration.conquered).toHaveLength(0);
  });

  it('conserve technos, améliorations de prestige et lifetime', () => {
    const s = advancedState();
    s.prestige.upgrades.prestigeProduction.level = 5;
    endRun(s);
    expect(s.technologies.quantumComputing.unlocked).toBe(true);
    expect(s.prestige.upgrades.prestigeProduction.level).toBe(5);
    expect(s.prestige.lifetime.energy).toBe(5e6);
    // warpDrive conservé -> systèmes avancés toujours débloqués
    expect(s.run.exploration.advancedUnlocked).toBe(true);
  });

  it('accorde un capital de redémarrage proportionnel aux runs terminées', () => {
    const s = advancedState();
    endRun(s);
    expect(s.resources.energy).toBe(CONFIG.ascension.restartGrant.energy * 1);
  });
});

describe('endRun — faction & run', () => {
  it('incrémente le niveau de la faction active (pas ses compétences), vide la run', () => {
    const s = advancedState();
    s.run.factionId = 'ironLegion';
    s.prestige.factions.ironLegion.skills.shipyards.level = 2;
    s.run.buffs = [{ type: 'fleetMultiplier', perLevel: 1 }];
    s.run.skillPoints = 4;
    endRun(s);
    expect(s.prestige.factions.ironLegion.level).toBe(1);
    expect(s.prestige.factions.ironLegion.skills.shipyards.level).toBe(2);
    expect(s.run.factionId).toBeNull();
    expect(s.run.objective).toBeNull();
    expect(s.run.buffs).toEqual([]);
    expect(s.run.skillPoints).toBe(0);
  });

  it('fin de run anticipée (objectif non atteint) : pas de bonus de PA', () => {
    const s = advancedState();
    s.run.factionId = 'ironLegion';
    s.run.objective = { type: 'conquerAll', target: 99, defenseMult: 1 };
    s.run.skillPoints = 10;
    const before = s.resources.ascensionPoints;
    const { points, objectiveComplete } = endRun(s);
    expect(objectiveComplete).toBe(false);
    expect(s.resources.ascensionPoints).toBe(before + points);
  });

  it('objectif atteint : bonus de PA proportionnel aux points de run', () => {
    const s = advancedState();
    s.run.factionId = 'ironLegion';
    s.run.objective = { type: 'conquerAll', target: 1, defenseMult: 1 };
    s.run.exploration.conquered = [{ name: 'X' }];
    s.run.skillPoints = 10; // *0.5 => +5 PA
    const before = s.resources.ascensionPoints;
    const { points, objectiveComplete } = endRun(s);
    expect(objectiveComplete).toBe(true);
    expect(s.resources.ascensionPoints).toBe(before + points + 5);
  });
});

describe('canAscend', () => {
  it('faux sans faction active, même à niveau élevé', () => {
    const s = createInitialState();
    s.prestige.factions.ironLegion.level = 99;
    expect(canAscend(s)).toBe(false);
  });

  it('faux sous le seuil, vrai au seuil', () => {
    const s = createInitialState();
    s.run.factionId = 'ironLegion';
    s.prestige.factions.ironLegion.level =
      CONFIG.ascension.factionLevelThreshold - 1;
    expect(canAscend(s)).toBe(false);
    s.prestige.factions.ironLegion.level = CONFIG.ascension.factionLevelThreshold;
    expect(canAscend(s)).toBe(true);
  });

  it('indépendant de l’objectif de run en cours', () => {
    const s = createInitialState();
    s.run.factionId = 'ironLegion';
    s.prestige.factions.ironLegion.level = CONFIG.ascension.factionLevelThreshold;
    s.run.objective = { type: 'conquerAll', target: 99, defenseMult: 1 };
    expect(canAscend(s)).toBe(true);
  });
});

describe('ascend — New Game+', () => {
  function readyState() {
    const s = advancedState();
    s.run.factionId = 'ironLegion';
    s.prestige.factions.ironLegion.level = CONFIG.ascension.factionLevelThreshold;
    s.prestige.factions.ironLegion.skills.shipyards.level = 3;
    s.prestige.factions.miningCollective.level = 2;
    s.prestige.factions.miningCollective.skills.deepCoreDrilling.level = 1;
    s.prestige.upgrades.prestigeProduction.level = 4;
    s.resources.ascensionPoints = 42;
    return s;
  }

  it('remet à zéro le niveau et les compétences de TOUTES les factions', () => {
    const s = readyState();
    ascend(s);
    for (const factionId of Object.keys(s.prestige.factions)) {
      const entry = s.prestige.factions[factionId];
      expect(entry.level, factionId).toBe(0);
      for (const skill of Object.values(entry.skills)) {
        expect(skill.level).toBe(0);
      }
    }
  });

  it('ne touche pas l’arbre commun ni les PA déjà investis dedans', () => {
    const s = readyState();
    ascend(s);
    expect(s.prestige.upgrades.prestigeProduction.level).toBe(4);
  });

  it('incrémente state.ascension.count et termine la run', () => {
    const s = readyState();
    expect(s.ascension.count).toBe(0);
    ascend(s);
    expect(s.ascension.count).toBe(1);
    expect(s.run.factionId).toBeNull();
  });

  it('renvoie 3 options de récompense valides', () => {
    const s = readyState();
    const { options } = ascend(s);
    expect(options).toHaveLength(3);
    expect(new Set(options).size).toBe(3); // pas de doublon
    for (const id of options) expect(ASCENSION_REWARD_IDS).toContain(id);
  });
});

describe('applyAscensionReward', () => {
  it('monte le niveau de la récompense choisie, échoue sur un id inconnu', () => {
    const s = createInitialState();
    const id = ASCENSION_REWARD_IDS[0];
    expect(applyAscensionReward(s, 'nope')).toBe(false);
    expect(applyAscensionReward(s, id)).toBe(true);
    expect(s.ascension.rewards[id].level).toBe(1);
    expect(applyAscensionReward(s, id)).toBe(true);
    expect(s.ascension.rewards[id].level).toBe(2);
  });

  it('survit à un endRun() ultérieur', () => {
    const s = createInitialState();
    const id = ASCENSION_REWARD_IDS[0];
    applyAscensionReward(s, id);
    s.run.factionId = 'ironLegion';
    endRun(s);
    expect(s.ascension.rewards[id].level).toBe(1);
  });
});
