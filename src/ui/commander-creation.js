// Fiche de création de Commandant — nom + choix de faction, affichée à la
// création d'une nouvelle partie (voir src/main.js#bootMenu). Réutilise le
// rendu de lignes de faction de `faction-select.js` (même markup que la
// resélection de faction en cours de run, inchangée par ailleurs) : cliquer
// une faction finalise la création, même motif « clic = choix » déjà en
// place pour la resélection.

import { el, clear } from './dom.js';
import { t } from '../i18n/index.js';
import { createInitialState } from '../game/initial-state.js';
import { renderFactionRows } from './faction-select.js';

/**
 * @param {HTMLElement} host
 * @param {{ onCreate: (choice: { name: string, factionId: string }) => void }} opts
 */
export function showCommanderCreation(host, { onCreate }) {
  clear(host);

  const nameInput = el('input', {
    class: 'commander-name-input',
    type: 'text',
    placeholder: t('commanderCreation.namePlaceholder'),
    maxlength: '24',
    autocomplete: 'off',
  });

  // Les niveaux de faction affichés ici sont toujours "Nouvelle" : créer un
  // Commandant repart d'un état neuf (comme `reset()`), donc les factions le
  // sont aussi — un état neuf jetable suffit à le représenter fidèlement.
  const rows = renderFactionRows(
    createInitialState().prestige.factions,
    (factionId) => {
      onCreate({ name: nameInput.value.trim(), factionId });
    }
  );

  host.append(
    el('div', { class: 'main-menu' }, [
      el('h2', { text: t('commanderCreation.title') }),
      el('p', { class: 'panel-note', text: t('commanderCreation.intro') }),
      el('label', { class: 'commander-name-label' }, [
        el('span', { text: t('commanderCreation.nameLabel') }),
        nameInput,
      ]),
      rows,
    ])
  );

  nameInput.focus();
}
