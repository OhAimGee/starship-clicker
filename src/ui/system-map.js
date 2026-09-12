// Liste des systèmes explorables (verrouillés par palier de niveau) —
// remplace l'ancienne carte à nœuds (voir game/systems-map.js pour la
// génération procédurale). Le détail d'un système sélectionné (planètes,
// statut, combat) s'affiche désormais dans une popup — voir
// `system-detail.js#showSystemDetail` — pas ici.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { planetArt } from './planet-art.js';

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
