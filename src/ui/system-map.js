// Liste des systèmes explorables (verrouillés par palier de niveau) et
// sous-menu des planètes d'un système sélectionné — remplace l'ancienne
// carte à nœuds (voir game/systems-map.js pour la génération procédurale).

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { icon } from './icons.js';
import { planetTypeIconId } from './icon-map.js';
import { formatNumber } from './format.js';
import { planetArt } from './planet-art.js';

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

/** Liste des systèmes de la run (verrouillé/disponible/conquis). */
export function renderSystemList(engine) {
  const systems = engine.explorationSystems();
  const playerLevel = engine.state.prestige.player.level;
  const root = el('ul', { class: 'board-list system-list' });

  for (const system of systems) {
    const locked = system.requiredLevel > playerLevel;
    const state = system.conquered ? 'done' : locked ? 'locked' : 'afford';
    const subText = locked
      ? t('ui.system.locked', { level: system.requiredLevel })
      : system.conquered
        ? t('ui.system.conqueredTag')
        : t('ui.system.planetCount', { n: system.planets.length });

    root.append(
      el('li', { class: 'board-row', dataset: { state } }, [
        el('div', { class: 'board-row-line' }, [
          el(
            'button',
            {
              class: 'board-row-main system-row',
              type: 'button',
              disabled: locked,
              dataset: { action: 'open-system', id: String(system.index) },
            },
            [
              planetArt(system.archetype, 'row-portrait'),
              el('span', { class: 'row-label' }, [
                el('span', { class: 'row-name', text: system.name }),
                el('span', { class: 'row-sub', text: subText }),
              ]),
            ]
          ),
        ]),
      ])
    );
  }
  return root;
}

/** Sous-menu des planètes d'un système ouvert. */
export function renderPlanetMenu(engine, system) {
  const root = el('div', { class: 'planet-menu' });
  const backBtn = el('button', {
    class: 'btn btn-block',
    type: 'button',
    dataset: { action: 'close-system' },
    text: t('ui.buttons.back'),
  });
  const list = el('ul', { class: 'board-list' });

  for (const planet of system.planets) {
    const combat = planet.type === 'invaded' || planet.type === 'hostile';
    const state = planet.conquered ? 'done' : 'afford';
    list.append(
      el('li', { class: 'board-row', dataset: { state } }, [
        el('div', { class: 'board-row-line' }, [
          el(
            'button',
            {
              class: 'board-row-main planet-row',
              type: 'button',
              disabled: planet.conquered || !combat,
              dataset: {
                action: combat ? 'open-planet-combat' : 'noop',
                id: planet.id,
              },
            },
            [
              icon(planetTypeIconId(planet.type), 'row-pictogram'),
              el('span', { class: 'row-label' }, [
                el('span', {
                  class: 'row-name',
                  text: t(`ui.planetType.${planet.type}`),
                }),
                el('span', {
                  class: 'row-sub',
                  text: planetStatusText(planet),
                }),
              ]),
              // Toujours présent (même vide) : garde le nombre d'enfants
              // constant pour la grille CSS dédiée (.planet-row), qu'il y
              // ait ou non un combat sur cette planète.
              el('span', {
                class: 'row-tail',
                text: combat ? `⚔ ${formatNumber(planet.defenseRating)}` : '',
              }),
            ]
          ),
        ]),
      ])
    );
  }

  root.append(
    el('div', { class: 'system-portrait' }, [
      planetArt(system.archetype, 'system-portrait-art'),
      el('p', {
        class: 'panel-note',
        text: t(`systemArchetype.${system.archetype}`),
      }),
    ]),
    backBtn,
    list
  );
  return root;
}
