// Terminal DÉPARTS : générateurs (services programmés) + améliorations du clic,
// puis — une fois les technologies correspondantes recherchées — les Chantiers
// (mégastructures) et les décrets du Sénat.

import { el, clear } from '../dom.js';
import { t } from '../../i18n/index.js';
import { GENERATORS } from '../../data/generators.js';
import { CLICK_UPGRADES } from '../../data/upgrades.js';
import { MEGASTRUCTURES } from '../../data/megastructures.js';
import { DECREES, DECREE_BY_ID } from '../../data/decrees.js';
import { resourceCode } from '../../data/resources.js';
import { canAfford } from '../../game/economy.js';
import {
  megastructuresUnlocked,
  decreesUnlocked,
  decreeCost,
} from '../../game/empire.js';
import { revealList } from '../reveal.js';
import {
  formatNumber,
  formatRate,
  formatCost,
  shortCost,
  lockHint,
  timeCode,
} from '../format.js';
import { boardRow, sectionHead, setFacts, setLoadBar } from '../board-row.js';
import {
  generatorIconId,
  clickUpgradeIconId,
  megastructureIconId,
  decreeIconId,
} from '../icon-map.js';
import { effectLine, effectLines } from '../effect-text.js';

export function createShopPanel(engine) {
  const root = el('section', { class: 'panel' });
  let rows = new Map(); // id -> { ...boardRow, def, kind, teased }
  let slotsNote = null; // « Emplacements : 1 / 2 » (section des décrets)
  let built = ''; // signature des sections construites (voir `signature`)

  /** Ce qui décide des lignes présentes : sections débloquées et mégastructures
   * visibles. Si elle change (technologie recherchée, seuil franchi), les lignes
   * sont reconstruites — ces déblocages n'émettent pas d'événement `unlock`. */
  function signature(state) {
    const parts = [megastructuresUnlocked(state), decreesUnlocked(state)];
    if (parts[0]) {
      for (const { def, vis } of revealList(state, MEGASTRUCTURES)) {
        parts.push(`${def.id}:${vis}`);
      }
    }
    return parts.join('|');
  }

  function refresh() {
    const state = engine.state;
    clear(root);
    rows = new Map();
    built = signature(state);

    const genList = el('ul', { class: 'board-list' });
    revealList(state, GENERATORS).forEach(({ def, vis }, i) => {
      const row = boardRow({
        id: def.id,
        action: 'buy-generator',
        iconId: generatorIconId(def.id),
        code: timeCode(i),
        name: t(`generator.${def.id}.name`),
        desc: t(`generator.${def.id}.desc`),
      });
      genList.append(row.root);
      rows.set(def.id, { ...row, def, kind: 'gen', teased: vis === 'teased' });
    });

    const upgList = el('ul', { class: 'board-list' });
    CLICK_UPGRADES.forEach((def, i) => {
      const row = boardRow({
        id: def.id,
        action: 'buy-click-upgrade',
        iconId: clickUpgradeIconId(def.id),
        code: timeCode(20 + i),
        name: t(`clickUpgrade.${def.id}.name`),
        desc: t(`clickUpgrade.${def.id}.desc`),
      });
      upgList.append(row.root);
      rows.set(def.id, { ...row, def, kind: 'upg' });
    });

    root.append(
      el('h2', { text: t('ui.panels.shop') }),
      sectionHead(t('ui.sections.generators')),
      genList,
      sectionHead(t('ui.sections.clickUpgrades')),
      upgList
    );

    slotsNote = null;
    if (megastructuresUnlocked(state)) {
      const megaList = el('ul', { class: 'board-list' });
      revealList(state, MEGASTRUCTURES).forEach(({ def, vis }, i) => {
        const row = boardRow({
          id: def.id,
          action: 'build-megastructure',
          iconId: megastructureIconId(def.id),
          code: timeCode(40 + i),
          name: t(`megastructure.${def.id}.name`),
          desc: t(`megastructure.${def.id}.desc`),
        });
        megaList.append(row.root);
        rows.set(def.id, {
          ...row,
          def,
          kind: 'mega',
          teased: vis === 'teased',
        });
      });
      root.append(
        sectionHead(t('ui.sections.megastructures')),
        el('p', { class: 'panel-note', text: t('ui.labels.megastructuresLead') }),
        megaList
      );
    }

    if (decreesUnlocked(state)) {
      const decreeList = el('ul', { class: 'board-list' });
      DECREES.forEach((def, i) => {
        const row = boardRow({
          id: def.id,
          action: 'toggle-decree',
          iconId: decreeIconId(def.id),
          code: timeCode(56 + i),
          name: t(`decree.${def.id}.name`),
          desc: t(`decree.${def.id}.desc`),
        });
        row.root.classList.add('is-decree');
        decreeList.append(row.root);
        rows.set(def.id, { ...row, def, kind: 'decree' });
      });
      slotsNote = el('p', { class: 'panel-note decree-slots' });
      root.append(
        sectionHead(t('ui.sections.decrees')),
        el('p', { class: 'panel-note', text: t('ui.labels.decreesLead') }),
        slotsNote,
        decreeList
      );
    }
    update();
  }

  function update() {
    const state = engine.state;
    if (signature(state) !== built) {
      refresh();
      return;
    }
    for (const [id, row] of rows) {
      if (row.kind === 'gen') updateGen(state, id, row);
      else if (row.kind === 'mega') updateMega(state, id, row);
      else if (row.kind === 'decree') updateDecree(state, id, row);
      else updateUpg(state, id, row);
    }
    if (slotsNote) {
      const text = t('ui.labels.slots', {
        used: state.run.decrees.length,
        total: engine.decreeSlots(),
      });
      if (slotsNote.textContent !== text) slotsNote.textContent = text;
    }
  }

  function updateMega(state, id, row) {
    const { def, refs, teased } = row;
    const level = state.run.megastructures[id]?.level ?? 0;
    const cost = engine.megastructureCost(id); // null : niveau maximal
    const maxed = !cost;
    const afford = !maxed && canAfford(state, cost);

    refs.sub.textContent = t('ui.labels.levelOf', {
      n: level,
      max: def.maxLevel,
    });
    refs.count.textContent = maxed ? t('ui.labels.maxed') : '';
    setLoadBar(refs.loadBar, level, def.maxLevel);
    refs.cost.textContent = maxed ? '' : shortCost(cost);

    const perLevel = effectLine(def.effect, 1).text;
    setFacts(refs.drawerFacts, [
      [t('ui.labels.effects'), perLevel],
      ...(level > 0 ? [[t('ui.labels.level', { n: level }), effectLine(def.effect, level).text]] : []),
      [t('ui.labels.cost'), maxed ? '—' : formatCost(cost)],
    ]);

    row.root.dataset.state = maxed
      ? 'done'
      : teased
        ? 'locked'
        : afford
          ? 'afford'
          : 'cant';
    refs.main.disabled = maxed || teased || !afford;
    refs.drawerLock.hidden = !teased;
    if (teased) refs.drawerLock.textContent = lockHint(def.unlock);
  }

  function updateDecree(state, id, row) {
    const { refs } = row;
    const def = DECREE_BY_ID[id];
    const adopted = state.run.decrees.includes(id);
    const full = state.run.decrees.length >= engine.decreeSlots();
    const cost = decreeCost(id);
    const afford = canAfford(state, cost);
    const lines = effectLines(def.effects);

    // Résumé sur la ligne (les bonus d'abord, puis le prix à payer) ; le
    // détail coloré est dans le tiroir.
    refs.sub.textContent = [...lines]
      .sort((a, b) => (a.tone === b.tone ? 0 : a.tone === 'good' ? -1 : 1))
      .map((l) => l.text)
      .join('  ·  ');
    refs.count.textContent = adopted ? t('ui.labels.adopted') : '';
    refs.loadBar.replaceChildren();
    refs.cost.textContent = adopted ? '' : formatCost(cost);

    setFacts(refs.drawerFacts, [
      ...lines.map((l) => [l.label, l.value]),
      [t('ui.labels.cost'), formatCost(cost)],
    ]);
    // Teinte bonus / malus des valeurs du tiroir.
    [...refs.drawerFacts.querySelectorAll('dd')].forEach((dd, i) => {
      if (lines[i]) dd.dataset.tone = lines[i].tone;
    });

    row.root.dataset.state = adopted
      ? 'done'
      : full || !afford
        ? 'cant'
        : 'afford';
    // Adopté : toucher la ligne abroge. Sinon : impossible si plein/trop cher.
    refs.main.disabled = adopted ? false : full || !afford;
    refs.drawerLock.hidden = !full || adopted;
    if (full && !adopted) refs.drawerLock.textContent = t('ui.labels.slotsFull');
  }

  function updateGen(state, id, row) {
    const { def, refs, teased } = row;
    const count = state.generators[id]?.count ?? 0;
    const cost = engine.generatorCost(id);
    const afford = (state.resources[def.costResource] ?? 0) >= cost;

    const rate = formatRate((count || 1) * def.rate, def.resource);
    refs.sub.textContent = count ? `×${formatNumber(count)}  ·  ${rate}` : rate;
    refs.count.textContent = '';
    setLoadBar(refs.loadBar, count);
    refs.cost.textContent = `${formatNumber(cost)} ${resourceCode(def.costResource)}`;

    setFacts(refs.drawerFacts, [
      [t('ui.labels.produces'), formatRate(def.rate, def.resource)],
      [t('ui.labels.consumes'), resourceCode(def.costResource)],
      [t('ui.stats.owned'), formatNumber(count)],
    ]);

    row.root.dataset.state = teased ? 'locked' : afford ? 'afford' : 'cant';
    refs.main.disabled = teased || !afford;
    refs.drawerLock.hidden = !teased;
    if (teased) refs.drawerLock.textContent = lockHint(def.unlock);
  }

  function updateUpg(state, id, row) {
    const { refs } = row;
    const entry = state.clickUpgrades[id];
    const cost = engine.clickUpgradeCost(id);
    const afford = state.resources.energy >= cost;
    const owned =
      id === 'autoClicker' ? (entry.count ?? 0) : (entry.level ?? 0);

    refs.sub.textContent =
      id === 'autoClicker'
        ? t('ui.labels.owned', { n: owned })
        : t('ui.labels.level', { n: owned });
    refs.count.textContent = '';
    setLoadBar(refs.loadBar, owned);
    refs.cost.textContent = `${formatNumber(cost)} NRG`;
    setFacts(refs.drawerFacts, [
      [t(`clickUpgrade.${id}.name`), t(`clickUpgrade.${id}.desc`)],
    ]);
    row.root.dataset.state = afford ? 'afford' : 'cant';
    refs.main.disabled = !afford;
  }

  return {
    root,
    refresh,
    update,
    key: 'shop',
    rowToggle: (id) => rows.get(id)?.toggle(),
  };
}
