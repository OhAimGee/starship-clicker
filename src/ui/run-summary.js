// Résumé de fin de run — popup affichée juste après `Engine#endRun()`
// (voir événement 'run-ended'), avant la resélection de faction
// obligatoire. Même motif que `battle-report.js` : `openPanel` non
// dismissable (le joueur doit passer par "Continuer", qui enchaîne sur
// l'étape suivante — jamais skippable par un clic sur le fond ou Échap).

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { formatNumber } from './format.js';
import { resourceCode } from '../data/resources.js';
import { openPanel } from './modal.js';

/**
 * @param {{ points: number, summary: { resources: Record<string, number>, systemsConquered: number } }} data
 * @param {{ onContinue?: () => void }} opts
 */
export function showRunSummary({ points, summary }, { onContinue } = {}) {
  // ascensionPoints est déjà affiché séparément ci-dessous ("points
  // gagnés") — exclu ici pour ne pas le doubler dans la liste de
  // ressources récoltées.
  const resourceEntries = Object.entries(summary.resources).filter(
    ([res, v]) => res !== 'ascensionPoints' && v > 0
  );

  const btn = el('button', {
    class: 'btn btn-go btn-block',
    type: 'button',
    text: t('ui.buttons.continue'),
  });

  const { close } = openPanel(
    t('ui.runSummary.title'),
    [
      el('p', { class: 'panel-note', text: t('ui.runSummary.intro') }),
      el('ul', { class: 'stat-grid' }, [
        el('li', {}, [
          el('span', { text: t('ui.stats.conquered') }),
          el('b', { text: formatNumber(summary.systemsConquered) }),
        ]),
        el('li', {}, [
          el('span', { text: t('ui.runSummary.pointsEarned') }),
          el('b', { text: formatNumber(points) }),
        ]),
      ]),
      resourceEntries.length > 0
        ? el('p', {
            class: 'board-modal-gains',
            text: resourceEntries
              .map(([res, amt]) => `+${formatNumber(amt)} ${resourceCode(res)}`)
              .join('  '),
          })
        : el('p', { class: 'panel-note', text: t('ui.runSummary.noResources') }),
      btn,
    ],
    { dismissable: false }
  );
  btn.addEventListener('click', () => {
    close();
    onContinue?.();
  });
  btn.focus();
}
