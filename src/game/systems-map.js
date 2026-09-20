// Génération procédurale des planètes d'un système — remplace la carte à
// nœuds (voir l'ancien `nodemap.js`, retiré). Un système contient 2 à 6
// planètes de 4 types (`invaded`/`hostile`/`uninhabited`/`gas`), générées
// de façon DÉTERMINISTE à partir de l'index du système : la même graine
// donne toujours la même composition, sans qu'il soit nécessaire de la
// sauvegarder intégralement pour la reproduire (voir DÉCISIONS du plan
// « systèmes à planètes »). Aucun `Math.random` ici.

import { seededRng } from './rng.js';
import { BOSS_PLANETS, BOSS_BY_ID } from '../data/systems.js';

// Butin ponctuel d'une planète `invaded` conquise (fraction des
// récompenses du système, comme l'ancien nœud `invade` — voir
// nodemap.js originel, REWARD_FRACTION.invade).
const INVADED_LOOT_FRACTION = 0.3;
// perLevel des buffs "permanents pour la run" (state.run.buffs, remis à
// zéro par endRun()/ascend() — voir economy.js#runMultipliers). Une
// planète isolée doit rapporter plus qu'un ancien nœud bonus solitaire
// (perLevel 0.1) puisqu'il faut désormais conquérir tout un système pour
// en profiter pleinement.
const HOSTILE_BUFF_PER_LEVEL = 0.12;
const UNINHABITED_BUFF_PER_LEVEL = 0.08;
const SYSTEM_BUFF_PER_LEVEL = 0.18;

/** Nombre de planètes du système d'index `index` — grandit lentement,
 * plafonné à 6 pour ne pas rendre un système tardif interminable. */
function planetCountForIndex(index) {
  return Math.min(6, 2 + Math.floor(index / 3));
}

/** Poids de tirage par type : glisse vers plus de combat (`invaded`/
 * `hostile`) et moins de cases gratuites (`uninhabited`/`gas`) à mesure
 * que l'index grandit — plafonné (`hardness`) pour ne jamais éliminer
 * totalement les cases de répit. */
function typeWeights(index) {
  const hardness = Math.min(1, index / 12);
  return {
    invaded: 0.35 + 0.15 * hardness,
    hostile: 0.15 + 0.2 * hardness,
    uninhabited: 0.3 - 0.15 * hardness,
    gas: 0.2 - 0.1 * hardness,
  };
}

function pickType(rng, weights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = rng() * total;
  for (const [type, w] of Object.entries(weights)) {
    roll -= w;
    if (roll <= 0) return type;
  }
  return 'gas';
}

/** Ressource dominante des récompenses du système (sert de cible aux
 * buffs `resourceProductionMultiplier` des planètes/du système). */
function topResourceOf(rewards) {
  const entries = Object.entries(rewards);
  if (entries.length === 0) return null;
  return entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

/**
 * Génère les planètes du système `systemDef` ({ defenseRating, rewards }),
 * pour l'index de run `index` (graine du PRNG — déterministe).
 * @returns {{ planets: object[], topResource: string|null }}
 */
export function generatePlanets(systemDef, index) {
  const rng = seededRng(index * 2654435761 + 1);
  const count = planetCountForIndex(index);
  const weights = typeWeights(index);
  const topResource = topResourceOf(systemDef.rewards);
  const planets = [];

  for (let i = 0; i < count; i++) {
    const type = pickType(rng, weights);
    if (type === 'invaded' || type === 'hostile') {
      // Un système entier requiert désormais de venir à bout de PLUSIEURS
      // planètes (chacune 1-5 phases) plutôt que d'un seul nœud de
      // conquête comme avant les systèmes à planètes — ces deux facteurs
      // (phases, défense par planète) restent donc volontairement modérés
      // pour que le coût total d'un système reste du même ordre de
      // grandeur que l'ancien modèle, pas un multiple.
      const phasesTotal = Math.max(
        1,
        Math.min(5, 1 + Math.floor(rng() * (1 + index / 8)))
      );
      const defenseRating = Math.max(
        1,
        Math.round(
          systemDef.defenseRating * (0.12 + 0.05 * i) * (0.85 + rng() * 0.3)
        )
      );
      planets.push({
        id: `${index}-${i}`,
        type,
        phasesTotal,
        phasesWon: 0,
        defenseRating,
        conquered: false,
      });
    } else {
      planets.push({ id: `${index}-${i}`, type, conquered: false });
    }
  }

  // Planètes-boss (data/systems.js) : ajoutées après le tirage seedé.
  for (const boss of BOSS_PLANETS) {
    if (boss.systemIndex !== index) continue;
    planets.push({
      id: `${index}-${boss.id}`,
      type: 'invaded',
      boss: boss.id,
      phasesTotal: boss.phasesTotal,
      phasesWon: 0,
      defenseRating: Math.max(
        1,
        Math.round(systemDef.defenseRating * boss.defenseShare)
      ),
      conquered: false,
    });
  }

  return { planets, topResource };
}

/** Butin ponctuel d'une planète `invaded` conquise (multiplié pour un boss). */
export function planetLoot(systemDef, planet) {
  const multiplier = BOSS_BY_ID[planet?.boss]?.lootMultiplier ?? 1;
  const out = {};
  for (const [res, amount] of Object.entries(systemDef.rewards)) {
    out[res] = Math.max(
      1,
      Math.floor(amount * INVADED_LOOT_FRACTION * multiplier)
    );
  }
  return out;
}

/** Buff permanent-pour-la-run d'une planète `hostile`/`uninhabited`
 * conquise (`null` si le système n'a aucune récompense, cas dégénéré). */
export function planetBuff(topResource, kind) {
  if (!topResource) return null;
  const perLevel =
    kind === 'hostile' ? HOSTILE_BUFF_PER_LEVEL : UNINHABITED_BUFF_PER_LEVEL;
  return {
    type: 'resourceProductionMultiplier',
    resources: [topResource],
    perLevel,
  };
}

/** Buff système, accordé quand toutes les planètes sont Conquises. */
export function systemBuff(topResource) {
  if (!topResource) return null;
  return {
    type: 'resourceProductionMultiplier',
    resources: [topResource],
    perLevel: SYSTEM_BUFF_PER_LEVEL,
  };
}
