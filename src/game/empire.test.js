// Grands Chantiers : mégastructures, décrets du Sénat, négociation avec les
// Sentinelles et choix du chapitre 2.

import { describe, it, expect } from 'vitest';
import { Engine } from './engine.js';
import { createInitialState } from './initial-state.js';
import {
  grossProduction,
  fleetPower,
  fleetMaintenance,
  shipCost,
  clickPower,
  empireMultipliers,
  lootMultiplier,
} from './economy.js';
import { fleetDurabilityMultiplier } from './combat.js';
import { endRun } from './prestige.js';
import {
  megastructureCost,
  decreeSlots,
  decreesUnlocked,
  megastructuresUnlocked,
} from './empire.js';
import { canNegotiate, negotiationCost } from './diplomacy.js';
import { enemyProfileId } from './enemy-fleet.js';
import { CONFIG } from '../data/config.js';
import { MEGASTRUCTURES } from '../data/megastructures.js';
import { DECREES } from '../data/decrees.js';

const learn = (engine, ...techs) => {
  for (const id of techs) engine.state.technologies[id].unlocked = true;
};

describe('mégastructures — effets', () => {
  it('la Sphère de Dyson multiplie l’énergie seulement, niveau par niveau', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10;
    s.generators.miningDrone.count = 10;
    const before = grossProduction(s);
    s.run.megastructures.dysonSphere.level = 2;
    const after = grossProduction(s);
    expect(after.energy).toBeCloseTo(before.energy * 2); // +50 % × 2 niveaux
    expect(after.metal).toBeCloseTo(before.metal);
  });

  it('l’Ascenseur orbital baisse le coût des vaisseaux', () => {
    const s = createInitialState();
    const before = shipCost(s, 'fighters');
    s.run.megastructures.orbitalElevator.level = 3;
    const after = shipCost(s, 'fighters');
    for (const res of Object.keys(before)) {
      expect(after[res]).toBeCloseTo(before[res] * (1 - 3 * 0.08), 0);
    }
  });

  it('le Chantier amiral augmente les PV, pas la puissance de feu', () => {
    const s = createInitialState();
    s.ships.fighters.count = 10;
    const power = fleetPower(s);
    const before = fleetDurabilityMultiplier(s);
    s.run.megastructures.flagshipYard.level = 2;
    expect(fleetDurabilityMultiplier(s)).toBeCloseTo(before * 1.3);
    expect(fleetPower(s)).toBe(power);
  });

  it('l’Anneau-monde renforce le revenu passif des systèmes conquis', () => {
    const s = createInitialState();
    s.run.exploration.conquered = [{ rewards: { energy: 1000 } }];
    const before = grossProduction(s).energy;
    s.run.megastructures.ringWorld.level = 1;
    expect(grossProduction(s).energy).toBeCloseTo(before * 1.6);
  });

  it('un état sans blocs de chantiers/décrets (ancienne sauvegarde) reste neutre', () => {
    const s = createInitialState();
    delete s.run.megastructures;
    delete s.run.decrees;
    const m = empireMultipliers(s);
    expect(m.production).toBe(1);
    expect(m.fleet).toBe(1);
    expect(m.loot).toBe(1);
  });
});

describe('mégastructures — construction', () => {
  const rich = () => {
    const e = new Engine(createInitialState());
    for (const res of Object.keys(e.state.resources)) {
      e.state.resources[res] = 1e15;
      e.state.totalProduced[res] = 1e15;
    }
    return e;
  };

  it('exige la technologie Ingénierie des mégastructures', () => {
    const e = rich();
    expect(megastructuresUnlocked(e.state)).toBe(false);
    expect(e.buildMegastructure('dysonSphere')).toBe(false);
    learn(e, 'megastructureEngineering');
    expect(e.buildMegastructure('dysonSphere')).toBe(true);
    expect(e.state.run.megastructures.dysonSphere.level).toBe(1);
  });

  it('débite tous les coûts, le prix monte à chaque niveau et plafonne au niveau max', () => {
    const e = rich();
    learn(e, 'megastructureEngineering');
    const def = MEGASTRUCTURES.find((m) => m.id === 'dysonSphere');
    const first = megastructureCost(e.state, 'dysonSphere');
    const stock = { ...e.state.resources };
    e.buildMegastructure('dysonSphere');
    for (const [res, amount] of Object.entries(first)) {
      expect(e.state.resources[res]).toBe(stock[res] - amount);
    }
    const second = megastructureCost(e.state, 'dysonSphere');
    for (const res of Object.keys(first)) {
      expect(second[res]).toBeGreaterThan(first[res]);
    }
    for (let i = 1; i < def.maxLevel; i++) e.buildMegastructure('dysonSphere');
    expect(e.state.run.megastructures.dysonSphere.level).toBe(def.maxLevel);
    expect(megastructureCost(e.state, 'dysonSphere')).toBeNull();
    expect(e.buildMegastructure('dysonSphere')).toBe(false);
  });

  it('refuse sans les ressources ou tant que la ligne n’est pas débloquée', () => {
    const e = new Engine(createInitialState());
    learn(e, 'megastructureEngineering');
    expect(e.buildMegastructure('dysonSphere')).toBe(false); // ni ressources ni déblocage
    for (const res of Object.keys(e.state.resources)) e.state.resources[res] = 1e15;
    expect(e.buildMegastructure('dysonSphere')).toBe(false); // cumul d'énergie insuffisant
    e.state.totalProduced.energy = 1e15;
    expect(e.buildMegastructure('dysonSphere')).toBe(true);
    expect(e.buildMegastructure('inconnue')).toBe(false);
  });

  it('le succès « Bâtisseur » se débloque, « Architecte » exige tous les niveaux max', () => {
    const e = rich();
    learn(e, 'megastructureEngineering');
    e.buildMegastructure('dysonSphere');
    e.tick(1);
    expect(e.state.achievements.firstMegastructure.unlocked).toBe(true);
    expect(e.state.achievements.wonderBuilder.unlocked).toBe(false);
    for (const m of MEGASTRUCTURES) e.state.run.megastructures[m.id].level = m.maxLevel;
    e.tick(1);
    expect(e.state.achievements.wonderBuilder.unlocked).toBe(true);
  });

  it('les chantiers et les décrets sont remis à zéro par la fin de run', () => {
    const e = rich();
    learn(e, 'megastructureEngineering', 'spaceDiplomacy');
    e.buildMegastructure('dysonSphere');
    e.adoptDecree('mobilization');
    endRun(e.state);
    expect(e.state.run.megastructures.dysonSphere.level).toBe(0);
    expect(e.state.run.decrees).toEqual([]);
    // Les technologies, elles, sont conservées.
    expect(megastructuresUnlocked(e.state)).toBe(true);
  });
});

describe('décrets du Sénat', () => {
  const senate = (influence = 1000) => {
    const e = new Engine(createInitialState());
    e.state.resources.influence = influence;
    learn(e, 'spaceDiplomacy');
    return e;
  };

  it('exigent la Diplomatie spatiale', () => {
    const e = new Engine(createInitialState());
    e.state.resources.influence = 1000;
    expect(decreesUnlocked(e.state)).toBe(false);
    expect(e.adoptDecree('mobilization')).toBe(false);
    learn(e, 'spaceDiplomacy');
    expect(e.adoptDecree('mobilization')).toBe(true);
  });

  it('se paient en influence, occupent un emplacement et ne s’adoptent pas deux fois', () => {
    const e = senate();
    const cost = DECREES.find((d) => d.id === 'mobilization').cost.influence;
    expect(e.adoptDecree('mobilization')).toBe(true);
    expect(e.state.resources.influence).toBe(1000 - cost);
    expect(e.state.run.decrees).toEqual(['mobilization']);
    expect(e.adoptDecree('mobilization')).toBe(false);
    expect(e.state.resources.influence).toBe(1000 - cost);
  });

  it('les emplacements sont limités ; la Constitution galactique en ajoute un', () => {
    const e = senate();
    expect(decreeSlots(e.state)).toBe(CONFIG.decrees.baseSlots);
    expect(e.adoptDecree('mobilization')).toBe(true);
    expect(e.adoptDecree('austerity')).toBe(true);
    expect(e.adoptDecree('warEconomy')).toBe(false); // plein
    learn(e, 'galacticConstitution');
    expect(decreeSlots(e.state)).toBe(CONFIG.decrees.baseSlots + 1);
    expect(e.adoptDecree('warEconomy')).toBe(true);
    expect(e.state.run.decrees).toHaveLength(3);
  });

  it('refusent sans assez d’influence', () => {
    const e = senate(5);
    expect(e.adoptDecree('mobilization')).toBe(false);
    expect(e.state.run.decrees).toEqual([]);
    expect(e.state.resources.influence).toBe(5);
  });

  it('abroger est gratuit et libère l’emplacement ; ré-adopter se paie de nouveau', () => {
    const e = senate();
    e.adoptDecree('mobilization');
    e.adoptDecree('austerity');
    const afterTwo = e.state.resources.influence;
    expect(e.abrogateDecree('mobilization')).toBe(true);
    expect(e.state.resources.influence).toBe(afterTwo);
    expect(e.abrogateDecree('mobilization')).toBe(false); // déjà abrogé
    expect(e.adoptDecree('warEconomy')).toBe(true);
    const cost = DECREES.find((d) => d.id === 'mobilization').cost.influence;
    const before = e.state.resources.influence;
    e.abrogateDecree('warEconomy');
    e.adoptDecree('mobilization');
    expect(e.state.resources.influence).toBe(before - cost);
  });

  it('Mobilisation : flotte plus puissante, production plus faible', () => {
    const s = createInitialState();
    s.ships.fighters.count = 100;
    s.generators.solarPanel.count = 10;
    const power = fleetPower(s);
    const prod = grossProduction(s).energy;
    s.run.decrees = ['mobilization'];
    expect(fleetPower(s)).toBe(Math.floor(power * 1.3));
    expect(grossProduction(s).energy).toBeCloseTo(prod * 0.85);
  });

  it('Économie de guerre : la maintenance augmente ; Austérité : elle baisse', () => {
    const s = createInitialState();
    s.ships.fighters.count = 100;
    const base = fleetMaintenance(s);
    s.run.decrees = ['warEconomy'];
    expect(fleetMaintenance(s)).toBeCloseTo(base * 1.4);
    s.run.decrees = ['austerity'];
    expect(fleetMaintenance(s)).toBeCloseTo(base * 0.65);
  });

  it('Propagande : le clic vaut plus', () => {
    const s = createInitialState();
    s.clickPowerBase = 100;
    const base = clickPower(s);
    s.run.decrees = ['propaganda'];
    expect(clickPower(s)).toBe(Math.floor(base * 1.75));
  });

  it('Loi martiale : PV ×1,4 mais revenu des systèmes réduit de moitié', () => {
    const s = createInitialState();
    s.run.exploration.conquered = [{ rewards: { energy: 1000 } }];
    const income = grossProduction(s).energy;
    const hp = fleetDurabilityMultiplier(s);
    s.run.decrees = ['martialLaw'];
    expect(fleetDurabilityMultiplier(s)).toBeCloseTo(hp * 1.4);
    expect(grossProduction(s).energy).toBeCloseTo(income * 0.5);
  });

  it('ignore un décret inconnu (retiré d’une version ultérieure)', () => {
    const s = createInitialState();
    s.run.decrees = ['decretFantome'];
    expect(empireMultipliers(s).production).toBe(1);
  });

  it('le succès « Législateur » se débloque à la première adoption', () => {
    const e = senate();
    e.adoptDecree('mobilization');
    e.tick(1);
    expect(e.state.achievements.firstDecree.unlocked).toBe(true);
  });
});

describe('technologies des Grands Chantiers', () => {
  it('Blindage composite : PV +25 % (technologie), sans toucher à l’attaque', () => {
    const s = createInitialState();
    s.ships.fighters.count = 10;
    const power = fleetPower(s);
    const before = fleetDurabilityMultiplier(s);
    s.technologies.compositeArmor.unlocked = true;
    expect(fleetDurabilityMultiplier(s)).toBeCloseTo(before * 1.25);
    expect(fleetPower(s)).toBe(power);
  });

  it('Logistique orbitale : butin ×1,4 et maintenance −10 %', () => {
    const s = createInitialState();
    s.ships.fighters.count = 100;
    const maint = fleetMaintenance(s);
    expect(lootMultiplier(s)).toBe(1);
    s.technologies.orbitalLogistics.unlocked = true;
    expect(lootMultiplier(s)).toBeCloseTo(1.4);
    expect(fleetMaintenance(s)).toBeCloseTo(maint * 0.9);
  });

  it('le butin cumule technologie, décret et buffs de run', () => {
    const s = createInitialState();
    s.technologies.orbitalLogistics.unlocked = true; // ×1,4
    s.run.decrees = ['plunderRights']; // +60 %
    s.run.buffs.push({ type: 'lootMultiplier', perLevel: 0.25 }); // +25 %
    expect(lootMultiplier(s)).toBeCloseTo(1.4 * 1.6 * 1.25);
  });
});

// ─── Sentinelles, négociation, choix du chapitre 2 ───────────────────────────

/** Moteur avec le Bastion des Sentinelles (système 9, avancé) à portée. */
function bastionEngine() {
  const e = new Engine(createInitialState());
  e.state.technologies.warpDrive.unlocked = true;
  e.state.run.exploration.advancedUnlocked = true;
  e.state.prestige.player.level = 50;
  e.selectFaction('ironLegion');
  e.state.ships.fighters.count = 5_000_000;
  learn(e, 'spaceDiplomacy', 'xenoColonization');
  expect(e.openSystem(9)).toBe(true);
  const system = e.activeSystem();
  const boss = system.planets.find((p) => p.boss === 'sentinelBastion');
  return { e, system, boss };
}

describe('Sentinelles — profil ennemi', () => {
  it('occupent les forteresses galactiques ; le système 0 reste à l’Essaim', () => {
    const planet = { id: '3-0', type: 'invaded' };
    expect(
      enemyProfileId({ index: 3, advanced: true, archetype: 'galacticFortress' }, planet)
    ).toBe('sentinels');
    expect(
      enemyProfileId({ index: 0, advanced: true, archetype: 'galacticFortress' }, planet)
    ).toBe('swarm');
    expect(
      enemyProfileId({ index: 3, advanced: true, archetype: 'galacticFortress' }, {
        id: '3-1',
        type: 'hostile',
      })
    ).toBe('wilds');
  });

  it('ne concernent que les systèmes avancés', () => {
    for (let i = 0; i < 200; i++) {
      const planet = { id: `4-${i}`, type: 'invaded' };
      const profile = enemyProfileId({ index: 4, advanced: false, archetype: 'mining' }, planet);
      expect(profile).not.toBe('sentinels');
    }
  });

  it('une part des planètes d’un système avancé ordinaire leur revient', () => {
    let sentinels = 0;
    for (let i = 0; i < 400; i++) {
      const planet = { id: `5-${i}`, type: 'invaded' };
      if (enemyProfileId({ index: 5, advanced: true, archetype: 'tradeHub' }, planet) === 'sentinels') sentinels++;
    }
    expect(sentinels).toBeGreaterThan(100);
    expect(sentinels).toBeLessThan(300);
  });
});

describe('Sentinelles — négociation', () => {
  it('le Bastion est un boss du système 9 tenu par les Sentinelles', () => {
    const { e, system, boss } = bastionEngine();
    expect(boss).toBeDefined();
    expect(boss.phasesTotal).toBe(3);
    expect(enemyProfileId(system, boss)).toBe('sentinels');
    expect(e.canNegotiate(system, boss)).toBe(true);
  });

  it('exige la Diplomatie spatiale et une planète tenue par les Sentinelles', () => {
    const { e, system, boss } = bastionEngine();
    e.state.technologies.spaceDiplomacy.unlocked = false;
    expect(canNegotiate(e.state, system, boss)).toBe(false);
    e.state.technologies.spaceDiplomacy.unlocked = true;
    const swarmSystem = e.explorationSystems()[0];
    const swarmPlanet = swarmSystem.planets.find((p) => p.type === 'invaded');
    if (swarmPlanet) expect(canNegotiate(e.state, swarmSystem, swarmPlanet)).toBe(false);
  });

  it('coûte défense × phases restantes × coefficient, en influence', () => {
    const { boss } = bastionEngine();
    const expected = Math.ceil(
      boss.defenseRating * 3 * CONFIG.negotiation.influencePerDefense
    );
    expect(negotiationCost(boss)).toBe(expected);
    boss.phasesWon = 2;
    expect(negotiationCost(boss)).toBe(
      Math.ceil(boss.defenseRating * 1 * CONFIG.negotiation.influencePerDefense)
    );
  });

  it('refuse sans assez d’influence, sans rien changer', () => {
    const { e, boss } = bastionEngine();
    e.state.resources.influence = 0;
    expect(e.negotiatePlanet(boss.id)).toBe(false);
    expect(boss.conquered).toBe(false);
    expect(e.state.combatStats.negotiations).toBe(0);
  });

  it('conquiert la planète sans combat ni perte : coût payé, butin réduit, XP et point de compétence', () => {
    const { e, system, boss } = bastionEngine();
    const cost = negotiationCost(boss);
    e.state.resources.influence = cost + 7;
    const fleet = e.state.ships.fighters.count;
    const skillPoints = e.state.run.skillPoints;
    const xp = e.state.prestige.player.xp;
    const energy = e.state.resources.energy;
    expect(e.negotiatePlanet(boss.id)).toBe(true);

    expect(boss.conquered).toBe(true);
    expect(boss.phasesWon).toBe(boss.phasesTotal);
    expect(e.state.ships.fighters.count).toBe(fleet); // aucune perte
    expect(e.state.run.skillPoints).toBe(skillPoints + 1);
    expect(e.state.prestige.player.xp).not.toBe(xp);
    expect(e.state.combatStats.negotiations).toBe(1);
    expect(e.state.combatStats.battles).toBe(0);
    expect(e.state.story.bestiary.sentinels).toBe(true);

    // Butin : la moitié du butin de force.
    const forceLoot = e.planetRewards(system, boss);
    const negotiated = e.planetRewards(system, boss, { negotiated: true });
    for (const res of Object.keys(forceLoot)) {
      expect(negotiated[res]).toBeLessThanOrEqual(Math.ceil(forceLoot[res] * CONFIG.negotiation.lootFraction) + 1);
    }
    expect(e.state.resources.energy).toBeGreaterThan(energy);
    // L'influence dépensée n'est plus là (le butin peut en rendre un peu).
    expect(e.state.resources.influence).toBeGreaterThanOrEqual(7);
    expect(e.state.resources.influence).toBeLessThan(cost + 7 + forceLoot.influence);
  });

  it('on ne peut pas négocier deux fois la même planète', () => {
    const { e, boss } = bastionEngine();
    e.state.resources.influence = 1e6;
    expect(e.negotiatePlanet(boss.id)).toBe(true);
    expect(e.negotiatePlanet(boss.id)).toBe(false);
  });
});

describe('Sentinelles — le choix du Bastion', () => {
  it('négocier = Allier : choix mémorisé, PV +25 % pour la run, entrée et succès', () => {
    const { e, boss } = bastionEngine();
    e.state.resources.influence = 1e6;
    const hp = fleetDurabilityMultiplier(e.state);
    e.negotiatePlanet(boss.id);
    expect(e.state.story.choices.sentinels).toBe('ally');
    expect(e.state.story.defeated.sentinelBastion).toBe(true);
    expect(fleetDurabilityMultiplier(e.state)).toBeCloseTo(hp * 1.25);
    e.tick(1);
    expect(e.state.story.entries.bastionAllied).toBe(true);
    expect(e.state.story.entries.bastionRazed).toBe(false);
    expect(e.state.achievements.bastionGates.unlocked).toBe(true);
  });

  it('vaincre par la force = Détruire : choix mémorisé, butin +25 % pour la run', () => {
    const { e, boss } = bastionEngine();
    const loot = lootMultiplier(e.state);
    let guard = 0;
    while (!boss.conquered && guard++ < 12) {
      e.resolvePlanetCombat(boss.id, { fighters: 5_000_000 });
    }
    expect(boss.conquered).toBe(true);
    expect(e.state.story.choices.sentinels).toBe('destroy');
    expect(lootMultiplier(e.state)).toBeCloseTo(loot * 1.25);
    e.tick(1);
    expect(e.state.story.entries.bastionRazed).toBe(true);
    expect(e.state.story.entries.bastionAllied).toBe(false);
  });

  it('le choix se refait à chaque Cycle : l’Ascension le remet à zéro, les entrées restent', () => {
    const { e, boss } = bastionEngine();
    e.state.resources.influence = 1e6;
    e.negotiatePlanet(boss.id);
    e.tick(1);
    expect(e.state.story.entries.bastionAllied).toBe(true);
    e.state.prestige.factions.ironLegion.level = CONFIG.ascension.factionLevelThreshold;
    expect(e.ascend()).toBe(true);
    expect(e.state.story.choices.sentinels).toBeNull();
    expect(e.state.story.entries.bastionAllied).toBe(true);
    expect(e.state.story.defeated.sentinelBastion).toBe(true);
  });
});

describe('Chapitre 2 « Les Sentinelles »', () => {
  it('s’ouvre à 5 systèmes conquis à vie ET la Diplomatie spatiale', () => {
    const e = new Engine(createInitialState());
    e.state.combatStats.systemsConquered = 4;
    e.state.technologies.spaceDiplomacy.unlocked = true;
    e.tick(1);
    expect(e.state.story.entries.sentinelsSignal).toBe(false);
    e.state.combatStats.systemsConquered = 5;
    e.state.technologies.spaceDiplomacy.unlocked = false;
    e.tick(1);
    expect(e.state.story.entries.sentinelsSignal).toBe(false);
    e.state.technologies.spaceDiplomacy.unlocked = true;
    e.tick(1);
    expect(e.state.story.entries.sentinelsSignal).toBe(true);
  });

  it('le bestiaire des Sentinelles ouvre l’entrée « gardiens » ; voir le Bastion ouvre la suivante', () => {
    const { e } = bastionEngine();
    e.state.combatStats.systemsConquered = 5;
    e.state.story.bestiary.sentinels = true;
    e.tick(1);
    expect(e.state.story.entries.sentinelsWardens).toBe(true);
    expect(e.state.story.entries.bastionSighted).toBe(true); // système 9 déjà ouvert
  });

  it('un système entièrement conquis incrémente le compteur à vie', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion');
    e.state.ships.fighters.count = 5_000_000;
    e.state.technologies.xenoColonization.unlocked = true;
    e.openSystem(0);
    const system = e.activeSystem();
    let guard = 0;
    while (!system.conquered && guard++ < 40) {
      for (const p of system.planets) {
        if (!p.conquered) e.resolvePlanetCombat(p.id, { fighters: 5_000_000 });
      }
    }
    expect(system.conquered).toBe(true);
    expect(e.state.combatStats.systemsConquered).toBe(1);
  });
});
