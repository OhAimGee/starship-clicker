// Script du tutoriel guidé — liste plate d'étapes (même esprit que
// generators.js/runSkills.js : de la donnée, pas de DOM/i18n rendu ici).
// Chaque étape est soit gatée par une vraie action de jeu (`advance:
// 'wait'`, complétion détectée via un événement du moteur ou un clic
// d'onglet), soit un simple passage explicatif (`advance: 'button'`).
//
// `topUp(engine)` (optionnel) comble discrètement le manque de ressources
// juste avant/pendant une étape d'achat, pour ne jamais forcer de grind —
// voir Engine#grantResources, réservé au tutoriel. Le contrôleur
// (src/ui/tutorial.js) l'appelle à l'affichage de l'étape ET à chaque
// tentative incomplète (ex. entre le 1er et le 2e achat de vaisseau).

function topUpForCost(engine, costMap) {
  const missing = {};
  for (const [res, amount] of Object.entries(costMap)) {
    const have = engine.state.resources[res] ?? 0;
    if (have < amount) missing[res] = amount - have;
  }
  if (Object.keys(missing).length > 0) engine.grantResources(missing);
}

function topUpObjective(engine) {
  const obj = engine.state.run.objective;
  if (!obj || obj.type !== 'gatherResources') return;
  const have = engine.state.totalProduced[obj.resource] ?? 0;
  if (have < obj.target) {
    engine.grantResources({ [obj.resource]: obj.target - have });
  }
}

// La flotte tout juste achetée coûte de la maintenance en énergie chaque
// seconde (voir Engine#tick) ; à ce stade du tutoriel, la production
// d'énergie est encore minime, donc un joueur qui prend quelques secondes
// pour lire une étape peut voir sa flotte partiellement/totalement perdue
// par attrition avant même d'avoir ouvert un système. On maintient une
// réserve d'énergie couvrant une longue marge (2 minutes) à chaque étape
// tant que la flotte est nécessaire — jamais un excédent, juste un plancher.
const FLEET_BUFFER_SECONDS = 120;
function ensureFleetSurvives(engine) {
  const need = engine.fleetMaintenance * FLEET_BUFFER_SECONDS;
  const have = engine.state.resources.energy ?? 0;
  if (have < need) engine.grantResources({ energy: need - have });
}

// Le combat est aléatoire : le premier assaut (2 chasseurs, ≈ 95 % de chances
// de victoire) peut échouer et coûter les chasseurs. Le tutoriel les remplace
// pour ne jamais laisser le joueur bloqué sans flotte.
const TUTORIAL_FIGHTERS = 2;
function ensureTutorialFleet(engine) {
  ensureFleetSurvives(engine);
  const missing = TUTORIAL_FIGHTERS - (engine.state.ships.fighters?.count ?? 0);
  if (missing > 0) engine.grantShips({ fighters: missing });
}

export const TUTORIAL_STEPS = [
  {
    id: 'intro',
    target: null,
    placement: 'center',
    titleKey: 'tutorial.steps.intro.title',
    bodyKeys: ['tutorial.steps.intro.body1', 'tutorial.steps.intro.body2'],
    advance: 'button',
  },
  {
    id: 'click',
    target: '.launch[data-action="click-mothership"]',
    placement: 'auto',
    titleKey: 'tutorial.steps.click.title',
    bodyKeys: ['tutorial.steps.click.body1'],
    advance: 'wait',
    waitFor: { engineEvent: 'click' },
  },
  {
    id: 'buySolar',
    target: '[data-action="buy-generator"][data-id="solarPanel"]',
    requiresTab: 'shop',
    placement: 'auto',
    titleKey: 'tutorial.steps.buySolar.title',
    bodyKeys: ['tutorial.steps.buySolar.body1'],
    advance: 'wait',
    topUp: (engine) =>
      topUpForCost(engine, { energy: engine.generatorCost('solarPanel') }),
    waitFor: {
      engineEvent: 'changed',
      check: (engine) => engine.state.generators.solarPanel.count >= 1,
    },
  },
  {
    id: 'buyMining',
    target: '[data-action="buy-generator"][data-id="miningDrone"]',
    requiresTab: 'shop',
    placement: 'auto',
    titleKey: 'tutorial.steps.buyMining.title',
    bodyKeys: ['tutorial.steps.buyMining.body1'],
    advance: 'wait',
    topUp: (engine) =>
      topUpForCost(engine, { energy: engine.generatorCost('miningDrone') }),
    waitFor: {
      engineEvent: 'changed',
      check: (engine) => engine.state.generators.miningDrone.count >= 1,
    },
  },
  {
    id: 'goFleetTab',
    target: '.terminal-bar [data-action="tab"][data-id="fleet"]',
    placement: 'auto',
    titleKey: 'tutorial.steps.goFleetTab.title',
    bodyKeys: ['tutorial.steps.goFleetTab.body1'],
    advance: 'wait',
    waitFor: { tab: 'fleet' },
  },
  {
    id: 'buyFighters',
    target: '[data-action="buy-ship"][data-id="fighters"]',
    requiresTab: 'fleet',
    placement: 'auto',
    titleKey: 'tutorial.steps.buyFighters.title',
    bodyKeys: ['tutorial.steps.buyFighters.body1', 'tutorial.steps.buyFighters.body2'],
    advance: 'wait',
    topUp: (engine) => topUpForCost(engine, engine.shipCost('fighters')),
    waitFor: {
      engineEvent: 'changed',
      check: (engine) => engine.state.ships.fighters.count >= 2,
    },
  },
  {
    id: 'goExplorationTab',
    target: '.terminal-bar [data-action="tab"][data-id="exploration"]',
    placement: 'auto',
    titleKey: 'tutorial.steps.goExplorationTab.title',
    bodyKeys: ['tutorial.steps.goExplorationTab.body1'],
    advance: 'wait',
    topUp: ensureFleetSurvives,
    waitFor: { tab: 'exploration' },
  },
  {
    id: 'openSystem0',
    target: '[data-action="open-system"][data-id="0"]',
    requiresTab: 'exploration',
    placement: 'auto',
    titleKey: 'tutorial.steps.openSystem0.title',
    bodyKeys: ['tutorial.steps.openSystem0.body1'],
    advance: 'wait',
    topUp: ensureFleetSurvives,
    waitFor: {
      engineEvent: 'changed',
      check: (engine) => engine.activeSystem()?.index === 0,
    },
  },
  {
    id: 'engageCombat',
    target: null,
    placement: 'fixed-bottom',
    titleKey: 'tutorial.steps.engageCombat.title',
    bodyKeys: ['tutorial.steps.engageCombat.body1'],
    retryTextKey: 'tutorial.steps.engageCombat.retry',
    advance: 'wait',
    topUp: ensureTutorialFleet,
    waitFor: {
      engineEvent: 'battle-resolved',
      check: (engine, payload) => payload.victory === true,
    },
  },
  {
    id: 'systemConquered',
    target: null,
    placement: 'fixed-bottom',
    titleKey: 'tutorial.steps.systemConquered.title',
    bodyKeys: ['tutorial.steps.systemConquered.body1'],
    advance: 'wait',
    waitFor: {
      engineEvent: 'changed',
      check: (engine) => engine.activeSystem() === null,
    },
  },
  {
    id: 'showLevelXp',
    target: '.resources-board .player-level-row',
    placement: 'auto',
    titleKey: 'tutorial.steps.showLevelXp.title',
    bodyKeys: ['tutorial.steps.showLevelXp.body1'],
    advance: 'button',
  },
  {
    id: 'goTechnologyTab',
    target: '.terminal-bar [data-action="tab"][data-id="technology"]',
    placement: 'auto',
    titleKey: 'tutorial.steps.goTechnologyTab.title',
    bodyKeys: ['tutorial.steps.goTechnologyTab.body1'],
    advance: 'wait',
    waitFor: { tab: 'technology' },
  },
  {
    id: 'mentionFleetSkills',
    target: null,
    placement: 'center',
    titleKey: 'tutorial.steps.mentionFleetSkills.title',
    bodyKeys: ['tutorial.steps.mentionFleetSkills.body1'],
    advance: 'button',
  },
  {
    id: 'goAscensionTab',
    target: '.terminal-bar [data-action="tab"][data-id="ascension"]',
    placement: 'auto',
    titleKey: 'tutorial.steps.goAscensionTab.title',
    bodyKeys: ['tutorial.steps.goAscensionTab.body1'],
    advance: 'wait',
    waitFor: { tab: 'ascension' },
  },
  {
    id: 'explainEndRun',
    target: '[data-action="end-run"]',
    requiresTab: 'ascension',
    placement: 'auto',
    titleKey: 'tutorial.steps.explainEndRun.title',
    bodyKeys: ['tutorial.steps.explainEndRun.body1'],
    advance: 'wait',
    topUp: topUpObjective,
    waitFor: { engineEvent: 'run-ended' },
  },
  {
    id: 'factionReselect',
    target: null,
    placement: 'fixed-bottom',
    titleKey: 'tutorial.steps.factionReselect.title',
    bodyKeys: ['tutorial.steps.factionReselect.body1'],
    advance: 'wait',
    waitFor: { engineEvent: 'run-started' },
  },
  {
    id: 'explainTrueAscension',
    target: '[data-action="ascend"]',
    requiresTab: 'ascension',
    placement: 'auto',
    titleKey: 'tutorial.steps.explainTrueAscension.title',
    bodyKeys: [
      'tutorial.steps.explainTrueAscension.body1',
      'tutorial.steps.explainTrueAscension.body2',
    ],
    advance: 'button',
  },
  {
    id: 'complete',
    target: null,
    placement: 'center',
    titleKey: 'tutorial.steps.complete.title',
    bodyKeys: ['tutorial.steps.complete.body1'],
    advance: 'button',
    isLast: true,
  },
];
