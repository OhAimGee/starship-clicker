// Terminal CLIC : grande zone de clic tactile dédiée (mobile). Le contrôle
// LANCER global (voir app.js, visible sur tous les onglets) n'est pas
// remplacé — cet onglet en offre une version agrandie, pensée pour un tap
// confortable, réutilisant exactement le même contrôle (`Engine#click()`,
// `bindHold`) et la même classe visuelle `.launch`.

import { el } from '../dom.js';
import { t } from '../../i18n/index.js';
import { formatNumber } from '../format.js';
import { bindHold } from '../motion.js';
import { createFlap } from '../flap.js';

export function createClickPanel(engine) {
  const root = el('section', { class: 'panel' });
  let powerFlap;
  let totalClicksValue;

  function refresh() {
    root.replaceChildren();

    const label = el('span', {
      class: 'launch-label',
      text: t('ui.buttons.launch'),
    });
    powerFlap = createFlap('1');
    const figure = el(
      'span',
      { class: 'launch-figure', 'aria-hidden': 'true' },
      ['+', powerFlap.node, ' NRG']
    );
    const button = el(
      'button',
      {
        class: 'launch',
        type: 'button',
        // Zone de clic agrandie par rapport au bouton LANCER global (barre
        // fine) — même composant visuel, juste plus haut pour un tap
        // mobile confortable, sans nouvelle règle CSS.
        style: 'min-height: min(48vh, 22rem); margin-bottom: var(--gap);',
        dataset: { action: 'click-mothership' },
        'aria-label': `${t('ui.buttons.launch')} — ${t('ui.mothership')}`,
      },
      [label, figure]
    );
    bindHold(button, () => engine.click());

    totalClicksValue = el('b');
    const stats = el('ul', { class: 'stat-grid' }, [
      el('li', {}, [
        el('span', { text: t('ui.stats.totalClicks') }),
        totalClicksValue,
      ]),
    ]);

    root.append(el('h2', { text: t('ui.panels.click') }), button, stats);
    update();
  }

  function update() {
    powerFlap.set(formatNumber(engine.clickPower));
    totalClicksValue.textContent = formatNumber(engine.state.totalClicks);
  }

  return { root, refresh, update, key: 'click' };
}
