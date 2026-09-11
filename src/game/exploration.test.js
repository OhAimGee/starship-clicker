import { describe, it, expect } from 'vitest';
import { createInitialState } from './initial-state.js';
import { startRun } from './run.js';
import { generateRunTargets, startNextMap } from './exploration.js';
import { CONFIG } from '../data/config.js';

describe('generateRunTargets', () => {
  it('construit une file de `objective.target` systèmes', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    generateRunTargets(s);
    expect(s.run.exploration.targets).toHaveLength(CONFIG.run.baseSystems);
  });
});

describe('startNextMap', () => {
  it('dépile un système et construit sa carte active', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    generateRunTargets(s);
    const before = s.run.exploration.targets.length;

    const map = startNextMap(s);

    expect(map).not.toBeNull();
    expect(s.run.exploration.targets).toHaveLength(before - 1);
    expect(s.run.exploration.activeMap).toBe(map);
  });

  it('génère un nouveau système à la volée au lieu de s’arrêter (objectif non-conquête)', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective'); // niveau 0 -> gatherResources (non-conquête)
    s.run.exploration.targets = [];
    s.run.exploration.conquered = Array.from(
      { length: CONFIG.run.baseSystems },
      () => ({})
    );

    const map = startNextMap(s);

    expect(map).not.toBeNull();
    expect(s.run.exploration.activeMap).toBe(map);
  });

  it('renvoie null et vide activeMap quand un objectif de conquête est déjà atteint', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    s.run.objective = {
      type: 'conquerOne',
      target: 1,
      resource: null,
      defenseMult: 1,
    };
    s.run.exploration.targets = [];
    s.run.exploration.conquered = [{ name: 'Test' }];

    const map = startNextMap(s);

    expect(map).toBeNull();
    expect(s.run.exploration.activeMap).toBeNull();
  });

  it('relit advancedUnlocked à chaque génération : warpDrive en cours de run '
    + 'donne accès aux systèmes avancés dès le système suivant', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    s.run.exploration.targets = [];
    s.run.exploration.conquered = [{}]; // index suivant impair -> avancé éligible
    // Effet de Engine#research('warpDrive') simulé directement (voir
    // engine.js#research) : pas besoin de la machinerie complète du moteur
    // pour ce test au niveau des fonctions pures d'exploration.js.
    s.technologies.warpDrive.unlocked = true;
    s.run.exploration.advancedUnlocked = true;

    const map = startNextMap(s);

    expect(map.systemDef.advanced).toBe(true);
  });

  it('la difficulté continue de grimper bien au-delà de l’ancienne file fixe', () => {
    const s = createInitialState();
    startRun(s, 'miningCollective');
    const defenses = [];
    for (let i = 0; i < 20; i++) {
      s.run.exploration.targets = [];
      s.run.exploration.conquered.push({});
      const map = startNextMap(s);
      defenses.push(map.systemDef.defenseRating);
    }

    expect(defenses[19]).toBeGreaterThan(defenses[4]);
    expect(defenses[19]).toBeGreaterThan(defenses[0]);
  });
});
