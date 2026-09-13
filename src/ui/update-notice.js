// Popup "quoi de neuf" — affichée une seule fois par joueur, au premier
// chargement suivant une mise à jour notable (voir data/updates.js). Même
// motif que battle-report.js/run-summary.js (openPanel + bouton unique),
// posée sur le menu principal juste après le boot (voir main.js).

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { openPanel } from './modal.js';
import { CURRENT_UPDATE } from '../data/updates.js';
import { hasSeenUpdate, markUpdateSeen } from './update-progress.js';

export function maybeShowUpdateNotice() {
  if (hasSeenUpdate(CURRENT_UPDATE.id)) return;
  // Marqué vu dès l'affichage, pas seulement à la fermeture — sinon un
  // joueur qui ferme l'onglet sans interagir la reverrait indéfiniment.
  markUpdateSeen(CURRENT_UPDATE.id);

  const btn = el('button', {
    class: 'btn btn-go btn-block',
    type: 'button',
    text: t('ui.buttons.continue'),
  });
  const { close } = openPanel(t(CURRENT_UPDATE.titleKey), [
    el('p', { class: 'panel-note', text: t(CURRENT_UPDATE.introKey) }),
    el(
      'ul',
      { class: 'board-list' },
      CURRENT_UPDATE.bulletKeys.map((k) =>
        el('li', { class: 'board-row', text: t(k) })
      )
    ),
    btn,
  ]);
  btn.addEventListener('click', close);
  btn.focus();
}
