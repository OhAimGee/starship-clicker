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
      runStatus: 'Run status',
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
      explorationMap: 'Systems',
      conqueredSystems: 'Conquered systems',
      prestigeUpgrades: 'Permanent upgrades',
      factionSkills: 'Skills — {faction}',
      ascensionStats: 'Statistics',
      ascension: 'Ascension — the ultimate goal',
      ascensionRewards: 'Ascension rewards owned',
      endRun: 'End the run',
      runSkillTree: 'Run skills',
      combatLog: 'Combat log',
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
      runSkillPoints: 'Skill points',
      playerLevel: 'Player level',
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
    system: {
      locked: 'Level {level} required',
      conqueredTag: 'Conquered',
      planetCount: '{n} planets',
    },
    planet: {
      conquered: 'Conquered',
      pending: 'Pending',
      phaseProgress: 'Phase {won}/{total}',
      noReward: 'No reward.',
      hostileLocked: 'Requires the Xeno-colonization research before attacking — conquest is permanent, so research the tech first.',
    },
    planetType: {
      invaded: 'Invaded',
      hostile: 'Hostile',
      uninhabited: 'Uninhabited',
      gas: 'Gas giant',
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
      engage: 'Engage',
      close: 'Close',
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
    fleetAllocation: {
      title: 'Engage the fleet',
      intro:
        'Choose how many ships of each type to commit to this fight — ' +
        'losses only affect the committed fleet, win or lose.',
    },
    battleReport: {
      titleWon: 'Battle won',
      titleLost: 'Assault repelled',
      power: 'Power committed {committed} — defence {required}',
      losses: 'Losses',
      noLosses: 'No losses.',
    },
    runSkillTree: {
      intro:
        'Spend your run skill points (earned on the exploration map) on ' +
        'temporary bonuses — they only last this run.',
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
    achievements: {
      title: 'Achievements',
    },
    quit: {
      cannotClose:
        'The browser will not close this tab automatically — you can close it yourself.',
    },
    pauseMenu: {
      button: 'Menu',
      title: 'Menu',
      achievements: 'Achievements',
      options: 'Options',
      mainMenu: 'Main menu',
    },
    language: 'Language',
    footer: 'Automatic local save · no data leaves your machine.',
  },

  mainMenu: {
    continue: 'Continue',
    newGame: 'New Game',
    tutorial: 'Tutorial',
    achievements: 'Achievements',
    options: 'Options',
    quit: 'Quit',
    overwriteWarning:
      'Creating a new Commander will overwrite the current save. Continue?',
    defaultCommanderName: 'Commander',
  },

  commanderCreation: {
    title: 'Create a Commander',
    intro:
      'Choose a name and a faction to begin — the chosen faction ' +
      'progresses during this game.',
    nameLabel: 'Commander name',
    namePlaceholder: 'Commander',
  },

  tutorial: {
    skip: 'Skip tutorial',
    next: 'Next',
    finish: 'Finish',
    stepCounter: 'Step {n} / {total}',
    steps: {
      intro: {
        title: 'Welcome, Commander',
        body1:
          'This tutorial walks you through a full gameplay loop: harvesting energy, building a fleet, conquering a system, and understanding the long-term progression.',
        body2: 'Each step points at a real button to click — follow along.',
      },
      click: {
        title: 'Harvest energy',
        body1: 'Click the mothership to harvest energy.',
      },
      buySolar: {
        title: 'First producer',
        body1: 'Buy a Solar Panel: it produces energy on its own, even without clicking.',
      },
      buyMining: {
        title: 'Mine metal',
        body1: 'Buy a Mining Drone: you will need metal to build ships.',
      },
      goFleetTab: {
        title: 'Head to Fleet',
        body1: 'Open the Fleet tab to build your first ships.',
      },
      buyFighters: {
        title: 'Build a fleet',
        body1: 'Buy two Fighters.',
        body2: 'A fleet lets you explore systems and fight — a single ship rarely holds.',
      },
      goExplorationTab: {
        title: 'Head to Exploration',
        body1: 'Open the Exploration tab: your fleet now grants access to systems.',
      },
      openSystem0: {
        title: 'Open a system',
        body1: 'Click the first system in the list to see its planets.',
      },
      engageCombat: {
        title: 'Engage combat',
        body1: 'Click "Engage" to attack the planet, then confirm your fleet allocation.',
        retry: 'Assault repelled — try again, your fleet is still here.',
      },
      systemConquered: {
        title: 'System conquered!',
        body1: 'Close this window to return to the map.',
      },
      showLevelXp: {
        title: 'Commander level',
        body1:
          'Every fight grants XP: your level shows here, and unlocks farther systems on the map.',
      },
      goTechnologyTab: {
        title: 'Research center',
        body1: 'The Technology tab unlocks permanent multipliers for your production.',
      },
      mentionFleetSkills: {
        title: 'Run skills',
        body1:
          'The Fleet tab (already visited) also holds a temporary skill tree, paid for with points earned in combat.',
      },
      goAscensionTab: {
        title: 'Temple of Ascension',
        body1: 'This tab covers ending a run, faction skills, and true Ascension.',
      },
      explainEndRun: {
        title: 'End the run',
        body1: 'Click "End Run": your objective is complete.',
      },
      factionReselect: {
        title: 'New run',
        body1: 'Pick a faction to start again — technologies and your level are kept.',
      },
      explainTrueAscension: {
        title: 'True Ascension',
        body1:
          'This button stays disabled until your faction reaches level 10 — several run-ends will be needed.',
        body2: 'Ascending resets everything but grants a permanent reward for all future games.',
      },
      complete: {
        title: 'Tutorial complete',
        body1: 'You know the full loop now. Have fun, Commander!',
      },
    },
  },

  options: {
    title: 'Options',
    theme: 'Theme',
    themeName: {
      cyberspace: 'CyberSpace (blue)',
    },
    moreThemesSoon: 'More themes are coming later.',
  },

  achievement: {
    firstClick: {
      name: 'First Contact',
      desc: 'Click the mothership for the first time.',
    },
    hundredClicks: {
      name: 'Nimble Finger',
      desc: 'Click 100 times in total.',
    },
    firstGenerator: {
      name: 'First Gears',
      desc: 'Build a first generator.',
    },
    firstShip: {
      name: 'First Ship',
      desc: 'Build a first ship.',
    },
    firstTech: {
      name: 'Scientific Awakening',
      desc: 'Complete a first piece of research.',
    },
    firstSystemConquered: {
      name: 'First Flag Planted',
      desc: 'Conquer a first system.',
    },
    firstEndRun: {
      name: 'First Return to Port',
      desc: 'Complete a first run.',
    },
    firstAscension: {
      name: 'Rebirth',
      desc: 'Ascend for the first time.',
    },
    fleetOf1000: {
      name: 'Armada',
      desc: 'Own 1000 ships in total.',
    },
    allGeneratorTypes: {
      name: 'Full Industry',
      desc: 'Own at least one of every generator type.',
    },
    playerLevel10: {
      name: 'Seasoned Commander',
      desc: 'Reach player level 10.',
    },
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
    xenoColonization: {
      name: 'Xeno-colonization',
      desc: 'Lets conquered hostile-environment planets yield permanent production.',
    },
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

  runSkill: {
    overclockedThrusters: {
      name: 'Overclocked Thrusters',
      desc: '+8% fleet power per level (this run only).',
    },
    scavengerProtocols: {
      name: 'Scavenger Protocols',
      desc: '+10% metal and crystal production per level (this run only).',
    },
    rapidFire: {
      name: 'Rapid Fire',
      desc: '+10% click power per level (this run only).',
    },
    fieldRepairs: {
      name: 'Field Repairs',
      desc: '-8% fleet upkeep per level (this run only).',
    },
    streamlinedLogistics: {
      name: 'Streamlined Logistics',
      desc: '-6% ship cost per level (this run only).',
    },
    energyFocus: {
      name: 'Energy Focus',
      desc: '+6% overall production per level (this run only).',
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
    volatile: 'Volatile system',
    darkNexus: 'Dark matter nexus',
    legacy: 'System',
  },

  notify: {
    welcome: 'Welcome! Click the mothership to begin.',
    cantAfford: 'Not enough resources.',
    cantAffordPrestige: 'Not enough ascension points.',
    cantAffordRunSkill: 'Not enough run skill points.',
    missingResources: 'Missing: {list}',
    generatorBought: '{name} built.',
    shipBuilt: '{name} commissioned.',
    upgradeBought: 'Upgrade bought: {name}.',
    techResearched: 'Technology acquired: {name}.',
    prestigeUpgraded: '{name} — level {level}.',
    factionSkillBought: '{name} — level {level}.',
    runSkillBought: '{name} — level {level}.',
    nodeReward: 'Loot: {list}',
    skillPointGained: '+1 run skill point.',
    objectiveComplete:
      'Run objective complete! You can end the run for the bonus.',
    systemConquered: '{name} conquered!',
    fleetTooWeak: 'Fleet too weak (power required: {required}).',
    battleLost:
      'Assault repelled (defence: {required}) — ships were lost.',
    cannotEndRun: "You need to complete the run's objective first.",
    runEnded: 'Run complete! +{points} ✨ and your faction levels up.',
    cannotAscend: 'Your faction needs to reach level {level} to ascend.',
    ascended: 'Ascension! Every faction resets to zero — pick your reward.',
    ascensionRewardChosen: '{name} — Ascension reward gained (level {level}).',
    maintenanceLoss: 'Insufficient upkeep: ships were lost.',
    unlocked: 'New: {name}',
    achievementUnlocked: 'Achievement unlocked: {name}',
    systemLocked: 'Level {level} required to access this system.',
    levelUp: 'Level {level} reached!',
    planetConquered: 'Planet conquered!',
    battleWon: 'Combat phase won.',
    saveRecovered:
      'Unreadable save archived (starshipClickerSave.bak). New game.',
    saveReset:
      'The game changed significantly (factions, node-based exploration). Your old save was archived — new game!',
    eventGain: '{name}: {list}',
  },
};
