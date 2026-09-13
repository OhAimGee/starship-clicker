// Dictionnaire français (langue par défaut).
// Les libellés mécaniques (« +X ⚡/s », coûts) sont composés par l'UI à partir
// des données ; ici on ne met que les noms et le texte d'ambiance.

export const fr = {
  ui: {
    title: 'Starship Clicker',
    tagline: 'Bâtissez une civilisation spatiale, un clic à la fois.',
    mothership: 'Vaisseau mère — lancer une charge d’énergie',
    perClick: '+{n} ⚡ par clic',
    civLevel: 'Niveau de civilisation',
    civShort: 'Civ.',
    producedShort: 'Énergie produite',
    a11y: {
      resources: 'Panneau des ressources',
      terminals: 'Terminaux',
      runStatus: 'Statut de la run',
    },
    tabs: {
      shop: 'Boutique',
      fleet: 'Flotte',
      exploration: 'Exploration',
      technology: 'Technologies',
      ascension: 'Ascension',
    },
    panels: {
      shop: 'Centre de commande',
      fleet: 'Chantier naval',
      exploration: 'Carte galactique',
      technology: 'Centre de recherche',
      ascension: "Temple de l'Ascension",
    },
    sections: {
      generators: 'Générateurs',
      clickUpgrades: 'Améliorations du vaisseau',
      ships: 'Vaisseaux',
      research: 'Recherches',
      explorationMap: 'Systèmes',
      conqueredSystems: 'Systèmes conquis',
      prestigeUpgrades: 'Améliorations permanentes',
      factionSkills: 'Compétences — {faction}',
      ascensionStats: 'Statistiques',
      ascension: 'Ascension — objectif ultime',
      ascensionRewards: "Récompenses d'Ascension possédées",
      endRun: 'Terminer la run',
      runSkillTree: 'Compétences de run',
      combatLog: 'Journal de combat',
    },
    cols: {
      cost: 'Coût',
    },
    stats: {
      totalEnergy: 'Énergie totale produite',
      perSecond: 'Production par seconde',
      fleetPower: 'Puissance de flotte',
      conquered: 'Systèmes conquis',
      totalClicks: 'Clics au total',
      ascensions: 'Runs terminées',
      trueAscensions: 'Ascensions',
      lifetimeEnergy: 'Énergie de toutes les vies',
      permanentBonus: 'Bonus de production permanent',
      owned: 'Possédés',
      runObjective: 'Objectif de la run',
      runSkillPoints: 'Points de compétence',
      playerLevel: 'Niveau du joueur',
    },
    factionSelect: {
      title: 'Choisir une faction',
      intro:
        'La faction choisie progresse pendant cette run et débloque ses propres compétences entre les runs, avec les points d’ascension gagnés.',
      level: 'Niveau {n}',
      new: 'Nouvelle',
    },
    objective: {
      conquerAll: 'Conquérir des systèmes',
      conquerOne: 'Conquérir un système',
      reachFleetPower: 'Atteindre une puissance de flotte',
      gatherResources: 'Amasser des ressources',
    },
    nodeMap: {
      none: 'Aucune carte active.',
      noFleet: 'Achetez un vaisseau pour commencer l’exploration.',
      invade: 'Envahir',
      bonus: 'Bonus',
      skillPoint: 'Point de compétence',
      conquest: 'Conquête',
    },
    system: {
      locked: 'Niveau {level} requis',
      conqueredTag: 'Conquis',
      planetCount: '{n} planètes',
    },
    planet: {
      conquered: 'Conquise',
      pending: 'À faire',
      phaseProgress: 'Phase {won}/{total}',
      noReward: 'Aucune récompense.',
      hostileLocked: 'Nécessite la recherche Xéno-colonisation avant d’attaquer — la conquête est définitive, mieux vaut chercher la techno d’abord.',
    },
    planetType: {
      invaded: 'Envahie',
      hostile: 'Hostile',
      uninhabited: 'Non-habitée',
      gas: 'Gazeuse',
    },
    buttons: {
      buy: 'Acheter',
      build: 'Construire',
      research: 'Rechercher',
      researched: 'Recherchée',
      improve: 'Améliorer',
      endRun: 'Terminer la run',
      ascend: 'Ascendre — New Game+',
      reset: 'Recommencer la partie',
      resume: 'Reprendre',
      launch: 'Lancer',
      details: 'Détails',
      cancel: 'Annuler',
      engage: 'Engager',
      close: 'Fermer',
      continue: 'Continuer',
    },
    labels: {
      owned: 'Possédés : {n}',
      level: 'Niveau : {n}',
      cost: 'Coût',
      produces: 'Produit',
      consumes: 'Consomme',
      attack: 'Attaque',
      maintenance: 'Maintenance',
      defense: 'Défense',
      rewards: 'Récompenses',
      perSecondShort: '/s',
      locked: 'Verrouillé',
      unlockHint: 'Débloqué à {amount} {resource}',
      unlockHintTech: 'Nécessite la technologie « {tech} »',
      maintenanceTotal: 'Maintenance totale',
      fleetPowerNeeded: 'Puissance requise : {n}',
      passiveIncome: 'Revenu passif',
    },
    ascension: {
      marquee: 'Tous services terminés',
      intro:
        "L'objectif ultime. Au niveau de faction seuil, choisissez une " +
        'récompense permanente à fort impact — toutes les factions ' +
        'retombent au niveau 0 et perdent leurs compétences : un New ' +
        'Game+. Seules les récompenses d’Ascension survivent.',
      progress: 'Niveau de faction',
    },
    endRun: {
      intro:
        'Terminez la run une fois son objectif rempli : le niveau de votre ' +
        'faction augmente d’un cran et ses compétences (ainsi que l’arbre ' +
        'commun) deviennent achetables avec les points gagnés.',
      requirement: "Disponible une fois l'objectif de la run rempli",
      willGain: 'Vous obtiendrez',
    },
    ascensionChoice: {
      title: "Choisir une récompense d'Ascension",
      intro:
        'Ascension ! Choisissez une récompense permanente — toutes les ' +
        'factions retombent au niveau 0, un New Game+ commence.',
    },
    fleetAllocation: {
      title: 'Engager la flotte',
      intro:
        'Choisissez combien de vaisseaux de chaque type engager sur ce ' +
        'combat — les pertes ne toucheront que la flotte engagée, en cas ' +
        'de victoire comme d’échec.',
    },
    battleReport: {
      titleWon: 'Combat remporté',
      titleLost: 'Assaut repoussé',
      power: 'Puissance engagée {committed} — défense {required}',
      losses: 'Pertes',
      noLosses: 'Aucune perte.',
    },
    runSummary: {
      title: 'Run terminée',
      intro: 'Voici ce que votre civilisation a accompli durant cette run.',
      pointsEarned: 'Points d’ascension gagnés',
      noResources: 'Aucune ressource notable récoltée durant cette run.',
    },
    runSkillTree: {
      intro:
        'Dépensez vos points de compétence de run (gagnés sur la carte ' +
        'd’exploration) pour des bonus temporaires — ils ne durent que ' +
        'cette run.',
    },
    offline: {
      title: 'Bon retour, Commandant',
      body: 'Votre civilisation a prospéré pendant votre absence ({duration}).',
      gains: 'Gains accumulés',
      hours: '{n} h',
      minutes: '{n} min',
    },
    reset: {
      title: 'Réinitialiser',
      confirm:
        'Recommencer une partie neuve ? Toute progression sera perdue ' +
        '(sans effet sur les autres sauvegardes du navigateur).',
    },
    achievements: {
      title: 'Succès',
    },
    quit: {
      cannotClose:
        'Le navigateur ne permet pas de fermer cet onglet automatiquement — vous pouvez le fermer vous-même.',
    },
    pauseMenu: {
      button: 'Menu',
      title: 'Menu',
      achievements: 'Succès',
      options: 'Options',
      mainMenu: "Menu principal",
    },
    language: 'Langue',
    footer:
      'Sauvegarde automatique locale · aucune donnée ne quitte la machine.',
  },

  mainMenu: {
    continue: 'Continuer',
    newGame: 'Nouveau',
    tutorial: 'Tutoriel',
    achievements: 'Succès',
    options: 'Options',
    quit: 'Quitter',
    overwriteWarning:
      'Créer un nouveau Commandant écrasera la partie en cours. Continuer ?',
    defaultCommanderName: 'Commandant',
  },

  commanderCreation: {
    title: 'Créer un Commandant',
    intro:
      'Choisis un nom et une faction pour débuter — la faction choisie ' +
      'progresse pendant cette partie.',
    nameLabel: 'Nom du Commandant',
    namePlaceholder: 'Commandant',
  },

  tutorial: {
    skip: 'Passer le tutoriel',
    next: 'Suivant',
    finish: 'Terminer',
    stepCounter: 'Étape {n} / {total}',
    steps: {
      intro: {
        title: 'Bienvenue, Commandant',
        body1:
          'Ce tutoriel te guide à travers une boucle de jeu complète : récolter de l’énergie, construire une flotte, conquérir un système, puis comprendre la progression à long terme.',
        body2: 'Chaque étape indique un vrai bouton à cliquer — suis le guide.',
      },
      click: {
        title: 'Récolter de l’énergie',
        body1: 'Cliquez sur le vaisseau mère pour récolter de l’énergie.',
      },
      buySolar: {
        title: 'Premier producteur',
        body1:
          'Achetez un Panneau solaire : il produit de l’énergie tout seul, même sans cliquer.',
      },
      buyMining: {
        title: 'Extraire du métal',
        body1:
          'Achetez un Drone minier : il vous faudra du métal pour construire des vaisseaux.',
      },
      goFleetTab: {
        title: 'Direction la Flotte',
        body1: 'Ouvrez l’onglet Flotte pour construire vos premiers vaisseaux.',
      },
      buyFighters: {
        title: 'Construire une flotte',
        body1: 'Achetez deux Chasseurs.',
        body2:
          'Une flotte permet d’explorer les systèmes et de combattre — un seul vaisseau suffit rarement.',
      },
      goExplorationTab: {
        title: 'Direction l’Exploration',
        body1: 'Ouvrez l’onglet Exploration : votre flotte vous ouvre l’accès aux systèmes.',
      },
      openSystem0: {
        title: 'Ouvrir un système',
        body1: 'Cliquez sur le premier système de la liste pour voir ses planètes.',
      },
      engageCombat: {
        title: 'Engager le combat',
        body1: 'Cliquez sur « Engager » pour attaquer la planète, puis confirmez l’allocation de flotte.',
        retry: 'Assaut repoussé — réessayez, votre flotte est toujours là.',
      },
      systemConquered: {
        title: 'Système conquis !',
        body1: 'Fermez cette fenêtre pour revenir à la carte.',
      },
      showLevelXp: {
        title: 'Niveau de Commandant',
        body1:
          'Chaque combat rapporte de l’XP : votre niveau grimpe ici, et débloque des systèmes plus loin dans la carte.',
      },
      goTechnologyTab: {
        title: 'Centre de recherche',
        body1: 'L’onglet Technologies débloque des multiplicateurs permanents pour votre production.',
      },
      mentionFleetSkills: {
        title: 'Compétences de run',
        body1:
          'L’onglet Flotte (déjà visité) contient aussi un arbre de compétences temporaires, payées avec les points gagnés en combat.',
      },
      goAscensionTab: {
        title: 'Temple de l’Ascension',
        body1:
          'Cet onglet regroupe la fin de run, les compétences de faction, et l’Ascension véritable.',
      },
      explainEndRun: {
        title: 'Terminer la run',
        body1: 'Cliquez sur « Terminer la run » : votre objectif est rempli.',
      },
      factionReselect: {
        title: 'Nouvelle run',
        body1: 'Choisissez une faction pour repartir — les technologies et votre niveau sont conservés.',
      },
      explainTrueAscension: {
        title: 'L’Ascension véritable',
        body1:
          'Ce bouton reste grisé jusqu’à ce que votre faction atteigne le niveau 10 — plusieurs fins de run seront nécessaires.',
        body2: 'Ascender remet tout à zéro mais offre une récompense permanente pour toutes vos parties futures.',
      },
      complete: {
        title: 'Tutoriel terminé',
        body1: 'Vous connaissez la boucle complète. Bon jeu, Commandant !',
      },
    },
  },

  updateNotice: {
    corbi: {
      title: 'Corbi Update',
      intro: 'Quoi de neuf dans cette mise à jour :',
      bullet1: 'Changez d’onglet en swipant à gauche ou à droite sur mobile.',
      bullet2:
        'Un résumé s’affiche maintenant à la fin de chaque run (ressources récoltées, systèmes conquis, points gagnés).',
      bullet3: 'Le double-tap sur iPhone ne déclenche plus de zoom accidentel.',
    },
  },

  options: {
    title: 'Options',
    theme: 'Thème',
    themeName: {
      cyberspace: 'CyberSpace (bleu)',
      solstice: 'Solstice (ambre)',
      phosphore: 'Phosphore (vert)',
    },
  },

  achievement: {
    firstClick: {
      name: 'Premier contact',
      desc: 'Cliquez sur le vaisseau mère pour la première fois.',
    },
    hundredClicks: {
      name: 'Doigt agile',
      desc: 'Cliquez 100 fois au total.',
    },
    firstGenerator: {
      name: 'Premiers rouages',
      desc: 'Construisez un premier générateur.',
    },
    firstShip: {
      name: 'Premier vaisseau',
      desc: 'Construisez un premier vaisseau.',
    },
    firstTech: {
      name: 'Éveil scientifique',
      desc: 'Achevez une première recherche.',
    },
    firstSystemConquered: {
      name: 'Premier drapeau planté',
      desc: 'Conquérez un premier système.',
    },
    firstEndRun: {
      name: 'Premier retour au port',
      desc: 'Terminez une première run.',
    },
    firstAscension: {
      name: 'Renaissance',
      desc: 'Ascendez pour la première fois.',
    },
    fleetOf1000: {
      name: 'Armada',
      desc: 'Possédez 1000 vaisseaux au total.',
    },
    allGeneratorTypes: {
      name: 'Industrie complète',
      desc: 'Possédez au moins un exemplaire de chaque générateur.',
    },
    playerLevel10: {
      name: 'Commandant aguerri',
      desc: 'Atteignez le niveau de joueur 10.',
    },
  },

  resource: {
    energy: 'Énergie',
    metal: 'Métal',
    crystals: 'Cristaux',
    antimatter: 'Antimatière',
    influence: 'Influence',
    darkMatter: 'Matière noire',
    quantumEnergy: 'Énergie quantique',
    ascensionPoints: "Points d'ascension",
  },

  generator: {
    solarPanel: {
      name: 'Panneau solaire',
      desc: "Capte l'énergie stellaire. La base de tout.",
    },
    miningDrone: {
      name: 'Drone mineur',
      desc: 'Extrait le métal des astéroïdes proches.',
    },
    crystalExtractor: {
      name: 'Extracteur de cristaux',
      desc: 'Raffine le métal en cristaux énergétiques.',
    },
    fusionReactor: {
      name: 'Réacteur à fusion',
      desc: 'Brûle des cristaux pour un rendement énergétique élevé.',
    },
    stellarForge: {
      name: 'Forge stellaire',
      desc: 'Transmute les cristaux en alliages lourds.',
    },
    antimatterGenerator: {
      name: "Générateur d'antimatière",
      desc: 'Piège des particules d’antimatière dans un confinement cristallin.',
    },
    senateArchive: {
      name: 'Archives du Sénat',
      desc: "Diplomatie et bureaucratie : lentement, l'influence croît.",
    },
    quantumHarvester: {
      name: 'Récolteur quantique',
      desc: "Convertit l'énergie brute en antimatière stabilisée.",
    },
    dimensionalRift: {
      name: 'Faille dimensionnelle',
      desc: 'Arrache des cristaux au tissu même de l’espace.',
    },
    darkMatterCollector: {
      name: 'Collecteur de matière noire',
      desc: 'Filtre la matière noire du vide intergalactique.',
    },
    quantumResonator: {
      name: 'Résonateur quantique',
      desc: "Fait vibrer la matière noire jusqu'à l'énergie quantique.",
    },
    voidHarvester: {
      name: 'Moissonneur du vide',
      desc: 'Puise une énergie colossale dans le néant.',
    },
    cosmicFurnace: {
      name: 'Fournaise cosmique',
      desc: 'Forge du métal à l’échelle stellaire.',
    },
    realityEngine: {
      name: 'Moteur de réalité',
      desc: 'Réécrit les lois locales pour cristalliser la matière.',
    },
    hypermatterCondenser: {
      name: 'Condensateur d’hypermatière',
      desc: 'Condense l’énergie quantique en antimatière pure.',
    },
    voidLoom: {
      name: 'Métier du vide',
      desc: 'Tisse la matière noire à partir de l’énergie quantique.',
    },
  },

  ship: {
    fighters: {
      name: 'Chasseurs',
      desc: 'Rapides, jetables, efficaces en nombre.',
    },
    cruisers: { name: 'Croiseurs', desc: 'L’ossature d’une flotte sérieuse.' },
    dreadnoughts: { name: 'Cuirassés', desc: 'Blindage lourd, frappe lourde.' },
    titans: { name: 'Titans', desc: 'Des forteresses mobiles.' },
    motherships: {
      name: 'Vaisseaux mères',
      desc: 'Projettent la puissance d’un empire.',
    },
    worldBurners: {
      name: 'Brûleurs de mondes',
      desc: 'Ce que leur nom promet.',
    },
    voidCrusaders: {
      name: 'Croisés du vide',
      desc: 'Taillés dans la matière noire.',
    },
    realityShifters: {
      name: 'Manipulateurs de réalité',
      desc: 'La guerre comme acte métaphysique.',
    },
  },

  tech: {
    advancedPropulsion: {
      name: 'Propulsion avancée',
      desc: 'Réduit le coût de construction des vaisseaux.',
    },
    quantumComputing: {
      name: 'Informatique quantique',
      desc: 'Optimise tous les générateurs.',
    },
    neuralNetworks: {
      name: 'Réseaux de neurones',
      desc: 'Les générateurs s’auto-achètent quand les ressources abondent.',
    },
    warpDrive: {
      name: 'Moteur de distorsion',
      desc: 'Débloque les systèmes stellaires lointains.',
    },
    xenoColonization: {
      name: 'Xéno-colonisation',
      desc: 'Permet de tirer une production permanente des planètes à environnement hostile conquises.',
    },
    energyEfficiency: {
      name: 'Efficacité énergétique',
      desc: 'Réduit la maintenance de la flotte.',
    },
    hyperSpace: {
      name: 'Hyperespace',
      desc: 'Double le revenu passif des systèmes conquis.',
    },
    nanotechnology: {
      name: 'Nanotechnologie',
      desc: 'Auto-réparation : production des générateurs accrue.',
    },
    artificialIntelligence: {
      name: 'Intelligence artificielle',
      desc: 'Coordonne la production à l’échelle de la civilisation.',
    },
    darkMatterPhysics: {
      name: 'Physique de la matière noire',
      desc: 'Double la production de matière noire.',
    },
    quantumEntanglement: {
      name: 'Intrication quantique',
      desc: 'Double la production d’énergie quantique.',
    },
    voidTechnology: {
      name: 'Technologie du vide',
      desc: 'Triple toute la production des générateurs.',
    },
    realityManipulation: {
      name: 'Manipulation de la réalité',
      desc: 'x5 sur la production et le pouvoir de clic.',
    },
  },

  clickUpgrade: {
    clickPower: {
      name: 'Amplificateur de clic',
      desc: 'Augmente l’énergie gagnée par clic.',
    },
    autoClicker: {
      name: 'Auto-clic',
      desc: 'Clique automatiquement une fois par seconde.',
    },
  },

  prestigeUpgrade: {
    prestigeProduction: {
      name: 'Doctrine de production',
      desc: '+10 % de production par niveau (permanent).',
    },
    prestigeClick: {
      name: 'Doctrine du clic',
      desc: '+25 % de pouvoir de clic par niveau (permanent).',
    },
    fleetCommand: {
      name: 'Commandement de flotte',
      desc: '+20 % de puissance de flotte par niveau (permanent).',
    },
    quantumAffinity: {
      name: 'Affinité quantique',
      desc: '+50 % de production de matière noire et d’énergie quantique par niveau.',
    },
  },

  faction: {
    miningCollective: {
      name: 'Collectif minier',
      desc: '+25 % de production de métal et de cristaux dès le départ.',
    },
    ironLegion: {
      name: 'Légion de fer',
      desc: '+20 % de puissance de flotte dès le départ.',
    },
    quantumOrder: {
      name: 'Ordre quantique',
      desc: '+20 % de production d’antimatière, de matière noire et d’énergie quantique dès le départ.',
    },
  },

  factionSkill: {
    deepCoreDrilling: {
      name: 'Forage en profondeur',
      desc: '+30 % de production de métal par niveau.',
    },
    crystalRefining: {
      name: 'Raffinage des cristaux',
      desc: '+30 % de production de cristaux par niveau.',
    },
    massProduction: {
      name: 'Production de masse',
      desc: '+15 % de production globale par niveau.',
    },
    stellarSmelting: {
      name: 'Fonderie stellaire',
      desc: '+25 % de production d’énergie par niveau.',
    },
    bulkFreight: {
      name: 'Fret en gros',
      desc: '-10 % de coût des vaisseaux par niveau.',
    },
    shipyards: {
      name: 'Chantiers navals',
      desc: '+25 % de puissance de flotte par niveau.',
    },
    leanLogistics: {
      name: 'Logistique optimisée',
      desc: '-15 % de maintenance de flotte par niveau.',
    },
    rapidAssembly: {
      name: 'Assemblage rapide',
      desc: '-12 % de coût des vaisseaux par niveau.',
    },
    ironDiscipline: {
      name: 'Discipline de fer',
      desc: '+20 % de pouvoir de clic par niveau.',
    },
    warReserves: {
      name: 'Réserves de guerre',
      desc: '+25 % de production de métal par niveau.',
    },
    entangledFields: {
      name: 'Champs intriqués',
      desc: '+40 % de production d’énergie quantique par niveau.',
    },
    voidSight: {
      name: 'Vision du vide',
      desc: '+30 % de pouvoir de clic par niveau.',
    },
    ascendantMinds: {
      name: 'Esprits ascendants',
      desc: '+15 % de production globale par niveau.',
    },
    darkResonance: {
      name: 'Résonance noire',
      desc: '+35 % de production de matière noire par niveau.',
    },
    fleetSingularity: {
      name: 'Singularité de flotte',
      desc: '+15 % de puissance de flotte par niveau.',
    },
  },

  runSkill: {
    overclockedThrusters: {
      name: 'Propulseurs surchargés',
      desc: '+8 % de puissance de flotte par niveau (cette run seulement).',
    },
    scavengerProtocols: {
      name: 'Protocoles de récupération',
      desc:
        '+10 % de production de métal et de cristaux par niveau (cette ' +
        'run seulement).',
    },
    rapidFire: {
      name: 'Tir rapide',
      desc: '+10 % de pouvoir de clic par niveau (cette run seulement).',
    },
    fieldRepairs: {
      name: 'Réparations de campagne',
      desc: '-8 % de maintenance de flotte par niveau (cette run seulement).',
    },
    streamlinedLogistics: {
      name: 'Logistique allégée',
      desc: '-6 % de coût des vaisseaux par niveau (cette run seulement).',
    },
    energyFocus: {
      name: 'Focalisation énergétique',
      desc: '+6 % de production globale par niveau (cette run seulement).',
    },
  },

  ascensionReward: {
    hyperProduction: {
      name: 'Surcharge de production',
      desc: '+50 % de production globale par niveau.',
    },
    overcharge: {
      name: 'Surtension du vaisseau mère',
      desc: '+60 % de pouvoir de clic par niveau.',
    },
    grandArmada: {
      name: 'Grande Armada',
      desc: '+50 % de puissance de flotte par niveau.',
    },
    stockpile: {
      name: 'Réserves stratégiques',
      desc: '+45 % de production de métal et de cristaux par niveau.',
    },
    quantumMastery: {
      name: 'Maîtrise quantique',
      desc:
        '+45 % de production de matière noire, d’énergie quantique et ' +
        'd’antimatière par niveau.',
    },
    masterShipwrights: {
      name: 'Maîtres charpentiers',
      desc: '-15 % de coût des vaisseaux par niveau.',
    },
    selfSufficientFleet: {
      name: 'Flotte autonome',
      desc: '-20 % de maintenance de flotte par niveau.',
    },
    primordialSpark: {
      name: 'Étincelle primordiale',
      desc: "+50 % de production d'énergie par niveau.",
    },
  },

  event: {
    solarStorm: 'Tempête solaire',
    archaeologicalFind: 'Découverte archéologique',
    quantumAnomaly: 'Anomalie quantique',
    diplomaticContact: 'Contact diplomatique',
    darkMatterVortex: 'Vortex de matière noire',
  },

  systemArchetype: {
    mining: 'Système minier',
    energetic: 'Système énergétique',
    crystalline: 'Système cristallin',
    balanced: 'Système équilibré',
    hostile: 'Système hostile',
    antimatterComplex: 'Complexe d’antimatière',
    quantumStation: 'Station quantique',
    galacticFortress: 'Forteresse galactique',
    tradeHub: 'Nœud commercial',
    cosmicLab: 'Laboratoire cosmique',
    diplomatic: 'Système diplomatique',
    voidBastion: 'Bastion du vide',
    volatile: 'Système volatil',
    darkNexus: 'Nexus de matière noire',
    legacy: 'Système',
  },

  notify: {
    welcome: 'Bienvenue ! Cliquez sur le vaisseau mère pour commencer.',
    cantAfford: 'Ressources insuffisantes.',
    cantAffordPrestige: "Pas assez de points d'ascension.",
    cantAffordRunSkill: 'Pas assez de points de compétence de run.',
    missingResources: 'Il manque : {list}',
    generatorBought: '{name} construit.',
    shipBuilt: '{name} mis en service.',
    upgradeBought: 'Amélioration achetée : {name}.',
    techResearched: 'Technologie acquise : {name}.',
    prestigeUpgraded: '{name} — niveau {level}.',
    factionSkillBought: '{name} — niveau {level}.',
    runSkillBought: '{name} — niveau {level}.',
    nodeReward: 'Butin : {list}',
    skillPointGained: '+1 point de compétence de run.',
    objectiveComplete:
      'Objectif de run atteint ! Tu peux terminer la run pour le bonus.',
    systemConquered: '{name} conquis !',
    fleetTooWeak: 'Flotte trop faible (puissance requise : {required}).',
    battleLost:
      'Assaut repoussé (défense : {required}) — des vaisseaux ont été perdus.',
    cannotEndRun: "Il faut d'abord remplir l'objectif de la run.",
    runEnded: 'Run terminée ! +{points} ✨ et la faction monte de niveau.',
    cannotAscend: 'Il faut atteindre le niveau {level} avec ta faction pour ascendre.',
    ascended: 'Ascension ! Toutes les factions repartent à zéro — choisis ta récompense.',
    ascensionRewardChosen: '{name} — récompense d’Ascension obtenue (niveau {level}).',
    maintenanceLoss: 'Maintenance insuffisante : des vaisseaux ont été perdus.',
    unlocked: 'Nouveau : {name}',
    achievementUnlocked: 'Succès débloqué : {name}',
    systemLocked: 'Niveau {level} requis pour accéder à ce système.',
    levelUp: 'Niveau {level} atteint !',
    planetConquered: 'Planète conquise !',
    battleWon: 'Phase de combat remportée.',
    saveRecovered:
      'Sauvegarde illisible archivée (starshipClickerSave.bak). Nouvelle partie.',
    saveReset:
      'Le jeu a changé en profondeur (factions, exploration par nœuds). Ton ancienne sauvegarde est archivée, nouvelle partie !',
    eventGain: '{name} : {list}',
  },
};
