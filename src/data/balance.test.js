import { describe, it, expect } from 'vitest';
import { RESOURCE_IDS } from './resources.js';
import { GENERATORS } from './generators.js';
import { SHIPS } from './fleet.js';
import { TECHNOLOGIES, TECH_IDS } from './technologies.js';
import { PRESTIGE_UPGRADES, CLICK_UPGRADES } from './upgrades.js';
import { RANDOM_EVENTS } from './events.js';
import { FACTIONS } from './factions.js';
import { ASCENSION_REWARDS } from './ascensionRewards.js';
import { formatRateNumber } from '../game/format.js';
import { CONFIG } from './config.js';
import { ENEMY_CLASSES, ENEMY_PROFILES } from './enemies.js';
import { COMBAT_EVENTS } from './combatEvents.js';
import { RUN_SKILLS } from './runSkills.js';
import { CHAPTERS, STORY_ENTRIES } from './story.js';
import { ACHIEVEMENTS } from './achievements.js';
import { MEGASTRUCTURES } from './megastructures.js';
import { DECREES } from './decrees.js';
import { BOSS_PLANETS } from './systems.js';
import { ENEMY_PROFILE_IDS } from './enemies.js';
import { t } from '../i18n/index.js';

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
  'unlockHostileColonization',
  'fleetDurability',
  'lootMultiplier',
  'unlockDecrees',
  'unlockMegastructures',
  'decreeSlots',
]);
// Types d'effet « à niveaux », gérés par economy.js#applyLeveledEffect —
// partagés par PRESTIGE_UPGRADES (arbre commun) et les arbres de faction.
const KNOWN_LEVELED_EFFECTS = new Set([
  'productionMultiplier',
  'clickMultiplier',
  'fleetMultiplier',
  'fleetDurability',
  'resourceProductionMultiplier',
  'shipCost',
  'fleetMaintenance',
  'explorationIncome',
  'lootMultiplier',
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
      MEGASTRUCTURES,
      DECREES,
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

  // Garde-fou d'affichage : `formatNumber` tronquait à l'entier les débits
  // fractionnaires, si bien que 20 à 39 Archives du Sénat (0,05 INF/s chacune)
  // affichaient toutes « +1 INF/s » et la production semblait figée. Vaut pour
  // n'importe quelle ressource : un exemplaire de plus doit toujours changer
  // le débit affiché (avec et sans multiplicateur de production).
  it('un exemplaire de plus change toujours le débit affiché', () => {
    for (const g of GENERATORS) {
      for (const mult of [1, 1.37]) {
        for (let n = 1; n <= 200; n++) {
          const next = (n + 1) * g.rate * mult;
          // Au-delà de 1000, l'affichage est abrégé (« 1.23K ») : un pas
          // unitaire n'y est plus lisible par construction.
          if (next >= 1000) break;
          expect(
            formatRateNumber(next),
            `${g.id} ×${mult} : ${n} → ${n + 1} exemplaires`
          ).not.toBe(formatRateNumber(n * g.rate * mult));
        }
      }
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

describe('flotte — combat vivant', () => {
  it('PV et taille valides ; tailles 0-7 croissantes ; PV = attaque × (base + pente × taille)', () => {
    const { hpRatioBase, hpRatioPerTier } = CONFIG.combat;
    for (let i = 0; i < SHIPS.length; i++) {
      const s = SHIPS[i];
      expect(Number.isInteger(s.armorTier), s.id).toBe(true);
      expect(s.armorTier, s.id).toBeGreaterThanOrEqual(0);
      expect(s.armorTier, s.id).toBeLessThanOrEqual(7);
      if (i > 0) expect(s.armorTier, s.id).toBeGreaterThan(SHIPS[i - 1].armorTier);
      // Même règle pour les vaisseaux et les ennemis (loi de Lanchester,
      // voir docs/ROADMAP.md) : à l'arrondi près.
      const expected = s.attack * (hpRatioBase + hpRatioPerTier * s.armorTier);
      expect(Math.abs(s.hp - expected) / expected, s.id).toBeLessThan(0.07);
    }
  });

  it('les PV absolus croissent avec la taille : gros = solide', () => {
    for (let i = 1; i < SHIPS.length; i++) {
      expect(SHIPS[i].hp).toBeGreaterThan(SHIPS[i - 1].hp);
    }
  });

  it('chaque vaisseau a son nom, son nom au singulier et sa description (FR)', () => {
    for (const s of SHIPS) {
      for (const key of ['name', 'one', 'desc']) {
        const full = `ship.${s.id}.${key}`;
        expect(t(full), full).not.toBe(full);
      }
    }
  });
});

describe('ennemis', () => {
  it('classes et profils valides : parts de budget = 1, effectifs cohérents', () => {
    const classIds = ENEMY_CLASSES.map((c) => c.id);
    expect(new Set(classIds).size).toBe(classIds.length);
    for (const profile of ENEMY_PROFILES) {
      const total = profile.classes.reduce((sum, c) => sum + c.share, 0);
      expect(total, profile.id).toBeCloseTo(1, 9);
      for (const c of profile.classes) {
        expect(classIds, `${profile.id}.${c.id}`).toContain(c.id);
        expect(c.density, `${profile.id}.${c.id}`).toBeGreaterThan(0);
        expect(c.min, `${profile.id}.${c.id}`).toBeGreaterThanOrEqual(1);
        expect(c.max, `${profile.id}.${c.id}`).toBeGreaterThanOrEqual(c.min);
      }
    }
  });

  it('chaque profil et chaque classe ont leurs textes (FR)', () => {
    for (const c of ENEMY_CLASSES) {
      for (const ns of ['class', 'classPlural']) {
        const key = `enemy.${ns}.${c.id}`;
        expect(t(key), key).not.toBe(key);
      }
    }
    for (const p of ENEMY_PROFILES) {
      for (const key of ['name', 'hint', 'intro', 'victory', 'defeat', 'retreat']) {
        const full = `enemy.profile.${p.id}.${key}`;
        expect(t(full), full).not.toBe(full);
      }
    }
  });
});

describe('événements de combat', () => {
  it('ids uniques, poids positifs, textes pour chaque camp (FR)', () => {
    const ids = COMBAT_EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of COMBAT_EVENTS) {
      expect(e.weight, e.id).toBeGreaterThan(0);
      expect(['boon', 'bane'], e.id).toContain(e.kind);
      expect(typeof e.when, e.id).toBe('function');
      expect(typeof e.apply, e.id).toBe('function');
      for (const side of e.sides ?? ['ally', 'enemy']) {
        const key = `battle.event.${e.id}.${side}`;
        expect(t(key), key).not.toBe(key);
      }
    }
  });
});

describe('compétences de run', () => {
  it('chaque compétence a ses textes (FR)', () => {
    for (const s of RUN_SKILLS) {
      expect(t(`runSkill.${s.id}.name`), s.id).not.toBe(`runSkill.${s.id}.name`);
      expect(t(`runSkill.${s.id}.desc`), s.id).not.toBe(`runSkill.${s.id}.desc`);
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

describe('Journal de bord', () => {
  it('ids uniques, chapitres connus, prédicats et textes FR pour chaque entrée', () => {
    const ids = STORY_ENTRIES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of STORY_ENTRIES) {
      expect(CHAPTERS, e.id).toContain(e.chapter);
      expect(typeof e.check, e.id).toBe('function');
      for (const field of ['title', 'text']) {
        const key = `story.entry.${e.id}.${field}`;
        expect(t(key), key).not.toBe(key);
      }
    }
  });

  it('chaque chapitre a un titre et au moins une entrée', () => {
    for (const c of CHAPTERS) {
      const key = `story.chapter.${c}.title`;
      expect(t(key), key).not.toBe(key);
      expect(
        STORY_ENTRIES.some((e) => e.chapter === c),
        c
      ).toBe(true);
    }
  });
});

describe('succès', () => {
  it('ids uniques, prédicats purs et textes FR', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const a of ACHIEVEMENTS) {
      expect(typeof a.check, a.id).toBe('function');
      for (const field of ['name', 'desc']) {
        const key = `achievement.${a.id}.${field}`;
        expect(t(key), key).not.toBe(key);
      }
    }
  });
});

describe('planètes-boss', () => {
  it('profil ennemi connu, budget et butin sensés, nom FR', () => {
    for (const b of BOSS_PLANETS) {
      expect(ENEMY_PROFILE_IDS, b.id).toContain(b.profile);
      expect(Number.isInteger(b.systemIndex) && b.systemIndex >= 0, b.id).toBe(true);
      expect(b.phasesTotal, b.id).toBeGreaterThanOrEqual(1);
      expect(b.defenseShare, b.id).toBeGreaterThan(0);
      expect(b.lootMultiplier, b.id).toBeGreaterThanOrEqual(1);
      const key = `boss.${b.id}.name`;
      expect(t(key), key).not.toBe(key);
    }
  });
});

describe('mégastructures', () => {
  it('niveaux, coûts multi-ressources, effet et déblocage valides ; textes FR', () => {
    for (const m of MEGASTRUCTURES) {
      expect(m.maxLevel, m.id).toBeGreaterThanOrEqual(3);
      expect(m.maxLevel, m.id).toBeLessThanOrEqual(5);
      expect(m.costGrowth, m.id).toBeGreaterThan(1);
      expect(Object.keys(m.baseCost).length, m.id).toBeGreaterThanOrEqual(2);
      for (const [res, amount] of Object.entries(m.baseCost)) {
        expect(isResource(res), `${m.id}: ${res}`).toBe(true);
        expect(amount, `${m.id}: ${res}`).toBeGreaterThan(0);
      }
      assertLeveledEffect(m.effect, m.id);
      assertUnlock(m.unlock);
      for (const field of ['name', 'desc']) {
        const key = `megastructure.${m.id}.${field}`;
        expect(t(key), key).not.toBe(key);
      }
    }
  });
});

describe('décrets du Sénat', () => {
  it('coût en influence, effets valides, à double tranchant ; textes FR', () => {
    for (const d of DECREES) {
      expect(Object.keys(d.cost), d.id).toEqual(['influence']);
      expect(d.cost.influence, d.id).toBeGreaterThan(0);
      expect(d.effects.length, d.id).toBeGreaterThanOrEqual(2);
      for (const e of d.effects) {
        expect(
          KNOWN_LEVELED_EFFECTS.has(e.type),
          `${d.id}: effet ${e.type}`
        ).toBe(true);
        // perLevel peut être négatif (le prix du décret), jamais nul ni ≤ −100 %.
        expect(e.perLevel, d.id).not.toBe(0);
        expect(e.perLevel, d.id).toBeGreaterThan(-1);
        for (const res of e.resources ?? [])
          expect(isResource(res), `${d.id}: ${res}`).toBe(true);
      }
      // Double tranchant : au moins un avantage ET un inconvénient.
      expect(
        d.effects.some((e) => e.perLevel > 0),
        `${d.id} : aucun avantage`
      ).toBe(true);
      expect(
        d.effects.some((e) => e.perLevel < 0),
        `${d.id} : aucun inconvénient`
      ).toBe(true);
      for (const field of ['name', 'desc']) {
        const key = `decree.${d.id}.${field}`;
        expect(t(key), key).not.toBe(key);
      }
    }
  });
});
