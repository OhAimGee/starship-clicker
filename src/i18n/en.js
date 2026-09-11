// English dictionary. Mirrors the key structure of fr.js.

export const en = {
  ui: {
    title: 'Starship Clicker',
    tagline: 'Build a spacefaring civilisation, one click at a time.',
    mothership: 'Mothership — launch a charge of energy',
    perClick: '+{n} ⚡ per click',
    civLevel: 'Civilisation level',
    civShort: 'Civ.',
    producedShort: 'Energy produced',
    a11y: {
      resources: 'Resource board',
      terminals: 'Terminals',
    },
    tabs: {
      shop: 'Shop',
      fleet: 'Fleet',
      exploration: 'Exploration',
      technology: 'Technology',
      ascension: 'Ascension',
    },
    panels: {
      shop: 'Command Centre',
      fleet: 'Shipyard',
      exploration: 'Galactic Map',
      technology: 'Research Centre',
      ascension: 'Temple of Ascension',
    },
    sections: {
      generators: 'Generators',
      clickUpgrades: 'Ship Upgrades',
      ships: 'Ships',
      research: 'Research',
      explorationMap: 'System map',
      conqueredSystems: 'Conquered systems',
      prestigeUpgrades: 'Permanent upgrades',
      factionSkills: 'Skills — {faction}',
      ascensionStats: 'Statistics',
      ascension: 'Ascension — the ultimate goal',
      ascensionRewards: 'Ascension rewards owned',
      endRun: 'End the run',
    },
    cols: {
      cost: 'Fare',
    },
    stats: {
      totalEnergy: 'Total energy produced',
      perSecond: 'Production per second',
      fleetPower: 'Fleet power',
      conquered: 'Systems conquered',
      totalClicks: 'Total clicks',
      ascensions: 'Runs completed',
      trueAscensions: 'Ascensions',
      lifetimeEnergy: 'Lifetime energy',
      permanentBonus: 'Permanent production bonus',
      owned: 'Owned',
      runObjective: 'Run objective',
    },
    factionSelect: {
      title: 'Choose a faction',
      intro:
        'The chosen faction progresses during this run and unlocks its own skills between runs, using the ascension points you earn.',
      level: 'Level {n}',
      new: 'New',
    },
    objective: {
      conquerAll: 'Conquer systems',
      conquerOne: 'Conquer one system',
      reachFleetPower: 'Reach a fleet power',
      gatherResources: 'Gather resources',
    },
    nodeMap: {
      none: 'No active map.',
      noFleet: 'Buy a ship to start exploring.',
      invade: 'Invade',
      bonus: 'Bonus',
      skillPoint: 'Skill point',
      conquest: 'Conquest',
    },
    buttons: {
      buy: 'Buy',
      build: 'Build',
      research: 'Research',
      researched: 'Researched',
      improve: 'Upgrade',
      endRun: 'End the run',
      ascend: 'Ascend — New Game+',
      reset: 'Restart game',
      resume: 'Resume',
      launch: 'Launch',
      details: 'Details',
      cancel: 'Cancel',
    },
    labels: {
      owned: 'Owned: {n}',
      level: 'Level: {n}',
      cost: 'Cost',
      produces: 'Produces',
      consumes: 'Consumes',
      attack: 'Attack',
      maintenance: 'Upkeep',
      defense: 'Defence',
      rewards: 'Rewards',
      perSecondShort: '/s',
      locked: 'Locked',
      unlockHint: 'Unlocks at {amount} {resource}',
      unlockHintTech: 'Requires the “{tech}” technology',
      maintenanceTotal: 'Total upkeep',
      fleetPowerNeeded: 'Power required: {n}',
      passiveIncome: 'Passive income',
    },
    ascension: {
      marquee: 'All services terminated',
      intro:
        'The ultimate goal. At the threshold faction level, choose a ' +
        'permanent, high-impact reward — every faction drops back to ' +
        'level 0 and loses its skills: a New Game+. Only Ascension ' +
        'rewards survive.',
      progress: 'Faction level',
    },
    endRun: {
      intro:
        "End the run once its objective is complete: your faction's level " +
        'goes up a notch, and its skills (plus the common tree) become ' +
        'buyable with the points earned.',
      requirement: "Available once the run's objective is complete",
      willGain: 'You will gain',
    },
    ascensionChoice: {
      title: 'Choose an Ascension reward',
      intro:
        'Ascension! Choose a permanent reward — every faction drops back ' +
        'to level 0, a New Game+ begins.',
    },
    offline: {
      title: 'Welcome back, Commander',
      body: 'Your civilisation thrived while you were away ({duration}).',
      gains: 'Accumulated gains',
      hours: '{n}h',
      minutes: '{n}m',
    },
    reset: {
      title: 'Reset',
      confirm:
        'Start a fresh game? All progress will be lost (other browser saves ' +
        'are unaffected).',
    },
    language: 'Language',
    footer: 'Automatic local save · no data leaves your machine.',
  },

  resource: {
    energy: 'Energy',
    metal: 'Metal',
    crystals: 'Crystals',
    antimatter: 'Antimatter',
    influence: 'Influence',
    darkMatter: 'Dark matter',
    quantumEnergy: 'Quantum energy',
    ascensionPoints: 'Ascension points',
  },

  generator: {
    solarPanel: {
      name: 'Solar panel',
      desc: 'Captures stellar energy. The foundation of everything.',
    },
    miningDrone: {
      name: 'Mining drone',
      desc: 'Strips metal from nearby asteroids.',
    },
    crystalExtractor: {
      name: 'Crystal extractor',
      desc: 'Refines metal into energised crystals.',
    },
    fusionReactor: {
      name: 'Fusion reactor',
      desc: 'Burns crystals for a high energy yield.',
    },
    stellarForge: {
      name: 'Stellar forge',
      desc: 'Transmutes crystals into heavy alloys.',
    },
    antimatterGenerator: {
      name: 'Antimatter generator',
      desc: 'Traps antimatter particles in a crystal lattice.',
    },
    senateArchive: {
      name: 'Senate archive',
      desc: 'Diplomacy and bureaucracy: influence grows, slowly.',
    },
    quantumHarvester: {
      name: 'Quantum harvester',
      desc: 'Converts raw energy into stabilised antimatter.',
    },
    dimensionalRift: {
      name: 'Dimensional rift',
      desc: 'Tears crystals from the fabric of space itself.',
    },
    darkMatterCollector: {
      name: 'Dark matter collector',
      desc: 'Filters dark matter from the intergalactic void.',
    },
    quantumResonator: {
      name: 'Quantum resonator',
      desc: 'Vibrates dark matter up to quantum energy.',
    },
    voidHarvester: {
      name: 'Void harvester',
      desc: 'Draws colossal energy from nothingness.',
    },
    cosmicFurnace: {
      name: 'Cosmic furnace',
      desc: 'Forges metal on a stellar scale.',
    },
    realityEngine: {
      name: 'Reality engine',
      desc: 'Rewrites local law to crystallise matter.',
    },
    hypermatterCondenser: {
      name: 'Hypermatter condenser',
      desc: 'Condenses quantum energy into pure antimatter.',
    },
    voidLoom: {
      name: 'Void loom',
      desc: 'Weaves dark matter out of quantum energy.',
    },
  },

  ship: {
    fighters: {
      name: 'Fighters',
      desc: 'Fast, expendable, effective in numbers.',
    },
    cruisers: { name: 'Cruisers', desc: 'The backbone of a serious fleet.' },
    dreadnoughts: { name: 'Dreadnoughts', desc: 'Heavy armour, heavy strike.' },
    titans: { name: 'Titans', desc: 'Mobile fortresses.' },
    motherships: {
      name: 'Motherships',
      desc: 'Project the power of an empire.',
    },
    worldBurners: {
      name: 'World burners',
      desc: 'Exactly what the name promises.',
    },
    voidCrusaders: { name: 'Void crusaders', desc: 'Carved from dark matter.' },
    realityShifters: {
      name: 'Reality shifters',
      desc: 'War as a metaphysical act.',
    },
  },

  tech: {
    advancedPropulsion: {
      name: 'Advanced propulsion',
      desc: 'Reduces ship construction cost.',
    },
    quantumComputing: {
      name: 'Quantum computing',
      desc: 'Optimises all generators.',
    },
    neuralNetworks: {
      name: 'Neural networks',
      desc: 'Generators self-purchase when resources are plentiful.',
    },
    warpDrive: { name: 'Warp drive', desc: 'Unlocks distant star systems.' },
    energyEfficiency: {
      name: 'Energy efficiency',
      desc: 'Reduces fleet upkeep.',
    },
    hyperSpace: {
      name: 'Hyperspace',
      desc: 'Doubles passive income from conquered systems.',
    },
    nanotechnology: {
      name: 'Nanotechnology',
      desc: 'Self-repair: higher generator output.',
    },
    artificialIntelligence: {
      name: 'Artificial intelligence',
      desc: 'Coordinates production civilisation-wide.',
    },
    darkMatterPhysics: {
      name: 'Dark matter physics',
      desc: 'Doubles dark matter production.',
    },
    quantumEntanglement: {
      name: 'Quantum entanglement',
      desc: 'Doubles quantum energy production.',
    },
    voidTechnology: {
      name: 'Void technology',
      desc: 'Triples all generator production.',
    },
    realityManipulation: {
      name: 'Reality manipulation',
      desc: '5x production and click power.',
    },
  },

  clickUpgrade: {
    clickPower: {
      name: 'Click amplifier',
      desc: 'Increases energy gained per click.',
    },
    autoClicker: {
      name: 'Auto-clicker',
      desc: 'Clicks automatically once per second.',
    },
  },

  prestigeUpgrade: {
    prestigeProduction: {
      name: 'Production doctrine',
      desc: '+10% production per level (permanent).',
    },
    prestigeClick: {
      name: 'Click doctrine',
      desc: '+25% click power per level (permanent).',
    },
    fleetCommand: {
      name: 'Fleet command',
      desc: '+20% fleet power per level (permanent).',
    },
    quantumAffinity: {
      name: 'Quantum affinity',
      desc: '+50% dark matter and quantum energy production per level.',
    },
  },

  faction: {
    miningCollective: {
      name: 'Mining Collective',
      desc: '+25% metal and crystal production from the start.',
    },
    ironLegion: {
      name: 'Iron Legion',
      desc: '+20% fleet power from the start.',
    },
    quantumOrder: {
      name: 'Quantum Order',
      desc: '+20% antimatter, dark matter and quantum energy production from the start.',
    },
  },

  factionSkill: {
    deepCoreDrilling: {
      name: 'Deep Core Drilling',
      desc: '+30% metal production per level.',
    },
    crystalRefining: {
      name: 'Crystal Refining',
      desc: '+30% crystal production per level.',
    },
    massProduction: {
      name: 'Mass Production',
      desc: '+15% overall production per level.',
    },
    stellarSmelting: {
      name: 'Stellar Smelting',
      desc: '+25% energy production per level.',
    },
    bulkFreight: {
      name: 'Bulk Freight',
      desc: '-10% ship cost per level.',
    },
    shipyards: {
      name: 'Shipyards',
      desc: '+25% fleet power per level.',
    },
    leanLogistics: {
      name: 'Lean Logistics',
      desc: '-15% fleet upkeep per level.',
    },
    rapidAssembly: {
      name: 'Rapid Assembly',
      desc: '-12% ship cost per level.',
    },
    ironDiscipline: {
      name: 'Iron Discipline',
      desc: '+20% click power per level.',
    },
    warReserves: {
      name: 'War Reserves',
      desc: '+25% metal production per level.',
    },
    entangledFields: {
      name: 'Entangled Fields',
      desc: '+40% quantum energy production per level.',
    },
    voidSight: {
      name: 'Void Sight',
      desc: '+30% click power per level.',
    },
    ascendantMinds: {
      name: 'Ascendant Minds',
      desc: '+15% overall production per level.',
    },
    darkResonance: {
      name: 'Dark Resonance',
      desc: '+35% dark matter production per level.',
    },
    fleetSingularity: {
      name: 'Fleet Singularity',
      desc: '+15% fleet power per level.',
    },
  },

  ascensionReward: {
    hyperProduction: {
      name: 'Production Overcharge',
      desc: '+50% overall production per level.',
    },
    overcharge: {
      name: 'Mothership Overdrive',
      desc: '+60% click power per level.',
    },
    grandArmada: {
      name: 'Grand Armada',
      desc: '+50% fleet power per level.',
    },
    stockpile: {
      name: 'Strategic Stockpile',
      desc: '+45% metal and crystal production per level.',
    },
    quantumMastery: {
      name: 'Quantum Mastery',
      desc:
        '+45% dark matter, quantum energy and antimatter production per ' +
        'level.',
    },
    masterShipwrights: {
      name: 'Master Shipwrights',
      desc: '-15% ship cost per level.',
    },
    selfSufficientFleet: {
      name: 'Self-Sufficient Fleet',
      desc: '-20% fleet upkeep per level.',
    },
    primordialSpark: {
      name: 'Primordial Spark',
      desc: '+50% energy production per level.',
    },
  },

  event: {
    solarStorm: 'Solar storm',
    archaeologicalFind: 'Archaeological find',
    quantumAnomaly: 'Quantum anomaly',
    diplomaticContact: 'Diplomatic contact',
    darkMatterVortex: 'Dark matter vortex',
  },

  systemArchetype: {
    mining: 'Mining system',
    energetic: 'Energetic system',
    crystalline: 'Crystalline system',
    balanced: 'Balanced system',
    hostile: 'Hostile system',
    antimatterComplex: 'Antimatter complex',
    quantumStation: 'Quantum station',
    galacticFortress: 'Galactic fortress',
    tradeHub: 'Trade hub',
    cosmicLab: 'Cosmic laboratory',
    diplomatic: 'Diplomatic system',
    voidBastion: 'Void bastion',
    legacy: 'System',
  },

  notify: {
    welcome: 'Welcome! Click the mothership to begin.',
    cantAfford: 'Not enough resources.',
    cantAffordPrestige: 'Not enough ascension points.',
    missingResources: 'Missing: {list}',
    generatorBought: '{name} built.',
    shipBuilt: '{name} commissioned.',
    upgradeBought: 'Upgrade bought: {name}.',
    techResearched: 'Technology acquired: {name}.',
    prestigeUpgraded: '{name} — level {level}.',
    factionSkillBought: '{name} — level {level}.',
    nodeReward: 'Loot: {list}',
    skillPointGained: '+1 run skill point.',
    objectiveComplete:
      'Run objective complete! You can end the run for the bonus.',
    systemConquered: '{name} conquered!',
    fleetTooWeak: 'Fleet too weak (power required: {required}).',
    cannotEndRun: "You need to complete the run's objective first.",
    runEnded: 'Run complete! +{points} ✨ and your faction levels up.',
    cannotAscend: 'Your faction needs to reach level {level} to ascend.',
    ascended: 'Ascension! Every faction resets to zero — pick your reward.',
    ascensionRewardChosen: '{name} — Ascension reward gained (level {level}).',
    maintenanceLoss: 'Insufficient upkeep: ships were lost.',
    unlocked: 'New: {name}',
    saveRecovered:
      'Unreadable save archived (starshipClickerSave.bak). New game.',
    saveReset:
      'The game changed significantly (factions, node-based exploration). Your old save was archived — new game!',
    eventGain: '{name}: {list}',
  },
};
