import { describe, it, expect } from 'vitest';
import { Engine } from './engine.js';
import { createInitialState } from './initial-state.js';
import { CONFIG } from '../data/config.js';

const withResources = (patch) => {
  const s = createInitialState();
  Object.assign(s.resources, patch);
  return s;
};

describe('Engine — clic', () => {
  it('ajoute le pouvoir de clic à l’énergie et compte les clics', () => {
    const e = new Engine(createInitialState());
    e.click();
    expect(e.state.resources.energy).toBe(1);
    expect(e.state.totalClicks).toBe(1);
  });
});

describe('Engine — achats', () => {
  it('buyGenerator débite la bonne ressource et incrémente le compteur', () => {
    const e = new Engine(withResources({ energy: 100 }));
    const cost = e.generatorCost('solarPanel');
    expect(e.buyGenerator('solarPanel')).toBe(true);
    expect(e.state.generators.solarPanel.count).toBe(1);
    expect(e.state.resources.energy).toBe(100 - cost);
  });

  it('buyGenerator échoue si trop pauvre', () => {
    const e = new Engine(createInitialState());
    expect(e.buyGenerator('solarPanel')).toBe(false);
    expect(e.state.generators.solarPanel.count).toBe(0);
  });

  it('buyGenerator refuse un générateur non débloqué', () => {
    const e = new Engine(withResources({ antimatter: 1e9 }));
    expect(e.buyGenerator('darkMatterCollector')).toBe(false);
  });

  it('buyShip débite un coût multi-ressources', () => {
    const e = new Engine(withResources({ energy: 500, metal: 200 }));
    expect(e.buyShip('fighters')).toBe(true);
    expect(e.state.ships.fighters.count).toBe(1);
    expect(e.state.resources.energy).toBe(300);
    expect(e.state.resources.metal).toBe(100);
  });

  it('research débloque la techno et applique les effets immédiats', () => {
    const s = withResources({ antimatter: 200, influence: 100 });
    s.totalProduced.influence = 100;
    const e = new Engine(s);
    expect(e.research('warpDrive')).toBe(true);
    expect(e.state.technologies.warpDrive.unlocked).toBe(true);
    expect(e.state.run.exploration.advancedUnlocked).toBe(true);
  });
});

describe('Engine — boucle', () => {
  it('tick(1) applique une seconde de production', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10; // 5 énergie/s
    const e = new Engine(s);
    e.tick(1);
    expect(e.state.resources.energy).toBeCloseTo(5);
    expect(e.state.totalProduced.energy).toBeCloseTo(5);
  });

  it('advance() rattrape plusieurs ticks mais plafonne', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 2; // 1 énergie/s
    const e = new Engine(s);
    e.advance(5000);
    expect(e.state.resources.energy).toBeCloseTo(5);
    e.advance(10_000_000); // plafonné à maxCatchupTicks
    expect(e.state.resources.energy).toBeLessThan(5 + 30);
  });

  it('la maintenance non payée provoque de l’attrition', () => {
    const s = createInitialState();
    s.ships.fighters.count = 100; // maintenance 100/s, aucune énergie
    const e = new Engine(s);
    e.tick(1);
    expect(e.state.ships.fighters.count).toBeLessThan(100);
  });

  it('émet "unlock" quand un palier est franchi', () => {
    const s = createInitialState();
    s.generators.miningDrone.count = 200; // 200 * 0.3 = 60 métal/s
    const e = new Engine(s);
    const unlocks = [];
    e.on('unlock', (u) => unlocks.push(u));
    e.tick(1); // 60 métal produit -> crystalExtractor se débloque (seuil 40)
    expect(unlocks.some((u) => u.id === 'crystalExtractor')).toBe(true);
  });
});

describe('Engine — événements aléatoires', () => {
  it('de longs ticks ne cassent pas la boucle et peuvent émettre "event"', () => {
    const s = createInitialState();
    s.resources.energy = 100000;
    s.generators.solarPanel.count = 5;
    const e = new Engine(s);
    const events = [];
    e.on('event', (ev) => events.push(ev));
    for (let i = 0; i < 20; i++) e.tick(60); // 20 min simulées
    for (const ev of events) {
      expect(typeof ev.id).toBe('string');
      expect(Object.keys(ev.grant).length).toBeGreaterThan(0);
    }
  });
});

describe('Engine — faction & run', () => {
  it('selectFaction fixe la faction, refuse une deuxième sélection', () => {
    const e = new Engine(createInitialState());
    expect(e.selectFaction('miningCollective')).toBe(true);
    expect(e.state.run.factionId).toBe('miningCollective');
    expect(e.selectFaction('ironLegion')).toBe(false);
    expect(e.state.run.factionId).toBe('miningCollective');
  });

  it('selectFaction refuse un id inconnu', () => {
    const e = new Engine(createInitialState());
    expect(e.selectFaction('nope')).toBe(false);
    expect(e.state.run.factionId).toBeNull();
  });

  it('buyFactionSkill échoue sans faction active, réussit une fois sélectionnée', () => {
    const e = new Engine(withResources({ ascensionPoints: 100 }));
    expect(e.buyFactionSkill('entangledFields')).toBe(false);
    e.selectFaction('quantumOrder');
    expect(e.buyFactionSkill('entangledFields')).toBe(true);
    expect(
      e.state.prestige.factions.quantumOrder.skills.entangledFields.level
    ).toBe(1);
  });

  it('les bonus de faction se reflètent dans la production/flotte', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion'); // +20% puissance de flotte dès le départ
    e.state.ships.fighters.count = 10; // 10 * 2 = 20 de base
    expect(e.fleetPower).toBe(Math.floor(20 * 1.2));
  });

  it('selectFaction amorce une liste de systèmes explorables', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('miningCollective');
    expect(e.state.run.objective).not.toBeNull();
    expect(e.explorationSystems().length).toBeGreaterThan(0);
  });

  it('openSystem échoue sans flotte, réussit une fois un vaisseau acheté', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion');

    expect(e.hasFleet()).toBe(false);
    expect(e.openSystem(0)).toBe(false);
    expect(e.activeSystem()).toBeNull();

    e.state.ships.fighters.count = 1000;
    expect(e.hasFleet()).toBe(true);
    expect(e.openSystem(0)).toBe(true);
    expect(e.activeSystem()).not.toBeNull();
  });

  it('openSystem refuse un système dont le niveau requis dépasse le niveau du joueur', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion');
    e.state.ships.fighters.count = 1000;
    // Le niveau requis grandit avec l'index (voir data/systems.js) : un
    // index assez lointain dépasse forcément le niveau de joueur 0.
    const systems = e.explorationSystems();
    const farIndex = systems.findIndex((s) => s.requiredLevel > 0);
    expect(farIndex).toBeGreaterThan(-1);

    expect(e.openSystem(farIndex)).toBe(false);
    expect(e.activeSystem()).toBeNull();
  });

  it('openSystem résout automatiquement les planètes uninhabited/gas à la première ouverture', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion');
    e.state.ships.fighters.count = 1000;
    const system = e.explorationSystems()[0];
    const freebies = system.planets.filter(
      (p) => p.type === 'uninhabited' || p.type === 'gas'
    );

    e.openSystem(0);

    for (const p of freebies) expect(p.conquered).toBe(true);
  });

  it('resolvePlanetCombat : une allocation faible perd, laisse la planète ' +
    'retentable et journalise l’entrée ; une flotte massive finit toutes les phases', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion');
    e.state.ships.fighters.count = 100000;
    e.openSystem(0);
    const system = e.activeSystem();
    const planet = system.planets.find(
      (p) => p.type === 'invaded' || p.type === 'hostile'
    );
    expect(planet).toBeDefined();

    const battles = [];
    e.on('battle-resolved', (entry) => battles.push(entry));

    const weak = e.resolvePlanetCombat(planet.id, { fighters: 1 });
    expect(weak).toBe(false);
    expect(planet.conquered).toBe(false);
    expect(e.state.run.combatLog).toHaveLength(1);
    expect(e.state.run.combatLog[0].victory).toBe(false);
    expect(battles).toHaveLength(1);

    let guard = 0;
    while (!planet.conquered && guard++ < 10) {
      e.resolvePlanetCombat(planet.id, {
        fighters: e.state.ships.fighters.count,
      });
    }
    expect(planet.conquered).toBe(true);
    expect(guard).toBeLessThan(10);
  });

  // Trouve, parmi une fenêtre de systèmes largement débloquée (niveau de
  // joueur élevé), l'index du premier système contenant une planète
  // hostile — évite de dépendre du hasard des tout premiers systèmes.
  function findHostileSystemIndex(engine) {
    engine.state.prestige.player.level = 50;
    const systems = engine.explorationSystems();
    const index = systems.findIndex((s) =>
      s.planets.some((p) => p.type === 'hostile')
    );
    expect(index).toBeGreaterThan(-1);
    return index;
  }

  it('planète hostile : conquise sans la recherche mais sans récompense ; ' +
    'avec la recherche, la récompense (buff) est accordée', () => {
    const withTech = new Engine(createInitialState());
    withTech.selectFaction('ironLegion');
    withTech.state.ships.fighters.count = 1_000_000;
    withTech.state.technologies.xenoColonization.unlocked = true;
    withTech.openSystem(findHostileSystemIndex(withTech));
    const system = withTech.activeSystem();
    const hostileWith = system.planets.find((p) => p.type === 'hostile');
    let guard = 0;
    while (!hostileWith.conquered && guard++ < 10) {
      withTech.resolvePlanetCombat(hostileWith.id, {
        fighters: withTech.state.ships.fighters.count,
      });
    }
    expect(hostileWith.conquered).toBe(true);
    expect(withTech.state.run.buffs.length).toBeGreaterThan(0);

    const withoutTech = new Engine(createInitialState());
    withoutTech.selectFaction('ironLegion');
    withoutTech.state.ships.fighters.count = 1_000_000;
    withoutTech.openSystem(findHostileSystemIndex(withoutTech));
    const system2 = withoutTech.activeSystem();
    const hostileWithout = system2.planets.find((p) => p.type === 'hostile');
    guard = 0;
    while (!hostileWithout.conquered && guard++ < 10) {
      withoutTech.resolvePlanetCombat(hostileWithout.id, {
        fighters: withoutTech.state.ships.fighters.count,
      });
    }
    expect(hostileWithout.conquered).toBe(true);
    expect(withoutTech.state.run.buffs).toHaveLength(0);
  });

  it('système entièrement conquis : buff, XP et conquered.length incrémentés', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion');
    e.state.ships.fighters.count = 1_000_000;
    e.openSystem(0);
    const system = e.activeSystem();
    const levelBefore = e.state.prestige.player.level;
    const xpBefore = e.state.prestige.player.xp;

    let guard = 0;
    while (!system.conquered && guard++ < 100) {
      const planet = system.planets.find(
        (p) => (p.type === 'invaded' || p.type === 'hostile') && !p.conquered
      );
      if (!planet) break;
      e.resolvePlanetCombat(planet.id, {
        fighters: e.state.ships.fighters.count,
      });
    }

    expect(system.conquered).toBe(true);
    expect(e.state.run.exploration.conquered).toHaveLength(1);
    expect(e.state.run.exploration.conquered[0]).toBe(system);
    expect(
      e.state.prestige.player.level > levelBefore ||
        e.state.prestige.player.xp > xpBefore
    ).toBe(true);
  });

  it('chaque combat gagné ajoute aussi un point de compétence de run', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('ironLegion');
    e.state.ships.fighters.count = 1_000_000;
    e.openSystem(0);
    const system = e.activeSystem();
    const planet = system.planets.find(
      (p) => p.type === 'invaded' || p.type === 'hostile'
    );
    const before = e.state.run.skillPoints;
    e.resolvePlanetCombat(planet.id, { fighters: e.state.ships.fighters.count });
    expect(e.state.run.skillPoints).toBeGreaterThan(before);
  });

  it('parcours complet : sélection -> systèmes à planètes -> objectif -> fin de run', () => {
    const e = new Engine(createInitialState());
    e.state.prestige.factions.ironLegion.level = 3; // objectif conquerAll (sinon niveau 0 = gatherResources)
    e.state.ships.fighters.count = 1_000_000; // flotte énorme : tout se résout
    e.selectFaction('ironLegion');
    e.state.resources.quantumEnergy = CONFIG.ascension.quantumCost; // bonus de PA optionnel

    const target = e.state.run.objective.target;
    let guard = 0;
    let systemIndex = 0;
    while (e.state.run.exploration.conquered.length < target && guard < 2000) {
      guard++;
      e.openSystem(systemIndex);
      const system = e.activeSystem();
      let innerGuard = 0;
      while (!system.conquered && innerGuard++ < 20) {
        const planet = system.planets.find(
          (p) => (p.type === 'invaded' || p.type === 'hostile') && !p.conquered
        );
        if (!planet) break;
        e.resolvePlanetCombat(planet.id, {
          fighters: e.state.ships.fighters.count,
        });
      }
      systemIndex++;
    }
    expect(guard).toBeLessThan(2000); // pas de boucle infinie

    expect(e.state.run.exploration.conquered.length).toBeGreaterThanOrEqual(
      target
    );
    // Détection centralisée (Engine#_afterChange) : notifiée dès que l'objectif
    // est rempli, sans attendre un `endRun()` explicite.
    expect(e.state.run.objectiveAnnounced).toBe(true);
    expect(e.canEndRun()).toBe(true);

    e.endRun();
    expect(e.state.run.factionId).toBeNull();
    expect(e.state.prestige.factions.ironLegion.level).toBe(4);
  });

  it('objectif gatherResources : détecté sans passer par chooseNode, notifié une seule fois', () => {
    const e = new Engine(createInitialState()); // niveau 0 -> gatherResources
    e.selectFaction('miningCollective');
    const obj = e.state.run.objective;
    const notified = [];
    e.on('notify', (msg) => notified.push(msg.key));

    e.state.totalProduced[obj.resource] = obj.target; // objectif rempli "hors bande"
    e.click(); // n'importe quelle action mutant l'état -> _afterChange() détecte
    e.click(); // un second changement d'état ne renotifie pas

    expect(e.canEndRun()).toBe(true);
    expect(
      notified.filter((k) => k === 'notify.objectiveComplete')
    ).toHaveLength(1);
  });
});

describe('Engine — reset', () => {
  it('repart d’un état neuf', () => {
    const e = new Engine(withResources({ energy: 9999 }));
    e.buyGenerator('solarPanel');
    e.reset();
    expect(e.state.resources.energy).toBe(0);
    expect(e.state.generators.solarPanel.count).toBe(0);
    expect(e.state.run.factionId).toBeNull();
  });
});

describe('Engine — hors-ligne', () => {
  it('applyOfflineProgress crédite les gains plafonnés', () => {
    const s = createInitialState();
    s.generators.solarPanel.count = 10; // 5 énergie/s
    const e = new Engine(s);
    const report = e.applyOfflineProgress(3600 * 1000); // 1 h
    expect(report.cappedSeconds).toBe(3600);
    expect(e.state.resources.energy).toBeCloseTo(18000);
  });
});
