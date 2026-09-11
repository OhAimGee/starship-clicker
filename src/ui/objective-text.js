// Texte de l'objectif de run — partagé entre le panneau Exploration
// (src/ui/panels/exploration.js) et la barre latérale desktop ≥1280px
// (src/ui/app.js), pour ne pas dupliquer la logique de progression par
// type d'objectif.

import { t } from '../i18n/index.js';
import { resourceCode } from '../data/resources.js';
import { formatNumber } from './format.js';

export function objectiveLabel(obj) {
  return `${t('ui.stats.runObjective')} — ${t(`ui.objective.${obj.type}`)}`;
}

export function objectiveProgressText(engine, state, obj) {
  if (obj.type === 'reachFleetPower') {
    return `${formatNumber(engine.fleetPower)} / ${formatNumber(obj.target)} ${t('ui.stats.fleetPower')}`;
  }
  if (obj.type === 'gatherResources') {
    const produced = state.totalProduced[obj.resource] ?? 0;
    return `${formatNumber(produced)} / ${formatNumber(obj.target)} ${resourceCode(obj.resource)}`;
  }
  // conquerAll / conquerOne
  return `${formatNumber(state.run.exploration.conquered.length)} / ${formatNumber(obj.target)}`;
}
