import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import { SHIP_BY_ID } from '../data/fleet.js';
import { FACTION_IDS } from '../data/factions.js';
import { enemyFleetForPlanet, enemyProfileId } from './enemy-fleet.js';
import { allyFleetFromAllocation, estimateWinChance } from './battle.js';
import {
  initExploration,
  ensureSystemsUpTo,
  ensureVisibleSystems,
} from './exploration.js';

describe('initExploration', () => {
  it('génère une fenêtre de systèmes visibles au niveau de joueur 0', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    expect(s.run.exploration.systems.length).toBeGreaterThan(0);
    expect(s.run.exploration.activeSystemIndex).toBeNull();
  });

  it('chaque système généré a un niveau requis et des planètes', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    for (const system of s.run.exploration.systems) {
      expect(typeof system.requiredLevel).toBe('number');
      expect(system.planets.length).toBeGreaterThan(0);
      expect(system.conquered).toBe(false);
    }
  });
});

describe('système d’index 0 (dépendance du tutoriel)', () => {
  it('a toujours exactement 2 planètes : une résolue d’office, une à conquérir en 1 phase', () => {
    // Le tutoriel (src/data/tutorialSteps.js) suppose que le système 0 est
    // gagnable dès 1 `fighters` engagé (voir la note de calibrage de l’étape
    // `buyFighters`) — si un futur ajustement d’équilibrage change cette
    // composition, ce test doit casser bruyamment plutôt que de laisser le
    // tutoriel se bloquer en silence sur l’étape `engageCombat`.
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const system = s.run.exploration.systems[0];
    expect(system.planets).toHaveLength(2);
    const [first, second] = system.planets;
    expect(first.type).toBe('uninhabited');
    expect(second.type).toBe('invaded');
    expect(second.phasesTotal).toBe(1);
    expect(second.defenseRating).toBeLessThanOrEqual(2);
  });
});

describe('ensureSystemsUpTo', () => {
  it('génère paresseusement, jamais moins que demandé', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const before = s.run.exploration.systems.length;
    ensureSystemsUpTo(s, before + 10);
    expect(s.run.exploration.systems.length).toBe(before + 11);
  });

  it('idempotent : rappeler avec un index déjà couvert ne régénère rien', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const before = [...s.run.exploration.systems];
    ensureSystemsUpTo(s, 0);
    expect(s.run.exploration.systems).toEqual(before);
  });

  it('un système déjà généré garde sa composition (même index -> même contenu)', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const first = s.run.exploration.systems[0];
    ensureSystemsUpTo(s, 5);
    expect(s.run.exploration.systems[0]).toBe(first);
  });
});

describe('ensureVisibleSystems', () => {
  it('la fenêtre visible grandit avec le niveau du joueur', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const atLevel0 = s.run.exploration.systems.length;
    ensureVisibleSystems(s, 10);
    expect(s.run.exploration.systems.length).toBeGreaterThan(atLevel0);
  });

  it('relit advancedUnlocked à chaque système généré : warpDrive en cours '
    + 'de run donne accès à des systèmes avancés parmi les suivants', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const before = s.run.exploration.systems.length;
    s.technologies.warpDrive.unlocked = true;
    s.run.exploration.advancedUnlocked = true;
    ensureSystemsUpTo(s, before + 10);
    const newOnes = s.run.exploration.systems.slice(before);
    expect(newOnes.some((sys) => sys.advanced)).toBe(true);
  });

  it('la défense/le nombre de planètes continue de grimper avec l’index', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    ensureSystemsUpTo(s, 20);
    const systems = s.run.exploration.systems;
    expect(systems[20].defenseRating).toBeGreaterThan(systems[0].defenseRating);
    expect(systems[20].requiredLevel).toBeGreaterThan(systems[0].requiredLevel);
  });
});

describe('système 0 (hypothèse du tutoriel guidé, voir ui/tutorial.js)', () => {
  // Le tutoriel scripte "ouvrez le système 0, gagnez son unique combat avec
  // 2 Chasseurs" — si un futur ajustement d'équilibrage change la
  // composition du système 0, ce test échoue bruyamment plutôt que de
  // casser le tutoriel en silence (voir DÉCISIONS du plan « tutoriel »).
  it('a exactement 2 planètes : une auto-résolue, une combat gagnable avec 2 Chasseurs', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const system0 = s.run.exploration.systems[0];
    expect(system0.requiredLevel).toBe(0);
    expect(system0.planets).toHaveLength(2);
    expect(['uninhabited', 'gas']).toContain(system0.planets[0].type);
    expect(system0.planets[1].type).toBe('invaded');
    expect(system0.planets[1].phasesTotal).toBe(1);
    expect(system0.planets[1].defenseRating).toBeLessThanOrEqual(
      SHIP_BY_ID.fighters.attack * 2
    );
  });

  // Combat vivant : la bataille est aléatoire, « puissance ≥ défense » ne
  // suffit plus. Le premier combat du tutoriel (2 Chasseurs, seule flotte
  // qu'il fait acheter) doit rester une victoire quasi certaine, pour toutes
  // les factions. Estimation à graines fixes : le test est déterministe.
  it('le combat du tutoriel se gagne (≥ 93 % de chances) avec 2 Chasseurs, quelle que soit la faction', () => {
    for (const factionId of FACTION_IDS) {
      const s = createInitialState();
      startRun(s, factionId);
      initExploration(s);
      s.ships.fighters.count = 2;
      const system0 = s.run.exploration.systems[0];
      const chance = estimateWinChance(
        allyFleetFromAllocation(s, { fighters: 2 }),
        enemyFleetForPlanet(system0, system0.planets[1]),
        { runs: 1000 }
      );
      expect(chance, factionId).toBeGreaterThanOrEqual(0.93);
    }
  });

  it('le système 0 est tenu par l’Essaim (le tutoriel s’appuie sur ses lignes de journal)', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    initExploration(s);
    const system0 = s.run.exploration.systems[0];
    expect(enemyProfileId(system0, system0.planets[1])).toBe('swarm');
  });
});

describe('planètes-boss (data/systems.js#BOSS_PLANETS)', () => {
  it('la Nid-mère est ajoutée APRÈS les planètes procédurales du système 4', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    ensureSystemsUpTo(s, 6);
    const system = s.run.exploration.systems[4];
    const last = system.planets[system.planets.length - 1];
    expect(last.boss).toBe('motherNest');
    expect(last.type).toBe('invaded');
    expect(last.phasesTotal).toBe(2);
    expect(last.id).toBe('4-motherNest');
    expect(last.defenseRating).toBeGreaterThan(0);
    // aucun autre système n'a de boss
    const bosses = s.run.exploration.systems.flatMap((sys) =>
      sys.planets.filter((p) => p.boss)
    );
    expect(bosses).toHaveLength(1);
  });

  it('ne décale pas le tirage seedé : les autres planètes du système 4 sont inchangées', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    ensureSystemsUpTo(s, 6);
    const system = s.run.exploration.systems[4];
    const procedural = system.planets.filter((p) => !p.boss);
    // Les ids `4-0`, `4-1`… sont ceux du tirage seedé, sans trou.
    expect(procedural.map((p) => p.id)).toEqual(
      procedural.map((_, i) => `4-${i}`)
    );
  });
});
