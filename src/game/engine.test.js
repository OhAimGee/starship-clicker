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

  it('selectFaction amorce une file de cibles et une première carte', () => {
    const e = new Engine(createInitialState());
    e.selectFaction('miningCollective');
    expect(e.state.run.objective).not.toBeNull();
    expect(e.state.run.exploration.activeMap).not.toBeNull();
  });

  it('chooseNode échoue sans flotte, réussit une fois un vaisseau acheté', () => {
    const e = new Engine(createInitialState());
    e.state.prestige.factions.ironLegion.level = 3; // objectif conquerAll
    e.selectFaction('ironLegion');
    const map = e.state.run.exploration.activeMap;
    const [nodeId] = map.rows[0];

    expect(e.hasFleet()).toBe(false);
    expect(e.chooseNode(nodeId)).toBe(false);
    expect(map.nodes[nodeId].resolved).toBe(false);

    e.state.ships.fighters.count = 1000; // assez pour tout résoudre
    expect(e.hasFleet()).toBe(true);
    expect(e.chooseNode(nodeId)).toBe(true);
    expect(map.nodes[nodeId].resolved).toBe(true);
  });

  it('parcours complet : sélection -> cartes à nœuds -> objectif -> fin de run', () => {
    const e = new Engine(createInitialState());
    e.state.prestige.factions.ironLegion.level = 3; // objectif conquerAll (sinon niveau 0 = gatherResources)
    e.state.ships.fighters.count = 1_000_000; // flotte énorme : tout se résout
    e.selectFaction('ironLegion');
    e.state.resources.quantumEnergy = CONFIG.ascension.quantumCost; // bonus de PA optionnel

    let guard = 0;
    while (e.state.run.exploration.activeMap && guard < 1000) {
      guard++;
      const map = e.state.run.exploration.activeMap;
      const nextRow = map.currentRow + 1;
      if (nextRow >= map.rows.length) break; // carte terminée, en attente de la suivante
      const [nodeId] = map.rows[nextRow];
      e.chooseNode(nodeId);
    }
    expect(guard).toBeLessThan(1000); // pas de boucle infinie

    expect(e.state.run.exploration.targets).toHaveLength(0);
    expect(e.state.run.exploration.activeMap).toBeNull();
    expect(e.state.run.exploration.conquered.length).toBe(
      CONFIG.run.baseSystems + Math.floor(3 * CONFIG.run.systemsPerLevel)
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
