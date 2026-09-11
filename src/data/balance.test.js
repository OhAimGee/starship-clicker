import { describe, it, expect } from 'vitest';
import { RESOURCE_IDS } from './resources.js';
import { GENERATORS } from './generators.js';
import { SHIPS } from './fleet.js';
import { TECHNOLOGIES, TECH_IDS } from './technologies.js';
import { PRESTIGE_UPGRADES, CLICK_UPGRADES } from './upgrades.js';
import { RANDOM_EVENTS } from './events.js';
import { FACTIONS } from './factions.js';
import { ASCENSION_REWARDS } from './ascensionRewards.js';

const isResource = (id) => RESOURCE_IDS.includes(id);
const KNOWN_EFFECTS = new Set([
  'generatorProduction',
  'resourceProduction',
  'shipCost',
  'fleetMaintenance',
  'explorationIncome',
  'clickPower',
  'autoBuyGenerators',
  'unlockAdvancedSystems',
]);
// Types d'effet « à niveaux », gérés par economy.js#applyLeveledEffect —
// partagés par PRESTIGE_UPGRADES (arbre commun) et les arbres de faction.
const KNOWN_LEVELED_EFFECTS = new Set([
  'productionMultiplier',
  'clickMultiplier',
  'fleetMultiplier',
  'resourceProductionMultiplier',
  'shipCost',
  'fleetMaintenance',
]);

function assertLeveledEffect(effect, label) {
  expect(
    KNOWN_LEVELED_EFFECTS.has(effect.type),
    `${label}: effet ${effect.type}`
  ).toBe(true);
  expect(effect.perLevel, label).toBeGreaterThan(0);
  if (effect.resources) {
    for (const res of effect.resources) {
      expect(isResource(res), `${label}: ressource ${res}`).toBe(true);
    }
  }
}

function assertUnlock(unlock) {
  if (!unlock) return;
  if ('tech' in unlock) {
    expect(TECH_IDS).toContain(unlock.tech);
  } else {
    expect(isResource(unlock.resource)).toBe(true);
    expect(unlock.total).toBeGreaterThan(0);
  }
}

describe('cohérence des identifiants', () => {
  it('aucun doublon d’id dans chaque catégorie', () => {
    for (const list of [
      GENERATORS,
      SHIPS,
      TECHNOLOGIES,
      PRESTIGE_UPGRADES,
      CLICK_UPGRADES,
      RANDOM_EVENTS,
      FACTIONS,
      ASCENSION_REWARDS,
    ]) {
      const ids = list.map((x) => x.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('générateurs', () => {
  it('produisent et dépensent des ressources valides', () => {
    for (const g of GENERATORS) {
      expect(isResource(g.resource), g.id).toBe(true);
      expect(isResource(g.costResource), g.id).toBe(true);
      expect(g.baseCost).toBeGreaterThan(0);
      expect(g.costGrowth).toBeGreaterThan(1);
      expect(g.rate).toBeGreaterThan(0);
      assertUnlock(g.unlock);
    }
  });

  it('chaque ressource non-énergie a au moins une source (pas de blocage)', () => {
    const produced = new Set(GENERATORS.map((g) => g.resource));
    for (const res of [
      'metal',
      'crystals',
      'antimatter',
      'influence',
      'darkMatter',
      'quantumEnergy',
    ]) {
      expect(produced.has(res), `aucun générateur ne produit ${res}`).toBe(
        true
      );
    }
  });

  it('les paliers sont non-décroissants dans l’ordre de la liste', () => {
    let tier = 0;
    for (const g of GENERATORS) {
      expect(g.tier).toBeGreaterThanOrEqual(tier);
      tier = g.tier;
    }
  });

  it('le coût de base minimal croît de palier en palier', () => {
    const minByTier = {};
    for (const g of GENERATORS) {
      minByTier[g.tier] = Math.min(minByTier[g.tier] ?? Infinity, g.baseCost);
    }
    const tiers = Object.keys(minByTier)
      .map(Number)
      .sort((a, b) => a - b);
    for (let i = 1; i < tiers.length; i++) {
      expect(minByTier[tiers[i]]).toBeGreaterThan(minByTier[tiers[i - 1]]);
    }
  });
});

describe('flotte', () => {
  it('coûts, attaque et maintenance valides ; paliers ordonnés', () => {
    let tier = 0;
    for (const s of SHIPS) {
      for (const res of Object.keys(s.cost))
        expect(isResource(res), s.id).toBe(true);
      expect(s.attack).toBeGreaterThan(0);
      expect(s.maintenance).toBeGreaterThan(0);
      expect(s.tier).toBeGreaterThanOrEqual(tier);
      tier = s.tier;
      assertUnlock(s.unlock);
    }
  });

  it('attaque strictement croissante dans l’ordre de la liste', () => {
    for (let i = 1; i < SHIPS.length; i++) {
      expect(SHIPS[i].attack).toBeGreaterThan(SHIPS[i - 1].attack);
    }
  });
});

describe('technologies', () => {
  it('coûts et effets valides', () => {
    for (const t of TECHNOLOGIES) {
      for (const res of Object.keys(t.cost))
        expect(isResource(res), t.id).toBe(true);
      expect(t.effects.length).toBeGreaterThan(0);
      for (const e of t.effects) {
        expect(KNOWN_EFFECTS.has(e.type), `${t.id}: effet ${e.type}`).toBe(
          true
        );
        if ('mult' in e) expect(e.mult).toBeGreaterThan(0);
        if (e.resource) expect(isResource(e.resource)).toBe(true);
      }
      assertUnlock(t.unlock);
    }
  });
});

describe('factions', () => {
  it('bonus de départ et compétences valides ; arbres sans doublon', () => {
    for (const f of FACTIONS) {
      expect(f.startBonuses.length).toBeGreaterThan(0);
      for (const bonus of f.startBonuses) {
        assertLeveledEffect(bonus, `${f.id} (bonus de départ)`);
      }

      const skillIds = f.skillTree.map((s) => s.id);
      expect(new Set(skillIds).size, f.id).toBe(skillIds.length);

      for (const skill of f.skillTree) {
        expect(skill.baseCost, `${f.id}.${skill.id}`).toBeGreaterThan(0);
        expect(skill.costGrowth, `${f.id}.${skill.id}`).toBeGreaterThan(1);
        assertLeveledEffect(skill.effect, `${f.id}.${skill.id}`);
      }
    }
  });
});

describe('récompenses d’Ascension', () => {
  it('effets valides, plus généreux que les compétences de faction du même type', () => {
    // Une récompense d'Ascension est rare (~1 par Ascension, contre plusieurs
    // compétences de faction achetées par run) : son perLevel doit dépasser,
    // type d'effet par type d'effet, le maximum observé dans les arbres de
    // faction — sinon elle ne se "sent" pas comme la vraie récompense ultime.
    const maxByType = {};
    for (const f of FACTIONS) {
      for (const skill of f.skillTree) {
        maxByType[skill.effect.type] = Math.max(
          maxByType[skill.effect.type] ?? 0,
          skill.effect.perLevel
        );
      }
    }
    for (const r of ASCENSION_REWARDS) {
      assertLeveledEffect(r.effect, r.id);
      const cap = maxByType[r.effect.type] ?? 0;
      expect(r.effect.perLevel, `${r.id} (${r.effect.type})`).toBeGreaterThan(
        cap
      );
    }
  });
});

describe('événements', () => {
  it('poids positifs et gains sur ressources valides', () => {
    const fakeState = {
      resources: Object.fromEntries(RESOURCE_IDS.map((r) => [r, 1000])),
      civilizationLevel: 3,
      technologies: { darkMatterPhysics: { unlocked: true } },
    };
    for (const e of RANDOM_EVENTS) {
      expect(e.weight).toBeGreaterThan(0);
      const grant = e.grant(fakeState);
      for (const [res, amount] of Object.entries(grant)) {
        expect(isResource(res), `${e.id} -> ${res}`).toBe(true);
        expect(amount).toBeGreaterThan(0);
      }
    }
  });
});
