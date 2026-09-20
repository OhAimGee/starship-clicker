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
    // Short labels for the mobile pager (5 tabs on one 2.1 rem line).
    tabsShort: {
      shop: 'Shop',
      fleet: 'Fleet',
      exploration: 'Explore',
      technology: 'Tech',
      ascension: 'Ascend',
    },
    // Short label of the permanent objective bar (mobile: ~366 px wide).
    objectiveBar: {
      label: 'Goal',
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
      megastructures: 'Megaprojects',
      decrees: 'Senate decrees',
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
      negotiateNote: 'The Sentinels are willing to talk: {cost} influence to obtain the planet without a fight (loot halved).',
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
      negotiate: 'Negotiate',
      adopt: 'Enact',
      abrogate: 'Repeal',
      close: 'Close',
      continue: 'Continue',
    },
    labels: {
      owned: 'Owned: {n}',
      level: 'Level: {n}',
      levelShort: 'Lv. {n}',
      cost: 'Cost',
      produces: 'Produces',
      consumes: 'Consumes',
      attack: 'Attack',
      hp: 'Hull',
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
      levelOf: 'Lv. {n} / {max}',
      maxed: 'Max',
      slots: 'Slots: {used} / {total}',
      adopted: 'Enacted',
      slotsFull: 'Slots full',
      effects: 'Effects',
      nextLevel: 'Next level',
      megastructuresLead: 'Colossal works: every level built is lost when the run ends.',
      decreesLead: 'One policy per slot, paid in influence. Repealing is free, but enacting again costs.',
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
        'Choose how many ships of each type to commit. The battle plays out ' +
        'round by round and chance has its say: destroyed ships are lost ' +
        '(wrecks are partly recovered), win or lose.',
      enemy: 'Enemy: {name}',
      composition: 'Composition',
      winChance: 'Win chance',
      estLosses: 'Expected losses',
      percent: '{n}%',
      recommended: 'Recommended',
      all: 'Commit all',
      chanceNote: 'Estimated from {n} simulated battles.',
      minHint:
        'Pre-filled with the smallest fleet aiming for a {target}% chance to ' +
        'win (smallest ships first). Commit more ships to reduce risk and ' +
        'losses.',
      notEnough:
        'Even your whole fleet does not reach a {target}% chance to win: ' +
        'everything is committed by default.',
    },
    battleReport: {
      titleWon: 'Battle won',
      titleLost: 'Assault repelled',
      titleRetreat: 'Fleet withdrawn',
      power: 'Power committed {committed} — defence {required}',
      rounds: '{n} rounds',
      destroyed: 'Ships destroyed',
      recovered: 'Wrecks recovered',
      losses: 'Permanent losses',
      noLosses: 'No losses.',
      enemyLosses: 'Enemy forces destroyed',
    },
    runSummary: {
      title: 'Run complete',
      intro: 'Here’s what your civilization accomplished during this run.',
      pointsEarned: 'Ascension points earned',
      noResources: 'No notable resources harvested during this run.',
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
    journal: {
      title: 'Logbook',
      locked: 'Locked entry',
      bestiary: 'Enemies encountered',
      bestiaryEmpty: 'No enemy encountered yet.',
    },
    quit: {
      cannotClose:
        'The browser will not close this tab automatically — you can close it yourself.',
    },
    // Mobile drawer (burger) and desktop header buttons — same entries.
    drawer: {
      open: 'Open the menu',
      close: 'Close the menu',
      back: 'Back to the menu',
      title: 'Commander menu',
      commander: 'Commander',
      achievements: 'Achievements',
      achievementsSub: '{done} / {total} unlocked',
      journal: 'Logbook',
      journalSub: '{done} / {total} entries',
      options: 'Options',
      optionsSub: 'Language, theme and battles',
      mainMenu: 'Main menu',
      mainMenuSub: 'Leave the current game',
      reset: 'Restart the game',
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
        retry: 'Assault repelled: luck was not on your side. Your fighters are replaced, try again.',
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

  updateNotice: {
    civilEngineer: {
      title: 'Civil Engineer Update',
      intro: 'What’s new in this update:',
      bullet1:
        'Megaprojects: six megastructures (Dyson sphere, orbital elevator, world forge…) to build level by level during a run. A new Shop section, unlocked by the “Megastructure engineering” research.',
      bullet2:
        'Senate decrees: influence finally has a use! Enact double-edged policies (Mobilization, Austerity, War economy…) and swap them to suit the situation.',
      bullet3:
        'The Sentinels: heavily armoured guardians you can fight… or negotiate with. Logbook chapter 2, the “Sentinel Bastion” boss planet and a choice: ally or destroy.',
      bullet4:
        'Six new generators (three of them influence), five technologies including Composite armour, and five new achievements.',
    },
  },

  options: {
    title: 'Options',
    theme: 'Theme',
    combatPlayback: 'Battles',
    playback: {
      animated: 'Animated log',
      summary: 'Summary only',
    },
    themeName: {
      cyberspace: 'CyberSpace (blue)',
      solstice: 'Solstice (amber)',
      phosphore: 'Phosphor (green)',
    },
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
    firstBlood: {
      name: 'First blood',
      desc: 'Win a battle.',
    },
    flawlessVictory: {
      name: 'Not a scratch',
      desc: 'Win a battle with no permanent losses.',
    },
    swarmCrusher: {
      name: 'Swarm crusher',
      desc: 'Destroy 100 enemy units in total.',
    },
    nestSlayer: {
      name: 'Queen slayer',
      desc: 'Defeat the Mother Nest.',
    },
    firstMegastructure: {
      name: 'Builder',
      desc: 'Complete a first megastructure level.',
    },
    wonderBuilder: {
      name: 'Architect of the impossible',
      desc: 'Bring every megastructure to its maximum level in the same run.',
    },
    firstDecree: {
      name: 'Lawmaker',
      desc: 'Enact a first Senate decree.',
    },
    diplomat: {
      name: 'Diplomat',
      desc: 'Obtain a planet through negotiation.',
    },
    bastionGates: {
      name: 'The gates of the Bastion',
      desc: 'Resolve the Sentinel Bastion, by force or by words.',
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
    embassy: {
      name: 'Embassy',
      desc: 'A diplomatic corps on site: influence is bought with metal.',
    },
    treatyBureau: {
      name: 'Treaty bureau',
      desc: 'Drafts, ratifies and enforces treaties for antimatter: influence reaches further.',
    },
    particleCollider: {
      name: 'Particle collider',
      desc: 'Smashes antimatter against itself until quantum energy falls out — no dark matter needed.',
    },
    forbiddenArchive: {
      name: 'Forbidden archive',
      desc: 'Research the Senate had sealed: paid in influence, it yields dark matter.',
    },
    galacticTribunal: {
      name: 'Galactic tribunal',
      desc: 'Judges the disputes of a whole sector: quantum energy makes its verdicts unquestionable.',
    },
    zeroPointExtractor: {
      name: 'Zero-point extractor',
      desc: 'Converts colossal amounts of ordinary energy into quantum energy.',
    },
  },

  enemy: {
    class: {
      drone: 'Drone',
      frigate: 'Frigate',
      cruiser: 'Cruiser',
      bastion: 'Bastion',
      leviathan: 'Leviathan',
      sentinel: 'Sentinel',
    },
    classPlural: {
      drone: 'Drones',
      frigate: 'Frigates',
      cruiser: 'Cruisers',
      bastion: 'Bastions',
      leviathan: 'Leviathans',
      sentinel: 'Sentinels',
    },
    profile: {
      swarm: {
        name: 'The Swarm',
        hint: 'Clouds of light units: your big ships waste their shots there — numbers win.',
        intro: 'A cloud of drones rises to meet you. The Swarm has spotted your fleet.',
        victory: 'The Swarm scatters: the way is clear.',
        defeat: 'The Swarm closes in on what is left of your ships.',
        retreat: 'Under the Swarm’s pressure, your ships break contact.',
      },
      garrison: {
        name: 'Occupation forces',
        hint: 'A balanced mix around an armoured core: don’t commit small ships only.',
        intro: 'The garrison’s defences come alive, its batteries locking onto your fleet.',
        victory: 'The garrison surrenders, its batteries fall silent.',
        defeat: 'The garrison holds firm: your fleet is swept aside.',
        retreat: 'The garrison is too strong: your ships fall back.',
      },
      nest: {
        name: 'The Mother Nest',
        hint: 'A colossal queen at the heart of a swarm: sweep the drones with numbers, but keep heavy ships to break her shell.',
        intro: 'The ground trembles. The Mother Nest rises, drones pouring out from every side.',
        victory: 'The queen collapses: the swarm falls silent, robbed of its heart.',
        defeat: 'The Mother Nest buries your fleet under its swarm.',
        retreat: 'Her shell withstands everything: your ships break off.',
      },
      wilds: {
        name: 'Hostile wildlife',
        hint: 'A few colossal, heavily armoured creatures: small calibres are ineffective — bring heavy ships.',
        intro: 'Colossal shapes rise from the ground: the local wildlife attacks.',
        victory: 'The creatures collapse one by one: the planet grows quiet.',
        defeat: 'The creatures slaughter your fleet.',
        retreat: 'Your weapons glance off their carapace: emergency retreat.',
      },
      sentinels: {
        name: 'The Sentinels',
        hint: 'Few but heavily armoured guardians: bring heavy calibres… or open a dialogue (Space diplomacy).',
        intro: 'The Senate’s guardians fall into formation. Not a word: only their shields rising.',
        victory: 'The Sentinels cease fire, their shields going dark one by one.',
        defeat: 'The Sentinels hold their ground: your fleet is thrown back.',
        retreat: 'They do not pursue: your ships take the chance to break contact.',
      },
    },
  },

  boss: {
    motherNest: { name: 'Mother Nest' },
    sentinelBastion: { name: 'Sentinel Bastion' },
  },

  story: {
    chapter: {
      prologue: { title: 'Prologue — Awakening' },
      tide: { title: 'Chapter 1 — The Tide' },
      sentinels: { title: 'Chapter 2 — The Sentinels' },
    },
    entry: {
      awakening: {
        title: 'Awakening',
        text: 'The pods open one by one. You are Commander {name}, and the ark-ship that took you in drifts through what was once the Galactic Senate. Nothing answers on the official frequencies: the Rupture swept it all away.',
      },
      firstFleet: {
        title: 'One more hull',
        text: 'A first fighter leaves the bay. Small, fragile, cheap: it is all anyone still knows how to build. Bigger ships will come, but every hull lost will cost more than the last.',
      },
      firstContact: {
        title: 'First contact',
        text: 'The drones did not fire first: they surrounded you. The Swarm is not an army, it is a reflex — abandoned machines repeating the last order they received: occupy. Every planet they hold is a hive.',
      },
      firstFlag: {
        title: 'First flag',
        text: 'A free planet, at last. The Senate is gone, but someone has to write the first line of the new register. You write your own name.',
      },
      tideRises: {
        title: 'The Tide rises',
        text: 'The first campaign ends, but the map redraws itself: wherever you freed a system, the Swarm already holds another. They return like a tide. You will have to go back to the source.',
      },
      swarmNature: {
        title: 'What the Swarm cannot do',
        text: 'After dozens of drone wrecks, one lesson: they fire fast, aim wide and die in droves. Your big ships waste their salvoes on them; sheer numbers sweep them away. Every enemy has its answer.',
      },
      motherNestSighted: {
        title: 'The Mother Nest',
        text: 'The probes converge: every swarm flows back to one system, where the shell of a colossal queen blots out the sky. She is guarded by her own drones — and by armour no fighter will ever pierce.',
      },
      nestFallen: {
        title: 'The queen falls',
        text: 'The Mother Nest collapses and, with her, every swarm freezes at once, as if robbed of an order. The tide recedes. One question remains: who gave the queen her order? Deep inside her, an encrypted signal — coordinates.',
      },
      sentinelsSignal: {
        title: 'A signal on every frequency',
        text: 'Your engineers have restored the Senate’s diplomatic channels, and something is answering: a repetitive, orderly, very old signal. “Area under guard. Identify yourself.” The Sentinels never stopped keeping watch.',
      },
      sentinelsWardens: {
        title: 'The Senate’s guardians',
        text: 'They do not hunt, they do not pursue: they hold. Their armour is colossal — small calibres glance off — but nothing in their protocols forbids talking to whoever speaks their language. Every planet they guard can be negotiated.',
      },
      bastionSighted: {
        title: 'The Bastion',
        text: 'Every beacon converges on a single point: a fortress-world, the Senate’s last lock. The Sentinel Bastion. They say it holds the register of oaths — and the arsenal to enforce them.',
      },
      bastionAllied: {
        title: 'The oath renewed',
        text: '“The Senate is no more. Its guard remains.” The Bastion opens its gates: the Sentinels swear loyalty to the ark and to Commander {name}. Their armour plans join your yards. It remains to be seen what the word of machines that waited so long is worth.',
      },
      bastionRazed: {
        title: 'The lock broken',
        text: 'The Bastion collapses under your salvos and its arsenal is yours. The Sentinels did not beg: they held to the very end. In the rubble your crews recover vast reserves — and the lingering feeling of having silenced something that should have been heard.',
      },
    },
  },

  battle: {
    title: 'Battle',
    versus: '{system} — {enemy}',
    allyBar: 'Your fleet',
    enemyBar: 'Enemy',
    round: 'Round {n}',
    speed: 'Speed',
    skip: 'Skip',
    showLog: 'Battle log',
    empty: 'No events.',
    units: 'Units: {n}',
    line: {
      dodgedAllyOne: 'Attack evaded: one enemy shot misses its target.',
      dodgedAllyMany: 'Attacks evaded: {n} enemy shots miss their target.',
      dodgedEnemyOne: 'One of your shots is dodged by the enemy.',
      dodgedEnemyMany: '{n} of your shots are dodged by the enemy.',
      destroyedEnemyOne: 'Enemy ship destroyed: {unitOne}.',
      destroyedEnemyMany: 'Enemy ships destroyed: {n} × {unitOne}.',
      destroyedAllyOne: 'Ship lost: {unitOne}.',
      destroyedAllyMany: 'Ships lost: {n} × {unitOne}.',
      timeout: 'The fight drags on: both fleets break contact.',
    },
    event: {
      criticalHit: {
        ally: 'Critical hit! Your {unit} find a weak point (damage +50% this round).',
        enemy: 'Enemy critical hit: their {unit} break through your lines (damage +50% this round).',
      },
      barrage: {
        ally: 'Concentrated barrage! Your whole fleet fires in unison (+25% damage).',
        enemy: 'Enemy barrage: their fire converges (+25% damage).',
      },
      shieldFailure: {
        ally: 'Shields overloaded: your {unit} take the full brunt (+50% damage taken).',
        enemy: 'Enemy shields overloaded: their {unit} are exposed (+50% damage taken).',
      },
      hullBreach: {
        ally: 'Hull breach: your {unit} lose 6% of their structure.',
        enemy: 'Enemy hull breach: their {unit} lose 6% of their structure.',
      },
      reactorOverheat: {
        ally: 'Reactor overheating: one of your {unit} is lost.',
        enemy: 'Enemy reactor overheating: one of their {unit} explodes.',
      },
      evasiveManeuver: {
        ally: 'Evasive manoeuvre: your {unit} weave (+20 points of evasion).',
        enemy: 'Enemy evasive manoeuvre: their {unit} are harder to hit.',
      },
      emergencyRepairs: {
        ally: 'Emergency repairs: your {unit} regain structure.',
        enemy: 'The enemy rushes repairs on its {unit}.',
      },
      weaponsMalfunction: {
        ally: 'Weapons malfunction: your {unit} fire at half rate.',
        enemy: 'Enemy weapons malfunction: their {unit} fire at half rate.',
      },
      decisiveShot: {
        ally: 'Decisive shot! An enemy {unitOne} is destroyed outright.',
        enemy: 'Enemy decisive shot: one of your {unit} is destroyed outright.',
      },
      reinforcements: {
        enemy: 'Enemy reinforcements: new {unit} arrive on the scene.',
      },
    },
  },

  ship: {
    fighters: {
      name: 'Fighters',
      one: 'Fighter',
      desc: 'Fast, expendable, effective in numbers.',
    },
    cruisers: {
      name: 'Cruisers',
      one: 'Cruiser',
      desc: 'The backbone of a serious fleet.',
    },
    dreadnoughts: {
      name: 'Dreadnoughts',
      one: 'Dreadnought',
      desc: 'Heavy armour, heavy strike.',
    },
    titans: { name: 'Titans', one: 'Titan', desc: 'Mobile fortresses.' },
    motherships: {
      name: 'Motherships',
      one: 'Mothership',
      desc: 'Project the power of an empire.',
    },
    worldBurners: {
      name: 'World burners',
      one: 'World burner',
      desc: 'Exactly what the name promises.',
    },
    voidCrusaders: {
      name: 'Void crusaders',
      one: 'Void crusader',
      desc: 'Carved from dark matter.',
    },
    realityShifters: {
      name: 'Reality shifters',
      one: 'Reality shifter',
      desc: 'War as a metaphysical act.',
    },
  },

  // Effect labels (megaprojects, decrees): “<label> <±percentage>”.
  effect: {
    percent: '{sign}{n}%',
    productionMultiplier: 'Production',
    resourceProductionMultiplier: 'Production ({res})',
    clickMultiplier: 'Click',
    fleetMultiplier: 'Fleet power',
    fleetDurability: 'Ship hull points',
    shipCost: 'Ship cost',
    fleetMaintenance: 'Upkeep',
    explorationIncome: 'System income',
    lootMultiplier: 'Loot',
  },

  megastructure: {
    dysonSphere: {
      name: 'Dyson sphere',
      desc: 'A shell of collectors around the star: energy output soars.',
    },
    orbitalElevator: {
      name: 'Orbital elevator',
      desc: 'A cable to orbit: putting a hull in position costs far less.',
    },
    worldForge: {
      name: 'World forge',
      desc: 'An entire planet turned into a foundry and a crystal works.',
    },
    archivesNetwork: {
      name: 'Archives network',
      desc: 'Links the Senate Archives together: influence flows much faster.',
    },
    flagshipYard: {
      name: 'Flagship yard',
      desc: 'Giant slipways that thicken every ship’s hull: more hull points in battle.',
    },
    ringWorld: {
      name: 'Ringworld',
      desc: 'A habitable ring around the star: conquered systems pay out far more.',
    },
  },

  decree: {
    mobilization: {
      name: 'Mobilization',
      desc: 'The whole nation behind the war effort: a stronger fleet, but a sluggish economy.',
    },
    austerity: {
      name: 'Austerity',
      desc: 'The fleet is cheaper to build and maintain, but less well armed.',
    },
    warEconomy: {
      name: 'War economy',
      desc: 'Factories run flat out; the ships, meanwhile, are costly to keep up.',
    },
    martialLaw: {
      name: 'Martial law',
      desc: 'Reinforced hulls at any price — at the colonies’ expense.',
    },
    plunderRights: {
      name: 'Right of plunder',
      desc: 'Planetary loot soars, but crews take risks.',
    },
    stateScience: {
      name: 'State science',
      desc: 'High science is funded at the expense of basic industry.',
    },
    propaganda: {
      name: 'Propaganda',
      desc: 'The people cheer: every click counts for more, and the fleet feels it.',
    },
    freeTrade: {
      name: 'Free trade',
      desc: 'Conquered systems prosper, but no more looting.',
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
    compositeArmor: {
      name: 'Composite armour',
      desc: 'Raises the hull points of every ship in battle.',
    },
    orbitalLogistics: {
      name: 'Orbital logistics',
      desc: 'Conquered planets yield more loot and fleet upkeep is eased.',
    },
    spaceDiplomacy: {
      name: 'Space diplomacy',
      desc: 'Reopens the Senate’s channels: unlocks decrees and negotiation with the Sentinels.',
    },
    megastructureEngineering: {
      name: 'Megastructure engineering',
      desc: 'Unlocks Megaprojects: colossal works, to be rebuilt every run.',
    },
    galacticConstitution: {
      name: 'Galactic constitution',
      desc: 'One extra decree slot.',
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
    reinforcedHulls: {
      name: 'Reinforced Hulls',
      desc: '+10% ship hit points per level (this run only).',
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
    battleLost: 'Assault repelled — ships were lost.',
    noFleetEngaged: 'No ship committed.',
    cannotEndRun: "You need to complete the run's objective first.",
    runEnded: 'Run complete! +{points} ✨ and your faction levels up.',
    cannotAscend: 'Your faction needs to reach level {level} to ascend.',
    ascended: 'Ascension! Every faction resets to zero — pick your reward.',
    ascensionRewardChosen: '{name} — Ascension reward gained (level {level}).',
    maintenanceLoss: 'Insufficient upkeep: ships were lost.',
    unlocked: 'New: {name}',
    achievementUnlocked: 'Achievement unlocked: {name}',
    storyUnlocked: 'Logbook: {title}',
    storyUnlockedMany: 'Logbook: {n} new entries',
    systemLocked: 'Level {level} required to access this system.',
    levelUp: 'Level {level} reached!',
    planetConquered: 'Planet conquered!',
    battleWon: 'Combat phase won.',
    saveRecovered:
      'Unreadable save archived (starshipClickerSave.bak). New game.',
    saveReset:
      'The game changed significantly (factions, node-based exploration). Your old save was archived — new game!',
    eventGain: '{name}: {list}',
    megastructureBuilt: '{name} — level {level}.',
    decreeAdopted: 'Decree enacted: {name}.',
    decreeAbrogated: 'Decree repealed: {name}.',
    decreeSlotsFull: 'All decree slots are taken — repeal one.',
    planetNegotiated: 'The Sentinels stand down: planet obtained without a fight. Loot: {list}',
    choice: {
      sentinels: {
        ally: 'The Sentinels swear loyalty to you: ship hull points +25% for this run.',
        destroy: 'The Bastion is down: loot +25% for this run.',
      },
    },
  },
};
