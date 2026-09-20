// Panneau ressources : une ligne par ressource, la figure tourne palette par
// palette. Dévoilement progressif : une ressource n'apparaît qu'une fois
// produite au moins une fois.
//
// Le même DOM sert les deux présentations (voir styles.css) : sur mobile, un
// « bandeau de jetons » défilant d'une ligne (pictogramme · code · figure ·
// lampe) surmonte la ligne Niveau ; ≥ 720 px, la grille / colonne latérale
// habituelle (pictogramme · nom · figure · débit).

import { el, clear } from './dom.js';
import { RESOURCES, resourceCode } from '../data/resources.js';
import { t } from '../i18n/index.js';
import {
  formatBoard,
  formatNumber,
  formatRate,
  formatRateNumber,
} from './format.js';
import { createFlap } from './flap.js';
import { icon } from './icons.js';
import { resourceIconId } from './icon-map.js';
import { xpForLevel } from '../game/leveling.js';

const ALWAYS = new Set(['energy']);

function isVisible(state, id) {
  if (ALWAYS.has(id)) return true;
  if (id === 'ascensionPoints') {
    return state.prestige.ascensions > 0 || state.resources.ascensionPoints > 0;
  }
  return (state.totalProduced[id] ?? 0) > 0 || (state.resources[id] ?? 0) > 0;
}

/** « +48.6/s » — vide quand le débit est nul (la ligne reste discrète). */
function rateLabel(v) {
  if (Math.abs(v) < 0.005) return '';
  return `${v > 0 ? '+' : ''}${formatRateNumber(v)}${t('ui.labels.perSecondShort')}`;
}

const setText = (node, text) => {
  if (node.textContent !== text) node.textContent = text;
};

export function createResourcesBoard(engine) {
  const root = el('div', {
    class: 'resources-board',
    role: 'group',
    'aria-label': t('ui.a11y.resources'),
  });
  let flaps = new Map();
  let prev = new Map();
  let signature = '';

  // Niveau de joueur (XP) — toujours visible, en tête du panneau (voir
  // game/leveling.js). Pas une ressource : ligne dédiée avec une barre de
  // progression au lieu d'une figure qui tourne. Sur mobile, le débit
  // d'énergie prend la place du compteur d'XP (bandeau « Niv. N ▬▬ +x NRG/s »).
  const levelValue = el('span', { class: 'player-level-value' });
  const xpFill = el('div', { class: 'xp-bar-fill' });
  const xpLabel = el('span', { class: 'xp-bar-label' });
  const levelRate = el('span', { class: 'player-level-rate' });
  const levelRow = el('div', { class: 'res-row player-level-row' }, [
    icon('ascensionPoints', 'pictogram'),
    el('span', { class: 'res-name', text: t('ui.stats.playerLevel') }),
    el('span', { class: 'player-level-tail' }, [
      levelValue,
      el('div', { class: 'xp-bar' }, [xpFill]),
      xpLabel,
      levelRate,
    ]),
  ]);

  const visibleIds = () =>
    RESOURCES.filter((r) => isVisible(engine.state, r.id)).map((r) => r.id);

  function refresh(rates = engine.netRates()) {
    signature = visibleIds().join(',');
    flaps = new Map();
    clear(root);
    const strip = el('div', { class: 'res-strip' });
    root.append(levelRow, strip);
    for (const id of visibleIds()) {
      const figure = createFlap('0');
      const rate = el('span', { class: 'res-rate' });
      const row = el('div', { class: 'res-row', dataset: { res: id } }, [
        icon(resourceIconId(id), 'pictogram'),
        el('span', { class: 'res-name', text: t(`resource.${id}`) }),
        el('span', {
          class: 'res-code',
          'aria-hidden': 'true',
          text: resourceCode(id),
        }),
        el('span', { class: 'res-figure' }, [figure.node]),
        rate,
        el('span', { class: 'res-lamp', 'aria-hidden': 'true' }),
      ]);
      strip.append(row);
      flaps.set(id, { figure, row, rate });
    }
    update(rates);
  }

  function updateLevel(rates) {
    const p = engine.state.prestige.player;
    const need = xpForLevel(p.level);
    setText(levelValue, t('ui.labels.level', { n: p.level }));
    xpFill.style.width = `${Math.min(100, (p.xp / need) * 100)}%`;
    setText(xpLabel, `${formatNumber(p.xp)} / ${formatNumber(need)}`);
    const energy = rates.energy ?? 0;
    setText(levelRate, formatRate(energy, 'energy'));
    levelRate.dataset.sign = energy < 0 ? 'neg' : 'pos';
  }

  /** @param {Record<string, number>} [rates] débits nets (par défaut : calculés ici) */
  function update(rates = engine.netRates()) {
    if (visibleIds().join(',') !== signature) return refresh(rates);
    updateLevel(rates);
    for (const [id, { figure, row, rate }] of flaps) {
      const value = engine.state.resources[id] ?? 0;
      figure.set(formatBoard(value));
      const before = prev.get(id) ?? value;
      row.dataset.trend =
        value > before + 0.01 ? 'up' : value < before - 0.01 ? 'down' : 'flat';
      prev.set(id, value);

      const r = rates[id] ?? 0;
      setText(rate, rateLabel(r));
      rate.dataset.sign = r > 0.005 ? 'pos' : r < -0.005 ? 'neg' : 'zero';
    }
  }

  return { root, refresh, update };
}
