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
    // Libellés courts du pager mobile (5 onglets en une ligne de 2,1 rem).
    tabsShort: {
      shop: 'Boutique',
      fleet: 'Flotte',
      exploration: 'Explor.',
      technology: 'Techno.',
      ascension: 'Ascens.',
    },
    // Libellé court du bandeau objectif permanent (mobile : 366 px de large).
    objectiveBar: {
      label: 'Objectif',
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
      megastructures: 'Chantiers',
      decrees: 'Décrets du Sénat',
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
      negotiateNote: 'Les Sentinelles acceptent de discuter : {cost} d’influence pour obtenir la planète sans combat (butin réduit de moitié).',
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
      negotiate: 'Négocier',
      adopt: 'Décréter',
      abrogate: 'Abroger',
      close: 'Fermer',
      continue: 'Continuer',
    },
    labels: {
      owned: 'Possédés : {n}',
      level: 'Niveau : {n}',
      levelShort: 'Niv. {n}',
      cost: 'Coût',
      produces: 'Produit',
      consumes: 'Consomme',
      attack: 'Attaque',
      hp: 'Structure',
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
      levelOf: 'Niv. {n} / {max}',
      maxed: 'Max',
      slots: 'Emplacements : {used} / {total}',
      adopted: 'Adopté',
      slotsFull: 'Emplacements pleins',
      effects: 'Effets',
      nextLevel: 'Prochain niveau',
      megastructuresLead: 'Ouvrages colossaux : chaque niveau bâti est perdu à la fin de la run.',
      decreesLead: 'Une politique par emplacement, payée en influence. Abroger est gratuit, mais décréter de nouveau se paie.',
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
        'Choisissez combien de vaisseaux de chaque type engager. La ' +
        'bataille se joue round par round et le hasard s’en mêle : les ' +
        'vaisseaux détruits sont perdus (les épaves sont en partie ' +
        'récupérées), en cas de victoire comme d’échec.',
      enemy: 'Ennemi : {name}',
      composition: 'Composition',
      winChance: 'Chance de victoire',
      estLosses: 'Pertes prévues',
      percent: '{n} %',
      recommended: 'Recommandé',
      all: 'Tout engager',
      chanceNote: 'Estimation sur {n} batailles simulées.',
      minHint:
        'Pré-rempli avec la plus petite flotte qui vise {target} % de chances ' +
        'de victoire (des plus petits vaisseaux aux plus gros). Engagez plus ' +
        'de vaisseaux pour réduire le risque et les pertes.',
      notEnough:
        'Même toute votre flotte n’atteint pas {target} % de chances de ' +
        'victoire : tout est engagé par défaut.',
    },
    battleReport: {
      titleWon: 'Combat remporté',
      titleLost: 'Assaut repoussé',
      titleRetreat: 'Repli de la flotte',
      power: 'Puissance engagée {committed} — défense {required}',
      rounds: '{n} rounds',
      destroyed: 'Vaisseaux détruits',
      recovered: 'Épaves récupérées',
      losses: 'Pertes définitives',
      noLosses: 'Aucune perte.',
      enemyLosses: 'Forces ennemies détruites',
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
    journal: {
      title: 'Journal de bord',
      locked: 'Entrée verrouillée',
      bestiary: 'Ennemis rencontrés',
      bestiaryEmpty: 'Aucun ennemi rencontré pour l’instant.',
    },
    quit: {
      cannotClose:
        'Le navigateur ne permet pas de fermer cet onglet automatiquement — vous pouvez le fermer vous-même.',
    },
    // Tiroir mobile (burger) et boutons d'en-tête desktop — mêmes entrées.
    drawer: {
      open: 'Ouvrir le menu',
      close: 'Fermer le menu',
      back: 'Retour au menu',
      title: 'Menu du commandant',
      commander: 'Commandant',
      achievements: 'Succès',
      achievementsSub: '{done} / {total} débloqués',
      journal: 'Journal de bord',
      journalSub: '{done} / {total} entrées',
      options: 'Options',
      optionsSub: 'Langue, thème et combats',
      mainMenu: 'Menu principal',
      mainMenuSub: 'Quitter la partie en cours',
      reset: 'Recommencer la partie',
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
        retry: 'Assaut repoussé : le hasard n’était pas avec vous. Vos chasseurs sont remplacés, réessayez.',
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
    civilEngineer: {
      title: 'Civil Engineer Update',
      intro: 'Quoi de neuf dans cette mise à jour :',
      bullet1:
        'Chantiers : six mégastructures (sphère de Dyson, ascenseur orbital, forge-monde…) à bâtir niveau par niveau pendant la run. Une nouvelle section de la Boutique, débloquée par la recherche « Ingénierie des mégastructures ».',
      bullet2:
        'Décrets du Sénat : l’influence sert enfin ! Adoptez des politiques à double tranchant (Mobilisation, Austérité, Économie de guerre…) et changez-en selon la situation.',
      bullet3:
        'Les Sentinelles : des gardiens très blindés que l’on peut affronter… ou négocier. Chapitre 2 du Journal de bord, planète-boss « Bastion des Sentinelles » et un choix : allier ou détruire.',
      bullet4:
        'Six nouveaux générateurs (dont trois d’influence), cinq technologies dont le Blindage composite, et cinq nouveaux succès.',
    },
  },

  options: {
    title: 'Options',
    theme: 'Thème',
    combatPlayback: 'Combats',
    playback: {
      animated: 'Journal animé',
      summary: 'Résumé seulement',
    },
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
    firstBlood: {
      name: 'Premier sang',
      desc: 'Remportez une bataille.',
    },
    flawlessVictory: {
      name: 'Sans une égratignure',
      desc: 'Remportez une bataille sans aucune perte définitive.',
    },
    swarmCrusher: {
      name: 'Écraseur d’Essaim',
      desc: 'Détruisez 100 unités ennemies au total.',
    },
    nestSlayer: {
      name: 'Tueur de reine',
      desc: 'Vainquez la Nid-mère.',
    },
    firstMegastructure: {
      name: 'Bâtisseur',
      desc: 'Achevez un premier niveau de mégastructure.',
    },
    wonderBuilder: {
      name: 'Architecte de l’impossible',
      desc: 'Portez toutes les mégastructures à leur niveau maximal, dans la même run.',
    },
    firstDecree: {
      name: 'Législateur',
      desc: 'Adoptez un premier décret du Sénat.',
    },
    diplomat: {
      name: 'Diplomate',
      desc: 'Obtenez une planète par la négociation.',
    },
    bastionGates: {
      name: 'Les portes du Bastion',
      desc: 'Résolvez le Bastion des Sentinelles, par la force ou par la parole.',
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
    embassy: {
      name: 'Ambassade',
      desc: 'Un corps diplomatique installé sur place : l’influence s’obtient en échange de métal.',
    },
    treatyBureau: {
      name: 'Bureau des traités',
      desc: 'Rédige, ratifie et fait appliquer des traités contre de l’antimatière : l’influence gagne en portée.',
    },
    particleCollider: {
      name: 'Collisionneur de particules',
      desc: 'Fracasse de l’antimatière contre elle-même jusqu’à en tirer de l’énergie quantique — sans passer par la matière noire.',
    },
    forbiddenArchive: {
      name: 'Archive interdite',
      desc: 'Des recherches que le Sénat avait scellées : elles se paient en influence et livrent de la matière noire.',
    },
    galacticTribunal: {
      name: 'Tribunal galactique',
      desc: 'Juge les différends de tout un secteur : l’énergie quantique rend ses verdicts incontestables.',
    },
    zeroPointExtractor: {
      name: 'Extracteur de point zéro',
      desc: 'Convertit de colossales quantités d’énergie ordinaire en énergie quantique.',
    },
  },

  enemy: {
    class: {
      drone: 'Drone',
      frigate: 'Frégate',
      cruiser: 'Croiseur',
      bastion: 'Bastion',
      leviathan: 'Léviathan',
      sentinel: 'Sentinelle',
    },
    classPlural: {
      drone: 'Drones',
      frigate: 'Frégates',
      cruiser: 'Croiseurs',
      bastion: 'Bastions',
      leviathan: 'Léviathans',
      sentinel: 'Sentinelles',
    },
    profile: {
      swarm: {
        name: 'L’Essaim',
        hint: 'Des nuées d’unités légères : vos gros vaisseaux y gaspillent leurs tirs — le nombre l’emporte.',
        intro: 'Une nuée de drones s’élève à votre approche. L’Essaim vous a repérés.',
        victory: 'L’Essaim se disperse : la voie est libre.',
        defeat: 'L’Essaim referme son étau sur ce qu’il reste de vos vaisseaux.',
        retreat: 'Sous la pression de l’Essaim, vos vaisseaux rompent le contact.',
      },
      garrison: {
        name: 'Forces d’occupation',
        hint: 'Un mélange équilibré autour d’un noyau blindé : n’engagez pas que de petits vaisseaux.',
        intro: 'Les défenses de la garnison s’activent, ses batteries se verrouillent sur votre flotte.',
        victory: 'La garnison capitule, ses batteries se taisent.',
        defeat: 'La garnison tient bon : votre flotte est balayée.',
        retreat: 'La garnison est trop solide : vos vaisseaux battent en retraite.',
      },
      nest: {
        name: 'La Nid-mère',
        hint: 'Une reine colossale au cœur d’une nuée : balayez les drones avec du nombre, mais gardez du lourd pour percer sa carapace.',
        intro: 'Le sol vibre. La Nid-mère se dresse, ses drones jaillissent de toutes parts.',
        victory: 'La reine s’effondre : la nuée s’éteint, privée de son cœur.',
        defeat: 'La Nid-mère engloutit votre flotte sous sa nuée.',
        retreat: 'Sa carapace résiste à tout : vos vaisseaux rompent le contact.',
      },
      wilds: {
        name: 'Faune hostile',
        hint: 'Quelques créatures colossales et cuirassées : les petits calibres y sont inefficaces, engagez du lourd.',
        intro: 'Des formes colossales se détachent du sol : la faune locale attaque.',
        victory: 'Les créatures s’effondrent une à une : la planète retrouve le calme.',
        defeat: 'Les créatures massacrent votre flotte.',
        retreat: 'Vos armes glissent sur leur carapace : repli en urgence.',
      },
      sentinels: {
        name: 'Les Sentinelles',
        hint: 'Des gardiens peu nombreux mais lourdement blindés : engagez du gros calibre… ou ouvrez le dialogue (Diplomatie spatiale).',
        intro: 'Les gardiens du Sénat se mettent en formation. Aucun mot : seulement leurs boucliers qui s’élèvent.',
        victory: 'Les Sentinelles cessent le feu, leurs boucliers s’éteignent un à un.',
        defeat: 'Les Sentinelles tiennent leur position : votre flotte est repoussée.',
        retreat: 'Elles ne poursuivent pas : vos vaisseaux en profitent pour rompre le contact.',
      },
    },
  },

  boss: {
    motherNest: { name: 'Nid-mère' },
    sentinelBastion: { name: 'Bastion des Sentinelles' },
  },

  story: {
    chapter: {
      prologue: { title: 'Prologue — Réveil' },
      tide: { title: 'Chapitre 1 — La Marée' },
      sentinels: { title: 'Chapitre 2 — Les Sentinelles' },
    },
    entry: {
      awakening: {
        title: 'Réveil',
        text: 'Les caissons s’ouvrent un à un. Vous êtes le Commandant {name}, et l’arche-vaisseau qui vous a recueilli dérive au milieu de ce qui fut le Sénat galactique. Rien ne répond sur les fréquences officielles : la Rupture a tout emporté.',
      },
      firstFleet: {
        title: 'Une coque de plus',
        text: 'Un premier chasseur quitte la baie. Petit, fragile, peu coûteux : c’est ce que l’on sait encore fabriquer. Les gros bâtiments viendront, mais chaque coque perdue coûtera plus cher que la précédente.',
      },
      firstContact: {
        title: 'Premier contact',
        text: 'Les drones n’ont pas tiré en premier : ils ont encerclé. L’Essaim n’est pas une armée, c’est un réflexe — des machines abandonnées qui répètent le dernier ordre reçu : occuper. Chaque planète qu’ils tiennent est une ruche.',
      },
      firstFlag: {
        title: 'Premier drapeau',
        text: 'Une planète libre, enfin. Le Sénat n’existe plus, mais quelqu’un doit bien écrire la première ligne du nouveau registre. Vous y inscrivez votre nom.',
      },
      tideRises: {
        title: 'La Marée monte',
        text: 'La première campagne s’achève, mais la carte se redessine : là où vous avez libéré un système, l’Essaim en occupe déjà un autre. Ils reviennent comme une marée. Il faudra remonter jusqu’à la source.',
      },
      swarmNature: {
        title: 'Ce que l’Essaim ne sait pas faire',
        text: 'Après des dizaines d’épaves de drones, un constat : ils tirent vite, visent large et meurent en masse. Vos gros vaisseaux gaspillent leurs salves sur eux ; le nombre, lui, les balaie. À chaque ennemi sa réponse.',
      },
      motherNestSighted: {
        title: 'La Nid-mère',
        text: 'Les sondes convergent : toutes les nuées remontent vers un même système, où la carapace d’une reine colossale masque le ciel. Elle est protégée par ses propres drones — et par un blindage qu’aucun chasseur ne percera.',
      },
      nestFallen: {
        title: 'La reine tombe',
        text: 'La Nid-mère s’effondre et, avec elle, toutes les nuées se figent d’un coup, comme privées d’un ordre. La marée se retire. Reste une question : qui a donné l’ordre à la reine ? Dans ses entrailles, un signal chiffré — des coordonnées.',
      },
      sentinelsSignal: {
        title: 'Un signal sur toutes les fréquences',
        text: 'Vos ingénieurs ont rétabli les canaux diplomatiques du Sénat, et quelque chose y répond : un signal répétitif, ordonné, très ancien. « Zone sous garde. Identifiez-vous. » Les Sentinelles n’ont jamais cessé de monter la garde.',
      },
      sentinelsWardens: {
        title: 'Les gardiens du Sénat',
        text: 'Elles ne chassent pas, elles ne poursuivent pas : elles tiennent. Leur blindage est colossal — les petits calibres y glissent — mais rien dans leurs protocoles n’interdit de discuter avec qui parle leur langue. Chaque planète qu’elles gardent peut se négocier.',
      },
      bastionSighted: {
        title: 'Le Bastion',
        text: 'Toutes les balises convergent vers un point unique : une forteresse-monde, dernier verrou du Sénat. Le Bastion des Sentinelles. On dit qu’il abrite le registre des serments — et l’arsenal pour les faire respecter.',
      },
      bastionAllied: {
        title: 'Le serment renouvelé',
        text: '« Le Sénat n’est plus. Sa garde demeure. » Le Bastion ouvre ses portes : les Sentinelles jurent fidélité à l’arche et au Commandant {name}. Leurs plans de blindage rejoignent vos chantiers. Reste à savoir ce que vaut la parole de machines qui ont attendu si longtemps.',
      },
      bastionRazed: {
        title: 'Le verrou brisé',
        text: 'Le Bastion s’effondre sous vos salves et son arsenal est à vous. Les Sentinelles n’ont pas supplié : elles ont tenu jusqu’au bout. Dans les décombres, vos équipes récupèrent d’immenses réserves — et le sentiment persistant d’avoir fait taire quelque chose qu’il aurait fallu écouter.',
      },
    },
  },

  battle: {
    title: 'Bataille',
    versus: '{system} — {enemy}',
    allyBar: 'Votre flotte',
    enemyBar: 'Ennemi',
    round: 'Round {n}',
    speed: 'Vitesse',
    skip: 'Passer',
    showLog: 'Journal du combat',
    empty: 'Aucun événement.',
    units: 'Unités : {n}',
    line: {
      dodgedAllyOne: 'Attaque évitée : un tir ennemi manque sa cible.',
      dodgedAllyMany: 'Attaques évitées : {n} tirs ennemis manquent leur cible.',
      dodgedEnemyOne: 'Un de vos tirs est esquivé par l’ennemi.',
      dodgedEnemyMany: '{n} de vos tirs sont esquivés par l’ennemi.',
      destroyedEnemyOne: 'Vaisseau ennemi détruit : {unitOne}.',
      destroyedEnemyMany: 'Vaisseaux ennemis détruits : {n} × {unitOne}.',
      destroyedAllyOne: 'Vaisseau perdu : {unitOne}.',
      destroyedAllyMany: 'Vaisseaux perdus : {n} × {unitOne}.',
      timeout: 'Le combat s’éternise : les deux flottes rompent le contact.',
    },
    event: {
      criticalHit: {
        ally: 'Coup critique ! Vos {unit} trouvent une faille (dégâts +50 % ce round).',
        enemy: 'Coup critique ennemi : leurs {unit} percent vos lignes (dégâts +50 % ce round).',
      },
      barrage: {
        ally: 'Salve groupée ! Toute votre flotte tire de concert (+25 % de dégâts).',
        enemy: 'Salve groupée ennemie : leurs tirs convergent (+25 % de dégâts).',
      },
      shieldFailure: {
        ally: 'Boucliers saturés : vos {unit} encaissent de plein fouet (+50 % de dégâts subis).',
        enemy: 'Boucliers saturés côté ennemi : leurs {unit} sont exposés (+50 % de dégâts subis).',
      },
      hullBreach: {
        ally: 'Brèche dans la coque : vos {unit} perdent 6 % de leur structure.',
        enemy: 'Brèche dans la coque ennemie : leurs {unit} perdent 6 % de leur structure.',
      },
      reactorOverheat: {
        ally: 'Réacteur en surchauffe : un de vos {unit} est perdu.',
        enemy: 'Réacteur en surchauffe chez l’ennemi : un de leurs {unit} explose.',
      },
      evasiveManeuver: {
        ally: 'Manœuvre d’évitement : vos {unit} zigzaguent (+20 points d’esquive).',
        enemy: 'Manœuvre d’évitement ennemie : leurs {unit} sont plus difficiles à toucher.',
      },
      emergencyRepairs: {
        ally: 'Réparations d’urgence : vos {unit} regagnent de la structure.',
        enemy: 'L’ennemi répare en urgence ses {unit}.',
      },
      weaponsMalfunction: {
        ally: 'Panne d’armes : vos {unit} ne tirent qu’à moitié.',
        enemy: 'Panne d’armes ennemie : leurs {unit} ne tirent qu’à moitié.',
      },
      decisiveShot: {
        ally: 'Tir décisif ! Un {unitOne} ennemi est détruit net.',
        enemy: 'Tir décisif ennemi : un de vos {unit} est détruit net.',
      },
      reinforcements: {
        enemy: 'Renforts ennemis : de nouveaux {unit} arrivent sur zone.',
      },
    },
  },

  ship: {
    fighters: {
      name: 'Chasseurs',
      one: 'Chasseur',
      desc: 'Rapides, jetables, efficaces en nombre.',
    },
    cruisers: {
      name: 'Croiseurs',
      one: 'Croiseur',
      desc: 'L’ossature d’une flotte sérieuse.',
    },
    dreadnoughts: {
      name: 'Cuirassés',
      one: 'Cuirassé',
      desc: 'Blindage lourd, frappe lourde.',
    },
    titans: { name: 'Titans', one: 'Titan', desc: 'Des forteresses mobiles.' },
    motherships: {
      name: 'Vaisseaux mères',
      one: 'Vaisseau mère',
      desc: 'Projettent la puissance d’un empire.',
    },
    worldBurners: {
      name: 'Brûleurs de mondes',
      one: 'Brûleur de mondes',
      desc: 'Ce que leur nom promet.',
    },
    voidCrusaders: {
      name: 'Croisés du vide',
      one: 'Croisé du vide',
      desc: 'Taillés dans la matière noire.',
    },
    realityShifters: {
      name: 'Manipulateurs de réalité',
      one: 'Manipulateur de réalité',
      desc: 'La guerre comme acte métaphysique.',
    },
  },

  // Libellés des effets (mégastructures, décrets) : « <libellé> <±pourcentage> ».
  effect: {
    percent: '{sign}{n}\u00a0%', // espace insécable : « % » ne passe pas seul à la ligne
    productionMultiplier: 'Production',
    resourceProductionMultiplier: 'Production ({res})',
    clickMultiplier: 'Clic',
    fleetMultiplier: 'Puissance de flotte',
    fleetDurability: 'Structure des vaisseaux',
    shipCost: 'Coût des vaisseaux',
    fleetMaintenance: 'Maintenance',
    explorationIncome: 'Revenu des systèmes',
    lootMultiplier: 'Butin',
  },

  megastructure: {
    dysonSphere: {
      name: 'Sphère de Dyson',
      desc: 'Une coquille de capteurs autour de l’étoile : la production d’énergie s’envole.',
    },
    orbitalElevator: {
      name: 'Ascenseur orbital',
      desc: 'Un câble jusqu’à l’orbite : mettre une coque en position coûte bien moins cher.',
    },
    worldForge: {
      name: 'Forge-monde',
      desc: 'Une planète entière convertie en aciérie et en cristallerie.',
    },
    archivesNetwork: {
      name: 'Réseau des Archives',
      desc: 'Relie les Archives du Sénat entre elles : l’influence circule bien plus vite.',
    },
    flagshipYard: {
      name: 'Chantier amiral',
      desc: 'Des cales géantes qui épaississent la coque de chaque vaisseau : davantage de structure au combat.',
    },
    ringWorld: {
      name: 'Anneau-monde',
      desc: 'Un anneau habitable autour de l’étoile : les systèmes conquis rapportent beaucoup plus.',
    },
  },

  decree: {
    mobilization: {
      name: 'Mobilisation',
      desc: 'Toute la nation à l’effort de guerre : une flotte plus puissante, mais une économie au ralenti.',
    },
    austerity: {
      name: 'Austérité',
      desc: 'La flotte coûte moins cher à bâtir et à entretenir, mais elle est moins bien armée.',
    },
    warEconomy: {
      name: 'Économie de guerre',
      desc: 'Les usines tournent à plein régime ; les vaisseaux, eux, coûtent cher en entretien.',
    },
    martialLaw: {
      name: 'Loi martiale',
      desc: 'Des coques renforcées à tout prix — au détriment des colonies.',
    },
    plunderRights: {
      name: 'Droit de pillage',
      desc: 'Le butin des planètes s’envole, mais les équipages prennent des risques.',
    },
    stateScience: {
      name: 'Recherche d’État',
      desc: 'On finance la haute science au détriment de l’industrie de base.',
    },
    propaganda: {
      name: 'Propagande',
      desc: 'Le peuple acclame : chaque clic compte davantage, la flotte s’en ressent.',
    },
    freeTrade: {
      name: 'Libre-échange',
      desc: 'Les systèmes conquis prospèrent, mais on ne pille plus.',
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
    compositeArmor: {
      name: 'Blindage composite',
      desc: 'Augmente la structure (PV) de tous les vaisseaux au combat.',
    },
    orbitalLogistics: {
      name: 'Logistique orbitale',
      desc: 'Le butin des planètes conquises est plus abondant et la maintenance de la flotte allégée.',
    },
    spaceDiplomacy: {
      name: 'Diplomatie spatiale',
      desc: 'Rouvre les canaux du Sénat : débloque les décrets et la négociation avec les Sentinelles.',
    },
    megastructureEngineering: {
      name: 'Ingénierie des mégastructures',
      desc: 'Débloque les Chantiers : des ouvrages colossaux, à rebâtir à chaque run.',
    },
    galacticConstitution: {
      name: 'Constitution galactique',
      desc: 'Un emplacement de décret supplémentaire.',
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
    reinforcedHulls: {
      name: 'Coques renforcées',
      desc: '+10 % de PV des vaisseaux par niveau (cette run seulement).',
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
      'Assaut repoussé — des vaisseaux ont été perdus.',
    noFleetEngaged: 'Aucun vaisseau engagé.',
    cannotEndRun: "Il faut d'abord remplir l'objectif de la run.",
    runEnded: 'Run terminée ! +{points} ✨ et la faction monte de niveau.',
    cannotAscend: 'Il faut atteindre le niveau {level} avec ta faction pour ascendre.',
    ascended: 'Ascension ! Toutes les factions repartent à zéro — choisis ta récompense.',
    ascensionRewardChosen: '{name} — récompense d’Ascension obtenue (niveau {level}).',
    maintenanceLoss: 'Maintenance insuffisante : des vaisseaux ont été perdus.',
    unlocked: 'Nouveau : {name}',
    achievementUnlocked: 'Succès débloqué : {name}',
    storyUnlocked: 'Journal de bord : {title}',
    storyUnlockedMany: 'Journal de bord : {n} nouvelles entrées',
    systemLocked: 'Niveau {level} requis pour accéder à ce système.',
    levelUp: 'Niveau {level} atteint !',
    planetConquered: 'Planète conquise !',
    battleWon: 'Phase de combat remportée.',
    saveRecovered:
      'Sauvegarde illisible archivée (starshipClickerSave.bak). Nouvelle partie.',
    saveReset:
      'Le jeu a changé en profondeur (factions, exploration par nœuds). Ton ancienne sauvegarde est archivée, nouvelle partie !',
    eventGain: '{name} : {list}',
    megastructureBuilt: '{name} — niveau {level}.',
    decreeAdopted: 'Décret adopté : {name}.',
    decreeAbrogated: 'Décret abrogé : {name}.',
    decreeSlotsFull: 'Tous les emplacements de décret sont occupés — abrogez-en un.',
    planetNegotiated: 'Les Sentinelles se retirent : planète obtenue sans combat. Butin : {list}',
    choice: {
      sentinels: {
        ally: 'Les Sentinelles vous jurent fidélité : structure des vaisseaux +25 % pour cette run.',
        destroy: 'Le Bastion est à terre : butin +25 % pour cette run.',
      },
    },
  },
};
