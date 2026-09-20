// Constantes de réglage du jeu. Tout ce qui se tune sans toucher à la logique.

export const CONFIG = {
  // Boucle
  tickMs: 1000, // 1 tick logique = 1 seconde de simulation
  maxCatchupTicks: 20, // nb max de ticks rattrapés d'un coup (onglet en veille)

  // Sauvegarde
  saveIntervalMs: 10_000,

  // Progression hors-ligne
  offlineCapMs: 8 * 60 * 60 * 1000, // 8 h
  offlineMinMs: 60_000, // en-dessous, on ne montre pas de rapport

  // Fin de run / Ascension (prestige). Deux paliers distincts (voir
  // game/prestige.js) : `endRun()` (fréquent, gagné dès l'objectif de run
  // rempli — récompense petite : niveau de faction +1) et `ascend()` (rare,
  // gagné au niveau de faction seuil — récompense forte : choix d'un bonus
  // permanent + New Game+ pour toutes les factions).
  ascension: {
    quantumCost: 1000, // 🔮 — n'est plus une condition, seulement `potentialPoints()`
    pointsDivisor: 1000, // points = floor(quantumEnergy / divisor)
    // Bonus permanents cumulés par run terminée (state.prestige.ascensions)
    clickPerAscension: 0.1, // +10 % pouvoir de clic
    productionPerAscension: 0.2, // +20 % production
    fleetPerAscension: 0.15, // +15 % puissance de flotte
    // Petit capital de redémarrage, par run terminée
    restartGrant: { energy: 150, metal: 75, crystals: 40, antimatter: 6 },
    // Réduction permanente du coût des générateurs à chaque run terminée
    generatorCostReduction: 0.9,
    // Niveau de faction requis pour la vraie Ascension (rare, New Game+)
    factionLevelThreshold: 10,
  },

  // Événements aléatoires
  events: {
    cooldownMs: 90_000,
    chance: 0.25, // probabilité à chaque fenêtre passée le cooldown
  },

  // Économie
  shipCostGrowth: 1.2, // multiplicateur de coût par vaisseau construit
  conqueredIncomeFraction: 0.1, // fraction des récompenses versée /s par système conquis
  maintenanceAttritionRate: 0.05, // part de flotte perdue /s en cas de déficit d'énergie
  neuralNetBuyThreshold: 10, // n'auto-achète que si on a 10x le coût (tech neuralNetworks)

  // Run (rogue-like) : carte à nœuds, objectif, progression de faction
  run: {
    // rangées intérieures de la carte à nœuds ; la dernière rangée n'a
    // toujours qu'1 nœud (type `finalNodeType`, la conquête du système).
    map: { rows: [2, 3, 3, 2], finalNodeType: 'conquest' },
    baseSystems: 5, // nb de systèmes-objectif au niveau de faction 0
    systemsPerLevel: 1, // systèmes supplémentaires par niveau de faction
    defenseGrowthPerLevel: 0.12, // multiplicateur de défense par niveau de faction
    skillPointToApBonus: 0.5, // PA bonus par point de compétence de run à l'ascension
    // Objectifs "rapides" des premiers niveaux de faction (voir data/objectives.js)
    fleetPowerObjectiveBase: 20,
    fleetPowerObjectivePerLevel: 15,
    resourceObjectiveResource: 'energy',
    resourceObjectiveBase: 500,
    resourceObjectivePerLevel: 200,
  },

  // Combat vivant (voir game/battle.js) : bataille simulée round par round,
  // graine aléatoire par engagement. Chaque vaisseau (et chaque unité
  // ennemie) a une taille `armorTier` (0-7) qui fixe son calibre, son
  // blindage et son esquive.
  combat: {
    maxRounds: 40, // au-delà, le camp le moins entamé l'emporte
    // PV = attaque × (hpRatioBase + hpRatioPerTier × taille) : règle des
    // vaisseaux de `data/fleet.js` (testée) ET des ennemis. Elle compense
    // l'esquive : PV / (1 − esquive) est quasi constant d'une taille à l'autre,
    // donc à puissance égale aucune taille n'est meilleure « en soi » — seuls
    // les rapports de taille entre les deux camps comptent (voir docs/ROADMAP.md,
    // loi de Lanchester).
    hpRatioBase: 3.2,
    hpRatioPerTier: 0.12,
    // Esquive d'une cible = base − perTier × taille (plancher `evasionMin`).
    evasionBase: 0.2,
    evasionPerTier: 0.03,
    evasionMin: 0.02,
    // Efficacité d'un tir = 1 − penalty × (blindage cible − calibre tireur),
    // bornée à [minEfficiency, 1] : un petit calibre touche mal un gros blindage.
    armorPenaltyPerTier: 0.1,
    minEfficiency: 0.5,
    // Dégâts en trop d'un tir (au-delà des PV d'UN vaisseau) : cette fraction
    // se répercute sur les vaisseaux voisins, le reste est gaspillé — un gros
    // tir perd donc au plus la moitié de sa puissance sur une petite cible.
    overkillSpill: 0.5,
    // Multiplicateur global des dégâts : règle la durée des batailles.
    damageScale: 0.7,
    // Part des vaisseaux détruits que les chantiers récupèrent après la
    // bataille (épaves réparées) : le journal montre la destruction, mais la
    // facture réelle est plus douce. Réduite en cas de défaite (épaves aux
    // mains de l'ennemi).
    salvageRate: 0.5,
    salvageRateDefeat: 0.25,
    // Événements aléatoires : chance qu'un round en compte au moins un, puis
    // un second (voir data/combatEvents.js).
    eventChance: 0.6,
    secondEventChance: 0.25,
    // Repli automatique : sous cette fraction de PV restants (et plus entamée
    // que l'ennemi), la flotte se replie — les survivants sont sauvés.
    retreatThreshold: 0.2,
    // Aide à l'allocation (voir game/battle.js#safeAllocation).
    winChanceTarget: 0.8, // chance de victoire visée par le pré-remplissage
    estimateRuns: 100, // simulations pour estimer une chance de victoire
    searchRuns: 40, // simulations par pas de la recherche dichotomique
  },

  // Niveau de joueur (voir game/leveling.js) : persiste entre les runs
  // (comme le niveau de faction), remis à zéro par ascend() seulement.
  // Alimenté uniquement par le combat — gagner des combats/planètes/
  // systèmes fait progresser le seul palier qui débloque l'accès aux
  // systèmes lointains (voir data/systems.js#requiredLevelForIndex).
  player: {
    xpBase: 20, // XP requise pour passer du niveau 0 au niveau 1
    xpGrowth: 1.22, // multiplicateur d'XP requise par niveau
    xpPerCombatWin: 2, // chaque phase de combat gagnée
    xpPerPlanet: 8, // chaque planète entièrement conquise
    xpPerSystem: 30, // système entièrement conquis (toutes planètes faites)
  },
};
