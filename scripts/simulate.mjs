#!/usr/bin/env node
// Simulation d'équilibrage headless — stratégie gloutonne « action la moins
// chère actuellement accessible ». Réutilise directement les modules purs du
// moteur (src/game/**), sans navigateur ni dépendance supplémentaire. Rapport
// de rythme, pas un test automatisé : lancer avec `npm run simulate`.
//
// Fourchettes attendues (constatées lors de l'écriture de ce script — à
// recontrôler après tout changement d'équilibrage) :
//  - Niveau de faction 0 : première run bouclée en 2-4h de jeu optimisé.
//  - Le temps augmente avec le niveau de faction (plus de systèmes à
//    conquérir, défense plus élevée) mais reste fini avant le plafond de
//    8h — un plafond atteint signale un vrai blocage, pas juste "lent".
//  - Enchaîner plusieurs ascensions avec la même faction doit accélérer
//    nettement (bonus de faction + arbre commun qui s'accumulent).

import { Engine } from '../src/game/engine.js';
import {
  generatorCost,
  shipCost,
  clickUpgradeCost,
  prestigeUpgradeCost,
  factionSkillCost,
  canAfford,
} from '../src/game/economy.js';
import { canAscend } from '../src/game/prestige.js';
import { reachableNodeIds } from '../src/game/nodemap.js';
import { GENERATORS } from '../src/data/generators.js';
import { SHIPS } from '../src/data/fleet.js';
import { TECHNOLOGIES } from '../src/data/technologies.js';
import { CLICK_UPGRADES, PRESTIGE_UPGRADES } from '../src/data/upgrades.js';
import { FACTIONS, FACTION_BY_ID } from '../src/data/factions.js';

const CLICK_RATE = 3; // clics/s, joueur engagé
const TIME_CAP_S = 8 * 3600; // 8h de jeu simulé par run, garde-fou
const MAX_ITERATIONS = 200_000;
const GEN_BY_ID = Object.fromEntries(GENERATORS.map((g) => [g.id, g]));

function fmtTime(s) {
  s = Math.round(s);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h${String(m).padStart(2, '0')}m${String(sec).padStart(2, '0')}s`;
}

function timeToAfford(resources, rates, cost) {
  let t = 0;
  for (const [res, amount] of Object.entries(cost)) {
    const have = resources[res] ?? 0;
    if (have >= amount) continue;
    const rate = rates[res] ?? 0;
    if (rate <= 1e-9) return Infinity;
    t = Math.max(t, (amount - have) / rate);
  }
  return t > 0 ? t + 1e-6 : 0;
}

function advanceState(state, rates, t) {
  for (const [res, rate] of Object.entries(rates)) {
    const delta = rate * t;
    const next = (state.resources[res] ?? 0) + delta;
    state.resources[res] = next < 0 ? 0 : next;
    if (delta > 0) {
      state.totalProduced[res] = (state.totalProduced[res] ?? 0) + delta;
    }
  }
}

function burstBuy(engine, choice) {
  let n = 0;
  const cap = 1_000_000;
  if (choice.type === 'generator') {
    const def = GEN_BY_ID[choice.id];
    while (n < cap) {
      const cost = generatorCost(engine.state, def.id);
      if ((engine.state.resources[def.costResource] ?? 0) < cost) break;
      if (!engine.buyGenerator(def.id)) break;
      n++;
    }
  } else if (choice.type === 'ship') {
    while (n < cap) {
      const cost = shipCost(engine.state, choice.id);
      if (!canAfford(engine.state, cost)) break;
      if (!engine.buyShip(choice.id)) break;
      n++;
    }
  } else if (choice.type === 'tech') {
    if (engine.research(choice.id)) n = 1;
  } else if (choice.type === 'clickUpgrade') {
    while (n < cap) {
      const cost = clickUpgradeCost(engine.state, choice.id);
      if ((engine.state.resources.energy ?? 0) < cost) break;
      if (!engine.buyClickUpgrade(choice.id)) break;
      n++;
    }
  }
  return n;
}

/** Résout en boucle tous les nœuds accessibles non bloqués par la flotte. */
function resolveFreeNodes(engine) {
  let progressed = true;
  while (progressed) {
    progressed = false;
    const map = engine.state.run.exploration.activeMap;
    if (!map) break;
    for (const id of reachableNodeIds(map)) {
      const node = map.nodes[id];
      const gated = node.type === 'invade' || node.type === 'conquest';
      if (!gated || engine.fleetPower >= node.data.defenseRating) {
        engine.chooseNode(id);
        progressed = true;
        break; // la rangée accessible a changé, on repart du début
      }
    }
  }
}

/**
 * Joue une run jusqu'à ce que l'ascension soit possible : la carte doit être
 * épuisée (objectif atteint) ET `quantumEnergy` doit atteindre le seuil
 * d'ascension (les deux sont indépendants dans le jeu réel — finir
 * l'objectif ne garantit pas d'avoir assez de quantumEnergy). Sans cette
 * double condition, `engine.ascend()` échoue silencieusement et la run
 * suivante « termine » instantanément sur une carte déjà vide.
 */
function playRun(engine) {
  let simTime = 0;
  let iterations = 0;
  resolveFreeNodes(engine);

  while (
    (engine.state.run.exploration.activeMap || !canAscend(engine.state)) &&
    simTime < TIME_CAP_S &&
    iterations < MAX_ITERATIONS
  ) {
    iterations++;
    const rates = engine.netRates();
    rates.energy = (rates.energy ?? 0) + CLICK_RATE * engine.clickPower;

    const candidates = [];
    for (const g of GENERATORS) {
      if (!engine.isUnlocked(g.unlock)) continue;
      const cost = { [g.costResource]: generatorCost(engine.state, g.id) };
      candidates.push({
        type: 'generator',
        id: g.id,
        t: timeToAfford(engine.state.resources, rates, cost),
      });
    }
    for (const s of SHIPS) {
      if (!engine.isUnlocked(s.unlock)) continue;
      const cost = shipCost(engine.state, s.id);
      candidates.push({
        type: 'ship',
        id: s.id,
        t: timeToAfford(engine.state.resources, rates, cost),
      });
    }
    for (const tech of TECHNOLOGIES) {
      if (engine.state.technologies[tech.id].unlocked) continue;
      if (!engine.isUnlocked(tech.unlock)) continue;
      candidates.push({
        type: 'tech',
        id: tech.id,
        t: timeToAfford(engine.state.resources, rates, tech.cost),
      });
    }
    for (const cu of CLICK_UPGRADES) {
      const cost = { energy: clickUpgradeCost(engine.state, cu.id) };
      candidates.push({
        type: 'clickUpgrade',
        id: cu.id,
        t: timeToAfford(engine.state.resources, rates, cost),
      });
    }

    candidates.sort((a, b) => a.t - b.t);
    const choice = candidates[0];
    if (!choice || !Number.isFinite(choice.t)) break; // blocage réel

    simTime += choice.t;
    advanceState(engine.state, rates, choice.t);
    burstBuy(engine, choice);
    resolveFreeNodes(engine);
  }

  return {
    simTime,
    completed:
      !engine.state.run.exploration.activeMap && canAscend(engine.state),
    iterations,
  };
}

/** Dépense les PA sur la compétence (commune ou de faction) la moins chère. */
function spendAscensionPoints(engine) {
  let spent = 0;
  const factionId = engine.state.run.factionId;
  const factionDef = factionId ? FACTION_BY_ID[factionId] : null;

  while (spent < 10_000) {
    const candidates = [];
    for (const def of PRESTIGE_UPGRADES) {
      candidates.push({
        kind: 'common',
        id: def.id,
        cost: prestigeUpgradeCost(engine.state, def.id),
      });
    }
    if (factionDef) {
      for (const skill of factionDef.skillTree) {
        candidates.push({
          kind: 'faction',
          id: skill.id,
          cost: factionSkillCost(engine.state, factionId, skill.id),
        });
      }
    }
    candidates.sort((a, b) => a.cost - b.cost);
    const choice = candidates[0];
    if (!choice || engine.state.resources.ascensionPoints < choice.cost) break;
    const ok =
      choice.kind === 'common'
        ? engine.buyPrestigeUpgrade(choice.id)
        : engine.buyFactionSkill(choice.id);
    if (!ok) break;
    spent++;
  }
  return spent;
}

// ─── Rapport 1 : difficulté de l'objectif par niveau de faction (à froid) ──
// Pour chaque faction, simule UNE run en partant d'un niveau de faction
// injecté directement (0/3/6/10), sans aucune compétence achetée au
// préalable. Isole l'effet du seul objectif (plus de systèmes, défense plus
// haute) de l'effet cumulatif des compétences achetées au fil des runs.

console.log(
  "=== Rapport 1 : difficulté de l'objectif par niveau de faction ===\n"
);

for (const faction of FACTIONS) {
  console.log(`-- ${faction.id} --`);
  for (const level of [0, 3, 6, 10]) {
    const engine = new Engine();
    engine.state.prestige.factions[faction.id].level = level;
    engine.selectFaction(faction.id);
    const { simTime, completed, iterations } = playRun(engine);
    const obj = engine.state.run.objective;
    console.log(
      `  niveau ${level} (objectif ${obj?.type ?? '?'} : ${obj?.target ?? '?'}) : ` +
        `${completed ? fmtTime(simTime) : `BLOQUÉ après ${fmtTime(simTime)} (${iterations} itérations)`}`
    );
  }
}

// ─── Rapport 2 : enchaînement de runs (même faction, PA dépensés entre deux) ─
// Simule 5 ascensions d'affilée avec la première faction, en dépensant les
// PA gagnés sur les compétences les moins chères entre chaque run. Doit
// montrer une accélération nette (bonus permanents qui s'accumulent).

console.log(
  '\n=== Rapport 2 : enchaînement de runs (accumulation de compétences) ===\n'
);

{
  const faction = FACTIONS[0];
  const engine = new Engine();
  let totalTime = 0;
  const RUNS = 5;

  for (let i = 1; i <= RUNS; i++) {
    engine.selectFaction(faction.id); // fixe run.factionId avant de dépenser
    const spent = spendAscensionPoints(engine);
    const { simTime, completed } = playRun(engine);
    totalTime += simTime;
    console.log(
      `  run ${i} (PA dépensés avant : ${spent}, niveau ${faction.id} = ` +
        `${engine.state.prestige.factions[faction.id].level}) : ` +
        `${completed ? fmtTime(simTime) : 'BLOQUÉ'} (cumulé ${fmtTime(totalTime)})`
    );
    if (!completed) break;
    engine.ascend();
  }
}
