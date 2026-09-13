// Popup de détail d'un système — remplace l'ancien sous-menu de planètes
// affiché *dans* le panneau Exploration (voir DÉCISIONS du plan « corrige 2
// bugs onglet Exploration ») : même motif que les modales de combat
// (fleet-allocation.js/battle-report.js), avec son propre bouton de
// fermeture indépendant de tout état de panneau — élimine le bug de
// navigation mobile (retour impossible une fois un système conquis) par
// construction, plutôt que de le corriger au cas par cas.

import { el, clear } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { planetTypeIconId } from './icon-map.js';
import { formatNumber } from './format.js';
import { resourceCode } from '../data/resources.js';
import { openPanel } from './modal.js';
import { planetArt } from './planet-art.js';
import { showFleetAllocation } from './fleet-allocation.js';
import { planetLoot, planetBuff } from '../game/systems-map.js';
import { techMultipliers } from '../game/economy.js';

function rewardLine(rewards) {
  return Object.entries(rewards)
    .map(([res, amt]) => `+${formatNumber(amt)} ${resourceCode(res)}`)
    .join('  ·  ');
}

function buffLine(buff) {
  if (!buff) return '';
  const pct = Math.round(buff.perLevel * 100);
  return buff.resources
    .map((res) => `+${pct}% ${resourceCode(res)}`)
    .join('  ·  ');
}

function planetStatusText(planet) {
  if (planet.conquered) return t('ui.planet.conquered');
  if (planet.type === 'invaded' || planet.type === 'hostile') {
    return t('ui.planet.phaseProgress', {
      won: planet.phasesWon,
      total: planet.phasesTotal,
    });
  }
  return t('ui.planet.pending');
}

/** Texte d'aperçu de récompense d'une planète (voir DÉCISIONS du plan :
 * butin ponctuel pour `invaded`, buff de production pour `hostile`/
 * `uninhabited` — gagné dès la conquête, sauf `hostile` qui exige en plus
 * `xenoColonization` pour toucher la récompense, voir `Engine#
 * resolvePlanetCombat`). */
function rewardPreview(engine, system, planet) {
  if (planet.type === 'invaded') {
    return rewardLine(planetLoot(system));
  }
  if (planet.type === 'hostile') {
    return buffLine(planetBuff(system.topResource, 'hostile'));
  }
  if (planet.type === 'uninhabited') {
    return buffLine(planetBuff(system.topResource, 'uninhabited'));
  }
  return t('ui.planet.noReward');
}

function planetRow(engine, system, planet, rebuild) {
  const combat = planet.type === 'invaded' || planet.type === 'hostile';
  const infoRow = el('div', { class: 'board-row-line' }, [
    el('div', { class: 'board-row-main is-static' }, [
      icon(planetTypeIconId(planet.type), 'row-pictogram'),
      el('span', { class: 'row-label' }, [
        el('span', {
          class: 'row-name',
          text: t(`ui.planetType.${planet.type}`),
        }),
        el('span', { class: 'row-sub', text: planetStatusText(planet) }),
      ]),
      combat
        ? el('span', {
            class: 'row-tail',
            text: `⚔ ${formatNumber(planet.defenseRating)}`,
          })
        : null,
    ]),
  ]);

  const rewardNote = el('p', {
    class: 'panel-note',
    text: rewardPreview(engine, system, planet),
  });

  // Une planète hostile sans `xenoColonization` n'offre aucune récompense
  // (voir `Engine#resolvePlanetCombat`) et la conquête y est définitive :
  // l'attaquer avant d'avoir la techno gâcherait la planète pour rien, sans
  // possibilité de revenir la conquérir plus tard. On bloque donc l'accès
  // au combat tant que la techno n'est pas acquise, plutôt que de laisser
  // gagner un combat qui ne rapporte rien.
  const hostileLocked =
    planet.type === 'hostile' &&
    !techMultipliers(engine.state).unlockHostileColonization;

  let actions = null;
  if (hostileLocked) {
    actions = el('p', {
      class: 'panel-note',
      text: t('ui.planet.hostileLocked'),
    });
  } else if (combat && !planet.conquered) {
    const engageBtn = el('button', {
      class: 'btn btn-go',
      type: 'button',
      text: t('ui.buttons.engage'),
    });
    engageBtn.addEventListener('click', () => {
      showFleetAllocation(engine, planet.defenseRating, (allocation) => {
        engine.resolvePlanetCombat(planet.id, allocation);
        rebuild();
      });
    });
    actions = el('div', { class: 'board-modal-actions' }, [engageBtn]);
  }

  return el(
    'li',
    { class: 'board-row', dataset: { state: planet.conquered ? 'done' : 'afford' } },
    [infoRow, rewardNote, actions]
  );
}

/** Ouvre la popup de détail du système `systemIndex` (vérifie le palier de
 * niveau requis via `Engine#openSystem`, inchangé — résout immédiatement
 * les planètes `uninhabited`/`gas` à la première ouverture). */
export function showSystemDetail(engine, systemIndex) {
  if (!engine.openSystem(systemIndex)) return;
  const system = engine.activeSystem();
  if (!system) return;

  const bodyHost = el('div', { class: 'system-detail' });
  const { close } = openPanel(system.name, [bodyHost], {
    dismissable: true,
    onClose: () => engine.closeSystemMenu(),
  });

  function rebuild() {
    const current = engine.activeSystem();
    clear(bodyHost);
    const closeBtn = el('button', {
      class: 'btn btn-block',
      type: 'button',
      text: t('ui.buttons.close'),
    });
    closeBtn.addEventListener('click', close);
    bodyHost.append(
      el('div', { class: 'system-portrait' }, [
        planetArt(current.archetype, 'system-portrait-art'),
        el('p', {
          class: 'panel-note',
          text: t(`systemArchetype.${current.archetype}`),
        }),
      ]),
      el(
        'ul',
        { class: 'board-list' },
        current.planets.map((p) => planetRow(engine, current, p, rebuild))
      ),
      closeBtn
    );
  }

  rebuild();
}
