// Textes d'une bataille : noms des piles d'unités et lignes du journal (voir
// `game/battle.js#simulateBattle` pour la forme de ces lignes). Partagé par la
// fenêtre de bataille et la modale d'allocation.

import { t } from '../i18n/index.js';
import { formatNumber } from './format.js';
import { COMBAT_EVENT_BY_ID } from '../data/combatEvents.js';

const cap = (s) => s[0].toUpperCase() + s.slice(1);

/** Noms d'une pile — `token` = « ship:<id> » ou « enemy:<classe> ». */
export function unitNames(token) {
  const [kind, id] = token.split(':');
  return kind === 'ship'
    ? { plural: t(`ship.${id}.name`), one: t(`ship.${id}.one`) }
    : { plural: t(`enemy.classPlural.${id}`), one: t(`enemy.class.${id}`) };
}

/** « 5 Drones », « 1 Frégate ». */
export function stackLabel(token, count) {
  const names = unitNames(token);
  return `${formatNumber(count)} ${count === 1 ? names.one : names.plural}`;
}

/** Texte d'une ligne de journal. */
export function lineText(line) {
  switch (line.id) {
    case 'intro':
      return t(`enemy.profile.${line.profile}.intro`);
    case 'outcome':
      return line.outcome === 'timeout'
        ? t('battle.line.timeout')
        : t(`enemy.profile.${line.profile}.${line.outcome}`);
    case 'dodged':
      return t(
        `battle.line.dodged${cap(line.side)}${line.n === 1 ? 'One' : 'Many'}`,
        { n: formatNumber(line.n) }
      );
    case 'destroyed':
      return t(
        `battle.line.destroyed${cap(line.side)}${line.n === 1 ? 'One' : 'Many'}`,
        { n: formatNumber(line.n), unitOne: unitNames(line.unit).one }
      );
    default: {
      const names = unitNames(line.unit);
      return t(`battle.event.${line.id}.${line.side}`, {
        unit: names.plural,
        unitOne: names.one,
      });
    }
  }
}

/** Couleur d'une ligne, du point de vue du joueur : bonne nouvelle (`good`),
 *  mauvaise (`bad`) ou neutre. Un événement « avantage » vise le camp `side` :
 *  bonne nouvelle si c'est le nôtre, mauvaise si c'est celui de l'ennemi. */
export function lineTone(line) {
  if (line.id === 'intro') return 'neutral';
  if (line.id === 'outcome') {
    if (line.outcome === 'victory') return 'good';
    return line.outcome === 'timeout' ? 'neutral' : 'bad';
  }
  if (line.id === 'destroyed') return line.side === 'enemy' ? 'good' : 'bad';
  if (line.id === 'dodged') return line.side === 'ally' ? 'good' : 'bad';
  const boon = COMBAT_EVENT_BY_ID[line.id]?.kind === 'boon';
  return boon === (line.side === 'ally') ? 'good' : 'bad';
}
