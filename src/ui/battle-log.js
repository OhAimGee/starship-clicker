// Fenêtre de bataille — rejoue le journal d'un combat déjà résolu.
//
// Le moteur a déjà appliqué pertes et récompenses (voir
// `Engine#resolvePlanetCombat`) : cette fenêtre ne fait que raconter le
// combat. Fermer, passer ou couper l'animation ne change donc jamais l'issue.
//
// Déroulé : deux barres de structure agrégées (flotte / ennemi), un compteur
// de round et les lignes du journal ajoutées une à une ; à la fin, le résumé
// (`battle-report.js`). En lecture « résumé » (option) ou avec
// prefers-reduced-motion, tout s'affiche d'emblée et le journal reste
// consultable derrière un bouton.

import { el } from './dom.js';
import { t } from '../i18n/index.js';
import { formatNumber } from './format.js';
import { openPanel } from './modal.js';
import { reducedMotion } from './motion.js';
import { buildBattleSummary } from './battle-report.js';
import {
  getPlayback,
  getSpeed,
  setSpeed,
  PLAYBACK_SPEEDS,
} from './combat-prefs.js';
import { lineText, lineTone, stackLabel } from './battle-text.js';

const STEP_MS = { round: 320, line: 720, bars: 380 };

function compositionText(stacks) {
  return stacks.map((s) => stackLabel(s.token, s.count)).join(' · ');
}

function buildBar(side, label, stacks) {
  const total = stacks.reduce((sum, s) => sum + s.count, 0);
  const count = el('b', { text: t('battle.units', { n: formatNumber(total) }) });
  const fill = el('div', { class: 'battle-bar-fill' });
  fill.style.width = '100%';
  const node = el('div', { class: 'battle-bar', dataset: { side } }, [
    el('div', { class: 'battle-bar-head' }, [
      el('span', { text: label }),
      count,
    ]),
    el('div', { class: 'battle-bar-track' }, [fill]),
    el('p', { class: 'battle-bar-comp', text: compositionText(stacks) }),
  ]);
  return {
    node,
    set(fraction, units) {
      fill.style.width = `${Math.max(0, Math.min(1, fraction)) * 100}%`;
      count.textContent = t('battle.units', { n: formatNumber(units) });
    },
  };
}

/**
 * @param {object} entry charge de l'événement `battle-resolved`
 *   (`Engine#resolvePlanetCombat`) : le résumé + `battle` (journal complet)
 */
export function showBattle(entry) {
  const { battle } = entry;
  const instant = reducedMotion || getPlayback() === 'summary';
  let speed = getSpeed();
  let timer = null;
  let finished = false;

  const allyBar = buildBar('ally', t('battle.allyBar'), battle.start.ally);
  const enemyBar = buildBar('enemy', t('battle.enemyBar'), battle.start.enemy);

  const roundLabel = el('span', { class: 'battle-round' });
  const speedBtn = el('button', { class: 'btn', type: 'button' });
  const skipBtn = el('button', { class: 'btn btn-go', type: 'button' });
  skipBtn.textContent = t('battle.skip');
  const showSpeed = () => {
    speedBtn.textContent = `${t('battle.speed')} ×${speed}`;
  };
  showSpeed();
  const controls = el('div', { class: 'battle-controls', hidden: instant }, [
    roundLabel,
    speedBtn,
    skipBtn,
  ]);

  const log = el('ol', { class: 'battle-log', role: 'log', hidden: instant });
  const summary = el('div', { class: 'battle-summary', hidden: true });
  const logToggle = el('button', {
    class: 'btn btn-block',
    type: 'button',
    text: t('battle.showLog'),
    hidden: true,
  });
  const closeBtn = el('button', {
    class: 'btn btn-go btn-block',
    type: 'button',
    text: t('ui.buttons.close'),
    hidden: true,
  });

  // Le déroulé : pour chaque round, l'intitulé, ses lignes, puis la mise à
  // jour des barres (les pertes ne se voient qu'une fois le round raconté).
  const steps = [];
  for (const round of battle.rounds) {
    steps.push({
      delay: STEP_MS.round,
      run: () => {
        roundLabel.textContent = t('battle.round', { n: round.n });
      },
    });
    for (const line of round.lines) {
      steps.push({
        delay: STEP_MS.line,
        run: () => {
          log.append(
            el(
              'li',
              { class: 'battle-line', dataset: { tone: lineTone(line) } },
              [lineText(line)]
            )
          );
          log.scrollTop = log.scrollHeight;
        },
      });
    }
    steps.push({
      delay: STEP_MS.bars,
      run: () => {
        allyBar.set(round.allyHp, round.allyCount);
        enemyBar.set(round.enemyHp, round.enemyCount);
      },
    });
  }

  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(timer);
    controls.hidden = true;
    summary.replaceChildren(...buildBattleSummary(entry).filter(Boolean));
    summary.hidden = false;
    logToggle.hidden = !instant || log.children.length === 0;
    closeBtn.hidden = false;
    closeBtn.focus();
  }

  let next = 0;
  function tick() {
    if (next >= steps.length) return finish();
    const step = steps[next++];
    step.run();
    timer = setTimeout(tick, step.delay / speed);
  }

  /** Saute directement au résumé : les lignes restantes s'affichent d'un coup. */
  function skip() {
    clearTimeout(timer);
    while (next < steps.length) steps[next++].run();
    finish();
  }

  const { scrim, close } = openPanel(
    t('battle.title'),
    [
      el('p', {
        class: 'battle-note',
        text: t('battle.versus', {
          system: entry.systemName,
          enemy: t(`enemy.profile.${battle.profileId}.name`),
        }),
      }),
      el('div', { class: 'battle-bars' }, [allyBar.node, enemyBar.node]),
      controls,
      log,
      summary,
      logToggle,
      el('div', { class: 'board-modal-actions' }, [closeBtn]),
    ],
    // Pas de fermeture par défaut : Échap / clic sur le fond passent d'abord
    // l'animation (pour que le résumé ne soit jamais manqué), puis ferment.
    { dismissable: false, onClose: () => clearTimeout(timer) }
  );

  const dismiss = () => (finished ? close() : skip());
  scrim.addEventListener('click', (e) => e.target === scrim && dismiss());
  scrim.addEventListener('keydown', (e) => e.key === 'Escape' && dismiss());
  closeBtn.addEventListener('click', close);
  skipBtn.addEventListener('click', skip);
  speedBtn.addEventListener('click', () => {
    speed = PLAYBACK_SPEEDS[(PLAYBACK_SPEEDS.indexOf(speed) + 1) % PLAYBACK_SPEEDS.length];
    setSpeed(speed);
    showSpeed();
  });
  logToggle.addEventListener('click', () => {
    log.hidden = !log.hidden;
    if (!log.hidden) log.scrollTop = log.scrollHeight;
  });

  if (instant) {
    skip();
  } else {
    skipBtn.focus();
    tick();
  }
}
