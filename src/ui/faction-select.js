// Écran de sélection de faction — obligatoire avant de lancer une run
// (Engine#selectFaction). Réutilise le panneau plein cadre de `modal.js`, en
// mode non-fermable (le joueur doit choisir).

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { FACTIONS } from '../data/factions.js';
import { icon } from './icons.js';
import { factionIconId } from './icon-map.js';
import { openPanel } from './modal.js';

/**
 * Rend la liste de factions (icône, nom, description, niveau ou
 * "Nouvelle") — partagée avec `commander-creation.js` (fiche de création,
 * avant qu'un Engine existe). `factionsMeta` est la forme de
 * `state.prestige.factions` (id -> { level, ... }) ; `onPick(factionId)`
 * est appelé au clic, l'appelant décide de la suite (fermeture de modale,
 * démarrage de partie, etc.).
 * @returns {HTMLUListElement}
 */
export function renderFactionRows(factionsMeta, onPick) {
  const root = el('ul', { class: 'board-list' });
  for (const f of FACTIONS) {
    const level = factionsMeta[f.id]?.level ?? 0;
    const btn = el(
      'button',
      { class: 'board-row-main faction-row', type: 'button' },
      [
        icon(factionIconId(f.id), 'row-pictogram'),
        el('span', { class: 'row-label' }, [
          el('span', { class: 'row-name', text: t(`faction.${f.id}.name`) }),
          el('span', { class: 'row-sub', text: t(`faction.${f.id}.desc`) }),
        ]),
        el('span', {
          class: 'row-tail',
          text:
            level > 0
              ? t('ui.factionSelect.level', { n: level })
              : t('ui.factionSelect.new'),
        }),
      ]
    );
    btn.addEventListener('click', () => onPick(f.id));
    root.append(
      el('li', { class: 'board-row' }, [
        el('div', { class: 'board-row-line' }, [btn]),
      ])
    );
  }
  return root;
}

export function showFactionSelect(engine, { onSelected } = {}) {
  let close;

  const rows = renderFactionRows(
    engine.state.prestige.factions,
    (factionId) => {
      engine.selectFaction(factionId);
      close();
      onSelected?.();
    }
  );

  ({ close } = openPanel(
    t('ui.factionSelect.title'),
    [el('p', { class: 'panel-note', text: t('ui.factionSelect.intro') }), rows],
    { dismissable: false }
  ));
}
