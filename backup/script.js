// Starship Clicker Game - Version Complete

class StarshipClicker {
  constructor() {
    // Etat initial du jeu
    this.gameState = {
      resources: {
        energy: 0,
        metal: 0,
        crystals: 0,
        antimatter: 0,
        influence: 0,
        darkMatter: 0,
        quantumEnergy: 0,
        ascensionPoints: 0,
      },
      clickPower: 1,
      totalEnergyGenerated: 0,
      civilizationLevel: 1,
      explorationProgress: 0, // Generateurs automatiques
      generators: {
        solarPanel: { count: 0, cost: 10, production: 1, resource: "energy" },
        miningDrone: { count: 0, cost: 25, production: 1, resource: "metal" },
        crystalExtractor: {
          count: 0,
          cost: 50,
          production: 1,
          resource: "crystals",
          costResource: "metal",
        },
        fusionReactor: {
          count: 0,
          cost: 100,
          production: 10,
          resource: "energy",
          costResource: "crystals",
        },
        antimatterGenerator: {
          count: 0,
          cost: 500,
          production: 1,
          resource: "antimatter",
          costResource: "crystals",
        },
        quantumHarvester: {
          count: 0,
          cost: 1000,
          production: 5,
          resource: "antimatter",
          costResource: "energy",
        },
        stellarForge: {
          count: 0,
          cost: 2000,
          production: 50,
          resource: "metal",
          costResource: "antimatter",
        },
        dimensionalRift: {
          count: 0,
          cost: 5000,
          production: 25,
          resource: "crystals",
          costResource: "antimatter",
        },
        // Générateurs ultra-avancés
        darkMatterCollector: {
          count: 0,
          cost: 25000,
          production: 1,
          resource: "darkMatter",
          costResource: "antimatter",
        },
        quantumResonator: {
          count: 0,
          cost: 100000,
          production: 5,
          resource: "quantumEnergy",
          costResource: "darkMatter",
        },
        voidHarvester: {
          count: 0,
          cost: 500000,
          production: 100,
          resource: "energy",
          costResource: "quantumEnergy",
        },
        cosmicFurnace: {
          count: 0,
          cost: 1000000,
          production: 200,
          resource: "metal",
          costResource: "quantumEnergy",
        },
        realityEngine: {
          count: 0,
          cost: 5000000,
          production: 500,
          resource: "crystals",
          costResource: "quantumEnergy",
        },
      },

      // Ameliorations
      upgrades: {
        clickUpgrade: { level: 0, cost: 15, multiplier: 1.5 },
        autoClicker: { count: 0, cost: 200, multiplier: 2 },
        // Nouvelles améliorations permanentes
        prestigeMultiplier: { level: 0, cost: 1000, multiplier: 2.0 },
        quantumCore: { level: 0, cost: 50000, multiplier: 1.5 },
        darkMatterBooster: { level: 0, cost: 250000, multiplier: 3.0 },
        cosmicAscension: { level: 0, cost: 1000000, multiplier: 5.0 },
      }, // Flotte spatiale
      fleet: {
        fighters: {
          count: 0,
          cost: { energy: 150, metal: 75 },
          attack: 1,
          maintenance: 1,
        },
        cruisers: {
          count: 0,
          cost: { energy: 800, metal: 400, crystals: 50 },
          attack: 5,
          maintenance: 3,
        },
        dreadnoughts: {
          count: 0,
          cost: { energy: 3000, metal: 1500, crystals: 200, antimatter: 10 },
          attack: 25,
          maintenance: 10,
        },
        titans: {
          count: 0,
          cost: { energy: 10000, metal: 5000, crystals: 1000, antimatter: 50 },
          attack: 100,
          maintenance: 25,
        },
        motherships: {
          count: 0,
          cost: {
            energy: 50000,
            metal: 25000,
            crystals: 5000,
            antimatter: 200,
            influence: 10,
          },
          attack: 500,
          maintenance: 50,
        },
        // Vaisseaux légendaires
        worldBurners: {
          count: 0,
          cost: {
            energy: 250000,
            metal: 125000,
            crystals: 25000,
            antimatter: 1000,
            darkMatter: 5,
          },
          attack: 2500,
          maintenance: 100,
        },
        voidCrusaders: {
          count: 0,
          cost: {
            energy: 1000000,
            metal: 500000,
            crystals: 100000,
            antimatter: 5000,
            darkMatter: 25,
            quantumEnergy: 1,
          },
          attack: 10000,
          maintenance: 200,
        },
        realityShifters: {
          count: 0,
          cost: {
            energy: 5000000,
            metal: 2500000,
            crystals: 500000,
            antimatter: 25000,
            darkMatter: 100,
            quantumEnergy: 10,
          },
          attack: 50000,
          maintenance: 500,
        },
      },

      // Systemes conquis
      conqueredSystems: [],
      availableSystems: [], // Technologies
      technologies: {
        advancedPropulsion: {
          unlocked: false,
          cost: { crystals: 200, antimatter: 5 },
          effect: "Reduit le cout des vaisseaux de 20%",
        },
        quantumComputing: {
          unlocked: false,
          cost: { crystals: 500, antimatter: 15 },
          effect: "Augmente la production de tous les generateurs de 50%",
        },
        neuralNetworks: {
          unlocked: false,
          cost: { crystals: 1000, antimatter: 50 },
          effect: "Auto-ameliore les generateurs",
        },
        warpDrive: {
          unlocked: false,
          cost: { antimatter: 100, influence: 10 },
          effect: "Debloque l'exploration de nouveaux systemes",
        },
        energyEfficiency: {
          unlocked: false,
          cost: { energy: 50000, crystals: 300 },
          effect: "Reduit la maintenance de la flotte de 30%",
        },
        hyperSpace: {
          unlocked: false,
          cost: { antimatter: 200, influence: 25 },
          effect: "Double les recompenses d'exploration",
        },
        nanotechnology: {
          unlocked: false,
          cost: { crystals: 2000, antimatter: 150 },
          effect: "Les generateurs se reparent automatiquement",
        },
        artificialIntelligence: {
          unlocked: false,
          cost: { antimatter: 500, influence: 50 },
          effect: "Optimise automatiquement la production",
        },
        // Technologies ultra-avancées
        darkMatterPhysics: {
          unlocked: false,
          cost: { antimatter: 2500, darkMatter: 1 },
          effect: "Debloque la manipulation de la matiere noire",
        },
        quantumEntanglement: {
          unlocked: false,
          cost: { darkMatter: 10, quantumEnergy: 1 },
          effect: "Production instantanee pour tous les generateurs",
        },
        voidTechnology: {
          unlocked: false,
          cost: { darkMatter: 50, quantumEnergy: 5 },
          effect: "Acces aux technologies du vide cosmique",
        },
        realityManipulation: {
          unlocked: false,
          cost: { quantumEnergy: 25, ascensionPoints: 1 },
          effect: "Controle de la realite - bonus x10 a tout",
        },
        cosmicAscension: {
          unlocked: false,
          cost: { quantumEnergy: 100, ascensionPoints: 5 },
          effect: "Transcendance cosmique - prestige ameliore",
        },
      },

      // Système de prestige
      prestige: {
        totalAscensions: 0,
        permanentBonuses: {
          clickMultiplier: 1,
          productionMultiplier: 1,
          fleetPowerMultiplier: 1,
        },
        lifetimeResources: {
          energy: 0,
          metal: 0,
          crystals: 0,
          antimatter: 0,
          influence: 0,
        },
      },

      // Système d'événements aléatoires
      eventSystem: {
        lastEventTime: 0,
        eventCooldown: 60000, // 1 minute entre les événements
        activeEvent: null,
      },
    };

    // N'initialiser que quand le DOM est prêt
    console.log("🚀 StarshipClicker constructor called");
  }

  init() {
    this.bindEvents();
    this.generateSystems();
    this.updateDisplay();
    this.startGameLoop();
    this.loadGame();

    // Message de bienvenue
    setTimeout(() => {
      this.showNotification(
        "Bienvenue dans Starship Clicker ! Cliquez sur le vaisseau pour commencer !",
        "info"
      );
    }, 1000);
  }
  bindEvents() {
    console.log("🔗 Binding events...");

    // Clic sur le vaisseau mere
    const mothership = document.getElementById("mothership");
    if (mothership) {
      console.log("✅ Mothership element found, binding click event");
      mothership.addEventListener("click", (e) => {
        console.log("🚀 Mothership clicked!");
        this.clickMothership(e);
      });
    } else {
      console.error("❌ Mothership element NOT found!");
    }

    // Evenements des onglets
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const tabName = e.target.dataset.tab;
        this.showTab(tabName);
      });
    });

    // Evenements d'achat generateurs
    const generators = [
      { id: "solar-panel", type: "solarPanel" },
      { id: "mining-drone", type: "miningDrone" },
      { id: "crystal-extractor", type: "crystalExtractor" },
      { id: "fusion-reactor", type: "fusionReactor" },
      { id: "antimatter-generator", type: "antimatterGenerator" },
      { id: "quantum-harvester", type: "quantumHarvester" },
      { id: "stellar-forge", type: "stellarForge" },
      { id: "dimensional-rift", type: "dimensionalRift" },
      // Nouveaux générateurs ultra-avancés
      { id: "dark-matter-collector", type: "darkMatterCollector" },
      { id: "quantum-resonator", type: "quantumResonator" },
      { id: "void-harvester", type: "voidHarvester" },
      { id: "cosmic-furnace", type: "cosmicFurnace" },
      { id: "reality-engine", type: "realityEngine" },
    ];

    generators.forEach((gen) => {
      const element = document.getElementById(gen.id);
      if (element) {
        element.addEventListener("click", () => this.buyGenerator(gen.type));
      }
    });

    // Evenements d'achat ameliorations
    const clickUpgradeBtn = document.getElementById("click-upgrade");
    if (clickUpgradeBtn) {
      clickUpgradeBtn.addEventListener("click", () =>
        this.buyUpgrade("clickUpgrade")
      );
    }

    const autoClickerBtn = document.getElementById("auto-clicker");
    if (autoClickerBtn) {
      autoClickerBtn.addEventListener("click", () =>
        this.buyUpgrade("autoClicker")
      );
    }

    // Evenements d'achat vaisseaux
    const ships = [
      { id: "buy-fighter", type: "fighters" },
      { id: "buy-cruiser", type: "cruisers" },
      { id: "buy-dreadnought", type: "dreadnoughts" },
      { id: "buy-titan", type: "titans" },
      { id: "buy-mothership", type: "motherships" },
      // Nouveaux vaisseaux légendaires
      { id: "buy-worldburner", type: "worldBurners" },
      { id: "buy-voidcrusader", type: "voidCrusaders" },
      { id: "buy-realityshifter", type: "realityShifters" },
    ];

    ships.forEach((ship) => {
      const element = document.getElementById(ship.id);
      if (element) {
        element.addEventListener("click", () => this.buyShip(ship.type));
      }
    });

    // Evenements technologies
    document.querySelectorAll(".research-tech").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const techType = e.target.dataset.tech;
        this.researchTechnology(techType);
      });
    });
  }
  clickMothership(e) {
    console.log("⚡ clickMothership called");

    // Calculer la puissance de clic avec les bonus de prestige
    const clickPower = Math.floor(
      this.gameState.clickPower *
        this.gameState.prestige.permanentBonuses.clickMultiplier
    );

    console.log(`💪 Click power: ${clickPower}`);

    // Ajouter energie
    const oldEnergy = this.gameState.resources.energy;
    this.gameState.resources.energy += clickPower;
    this.gameState.totalEnergyGenerated += clickPower;

    console.log(`🔋 Energy: ${oldEnergy} → ${this.gameState.resources.energy}`);

    // Effet visuel
    this.createClickEffect(e);

    // Mettre a jour l'affichage
    this.updateDisplay();

    // Sauvegarder
    this.saveGame();
  }
  createClickEffect(e) {
    const effect = document.getElementById("click-effect");
    if (effect) {
      const clickPower = Math.floor(
        this.gameState.clickPower *
          this.gameState.prestige.permanentBonuses.clickMultiplier
      );
      effect.textContent = "+" + clickPower;
      effect.style.opacity = "1";
      effect.style.transform = "translateY(-50px)";

      setTimeout(() => {
        effect.style.opacity = "0";
        effect.style.transform = "translateY(0)";
      }, 800);
    }
  }

  buyGenerator(generatorType) {
    const generator = this.gameState.generators[generatorType];
    if (!generator) {
      console.log("Générateur non trouvé:", generatorType);
      return;
    }

    const costResource = generator.costResource || "energy";
    const cost = generator.cost;

    console.log(
      `Achat ${generatorType}: Besoin de ${cost} ${costResource}, Disponible: ${this.gameState.resources[costResource]}`
    );
    if (this.gameState.resources[costResource] >= cost) {
      this.gameState.resources[costResource] -= cost;
      generator.count++;
      generator.cost = Math.floor(generator.cost * 1.15);

      this.showNotification("Generateur achete avec succes !", "success");
      this.updateDisplay();
      this.saveGame();
    } else {
      this.showNotification(
        `Ressources insuffisantes ! Il faut ${cost} ${this.getResourceSymbol(
          costResource
        )}`,
        "error"
      );
    }
  }
  buyUpgrade(upgradeType) {
    const upgrade = this.gameState.upgrades[upgradeType];
    if (!upgrade) return;

    // Gestion des améliorations de prestige
    if (
      [
        "prestigeMultiplier",
        "quantumCore",
        "darkMatterBooster",
        "cosmicAscension",
      ].includes(upgradeType)
    ) {
      this.buyPrestigeUpgrade(upgradeType);
      return;
    }

    if (this.gameState.resources.energy >= upgrade.cost) {
      this.gameState.resources.energy -= upgrade.cost;
      if (upgradeType === "clickUpgrade") {
        upgrade.level++;
        this.gameState.clickPower = Math.ceil(
          this.gameState.clickPower * upgrade.multiplier
        );
        upgrade.cost = Math.floor(upgrade.cost * 1.5);
      } else if (upgradeType === "autoClicker") {
        upgrade.count++;
        upgrade.cost = Math.floor(upgrade.cost * 1.8);
      }

      this.showNotification("Amelioration achetee !", "success");
      this.updateDisplay();
      this.saveGame();
    } else {
      this.showNotification("Energie insuffisante !", "error");
    }
  }

  buyShip(shipType) {
    const ship = this.gameState.fleet[shipType];
    if (!ship) return;
    let canAfford = true;
    const missingResources = [];

    // Calculer le coût avec réduction technologique
    const shipCosts = {};
    for (const [resource, baseCost] of Object.entries(ship.cost)) {
      let actualCost = baseCost;
      // Appliquer la réduction de 20% si la technologie est débloquée
      if (this.gameState.technologies.advancedPropulsion.unlocked) {
        actualCost = Math.floor(baseCost * 0.8);
      }
      shipCosts[resource] = actualCost;
    }

    for (const [resource, cost] of Object.entries(shipCosts)) {
      if (this.gameState.resources[resource] < cost) {
        canAfford = false;
        missingResources.push(
          `${
            cost - this.gameState.resources[resource]
          } ${this.getResourceSymbol(resource)}`
        );
      }
    }

    if (canAfford) {
      for (const [resource, cost] of Object.entries(shipCosts)) {
        this.gameState.resources[resource] -= cost;
      }
      ship.count++;

      // Augmenter le cout
      for (const resource in ship.cost) {
        ship.cost[resource] = Math.floor(ship.cost[resource] * 1.2);
      }

      this.showNotification("Vaisseau construit avec succes !", "success");
      this.updateDisplay();
      this.saveGame();
    } else {
      this.showNotification(
        "Ressources manquantes: " + missingResources.join(", "),
        "error"
      );
    }
  }

  researchTechnology(techType) {
    const tech = this.gameState.technologies[techType];
    if (!tech || tech.unlocked) return;

    let canAfford = true;
    const missingResources = [];

    for (const [resource, cost] of Object.entries(tech.cost)) {
      if (this.gameState.resources[resource] < cost) {
        canAfford = false;
        missingResources.push(
          `${
            cost - this.gameState.resources[resource]
          } ${this.getResourceSymbol(resource)}`
        );
      }
    }

    if (canAfford) {
      for (const [resource, cost] of Object.entries(tech.cost)) {
        this.gameState.resources[resource] -= cost;
      }
      tech.unlocked = true; // Effets spéciaux des technologies
      if (techType === "warpDrive") {
        this.generateNewSystems();
      } else if (techType === "hyperSpace") {
        this.showNotification(
          "Production des systèmes conquis doublée !",
          "success"
        );
      } else if (techType === "artificialIntelligence") {
        this.showNotification(
          "L'IA optimise maintenant votre production !",
          "success"
        );
      } else if (techType === "nanotechnology") {
        this.showNotification(
          "Nanotechnologie active - générateurs améliorés !",
          "success"
        );
      }

      this.showNotification("Technologie recherchee avec succes !", "success");
      this.updateDisplay();
      this.saveGame();
    } else {
      this.showNotification(
        "Ressources manquantes: " + missingResources.join(", "),
        "error"
      );
    }
  }
  generateSystems() {
    const systemNames = [
      "Alpha Centauri",
      "Vega",
      "Arcturus",
      "Sirius",
      "Proxima",
      "Betelgeuse",
      "Rigel",
      "Altair",
      "Aldebaran",
      "Spica",
      "Polaris",
      "Canopus",
      "Capella",
      "Deneb",
      "Procyon",
    ];

    const systemTypes = [
      {
        name: "Système Minier",
        metalBonus: 2.0,
        energyBonus: 0.8,
        description: "Riche en métaux mais faible en énergie",
      },
      {
        name: "Système Énergétique",
        metalBonus: 0.7,
        energyBonus: 2.5,
        description: "Grande source d'énergie stellaire",
      },
      {
        name: "Système Cristallin",
        metalBonus: 1.0,
        energyBonus: 1.0,
        crystalBonus: 3.0,
        description: "Formations cristallines uniques",
      },
      {
        name: "Système Équilibré",
        metalBonus: 1.3,
        energyBonus: 1.3,
        crystalBonus: 1.2,
        description: "Ressources diversifiées",
      },
      {
        name: "Système Hostile",
        metalBonus: 1.8,
        energyBonus: 1.8,
        crystalBonus: 1.8,
        defenseBonus: 1.5,
        description: "Dangereux mais très rémunérateur",
      },
    ];

    // Vider les systèmes existants pour éviter les doublons
    this.gameState.availableSystems = [];

    for (let i = 0; i < 8; i++) {
      // Augmenté de 5 à 8 systèmes
      const systemType = systemTypes[i % systemTypes.length];
      const baseDefense = (i + 1) * 10;
      const defense = Math.floor(
        baseDefense * (systemType.defenseBonus || 1.0)
      );

      const baseEnergy = (i + 1) * 50;
      const baseMetal = (i + 1) * 25;
      const baseCrystals = (i + 1) * 10;

      this.gameState.availableSystems.push({
        name: `${systemNames[i] || `Système ${i + 1}`}`,
        type: systemType.name,
        description: systemType.description,
        defenseRating: defense,
        rewards: {
          energy: Math.floor(baseEnergy * (systemType.energyBonus || 1.0)),
          metal: Math.floor(baseMetal * (systemType.metalBonus || 1.0)),
          crystals: Math.floor(baseCrystals * (systemType.crystalBonus || 1.0)),
          influence: Math.floor((i + 1) * 1.2), // Légèrement augmenté
        },
        difficulty: i < 3 ? "Facile" : i < 6 ? "Moyen" : "Difficile",
      });
    }

    console.log("Systèmes générés:", this.gameState.availableSystems);
  }
  generateNewSystems() {
    const advancedSystemNames = [
      "Andromeda Nexus",
      "Kepler-442 Colony",
      "Gliese 667C Outpost",
      "HD 40307 Station",
      "Tau Ceti Haven",
      "Wolf 1061 Fortress",
      "TRAPPIST-1 Empire",
      "Proxima B Gateway",
      "K2-18 Sanctuary",
      "TOI-715 Citadel",
      "Omega Centauri",
      "Sagittarius A*",
      "Nebula X-7",
      "Quantum Realm",
      "Dark Matter Core",
    ];

    const advancedSystemTypes = [
      {
        name: "Complexe Antimatter",
        antimatterBonus: 5.0,
        defenseBonus: 2.0,
        description: "Installation de recherche en antimatière",
      },
      {
        name: "Station Quantique",
        energyBonus: 3.0,
        crystalBonus: 2.5,
        defenseBonus: 1.8,
        description: "Technologie quantique avancée",
      },
      {
        name: "Forteresse Galactique",
        metalBonus: 4.0,
        influenceBonus: 3.0,
        defenseBonus: 2.5,
        description: "Bastion militaire stratégique",
      },
      {
        name: "Nœud Commercial",
        energyBonus: 2.0,
        metalBonus: 2.0,
        crystalBonus: 2.0,
        influenceBonus: 2.5,
        defenseBonus: 1.2,
        description: "Centre économique majeur",
      },
      {
        name: "Laboratoire Cosmique",
        crystalBonus: 4.0,
        antimatterBonus: 3.0,
        defenseBonus: 1.5,
        description: "Recherche scientifique avancée",
      },
    ];

    // Ajouter 6 nouveaux systèmes plus difficiles (augmenté de 5 à 6)
    const baseIndex =
      this.gameState.availableSystems.length +
      this.gameState.conqueredSystems.length;

    for (let i = 0; i < 6; i++) {
      const systemIndex = baseIndex + i;
      const nameIndex = systemIndex % advancedSystemNames.length;
      const systemType = advancedSystemTypes[i % advancedSystemTypes.length];

      const baseDefense = (systemIndex + 1) * 15;
      const defense = Math.floor(
        baseDefense * (systemType.defenseBonus || 1.0)
      );

      const baseEnergy = (systemIndex + 1) * 75;
      const baseMetal = (systemIndex + 1) * 40;
      const baseCrystals = (systemIndex + 1) * 20;
      const baseAntimatter = Math.floor((systemIndex + 1) / 2);
      const baseInfluence = Math.floor((systemIndex + 1) / 2);

      this.gameState.availableSystems.push({
        name:
          advancedSystemNames[nameIndex] ||
          `Système Distant ${systemIndex + 1}`,
        type: systemType.name,
        description: systemType.description,
        defenseRating: defense,
        rewards: {
          energy: Math.floor(baseEnergy * (systemType.energyBonus || 1.0)),
          metal: Math.floor(baseMetal * (systemType.metalBonus || 1.0)),
          crystals: Math.floor(baseCrystals * (systemType.crystalBonus || 1.0)),
          antimatter: Math.floor(
            baseAntimatter * (systemType.antimatterBonus || 1.0)
          ),
          influence: Math.floor(
            baseInfluence * (systemType.influenceBonus || 1.0)
          ),
        },
        difficulty: "Extrême",
        isAdvanced: true,
      });
    }

    this.showNotification(
      "Nouveaux systèmes découverts grâce au moteur de distorsion !",
      "success"
    );
  }

  exploreSystem(systemIndex) {
    const system = this.gameState.availableSystems[systemIndex];
    if (!system) return;

    const fleetPower = this.calculateFleetPower();

    if (fleetPower >= system.defenseRating) {
      // Victoire
      this.gameState.conqueredSystems.push(system);
      this.gameState.availableSystems.splice(systemIndex, 1);

      // Ajouter recompenses
      for (const [resource, amount] of Object.entries(system.rewards)) {
        this.gameState.resources[resource] += amount;
      }

      this.showNotification(`Systeme ${system.name} conquis !`, "success");
      this.updateDisplay();
      this.saveGame();
    } else {
      this.showNotification(
        `Flotte trop faible ! Puissance requise: ${system.defenseRating}`,
        "error"
      );
    }
  }
  calculateFleetPower() {
    let totalPower = 0;
    for (const ship of Object.values(this.gameState.fleet)) {
      totalPower += ship.count * ship.attack;
    }

    // Appliquer le bonus de prestige
    totalPower *= this.gameState.prestige.permanentBonuses.fleetPowerMultiplier;

    return Math.floor(totalPower);
  }

  calculateEnergyPerSecond() {
    let total = 0;

    // Production des generateurs
    Object.values(this.gameState.generators).forEach((gen) => {
      if (gen.resource === "energy") {
        total += gen.count * gen.production;
      }
    });

    // Auto-clickers
    total +=
      this.gameState.upgrades.autoClicker.count * this.gameState.clickPower;

    // Bonus technologie
    if (this.gameState.technologies.quantumComputing.unlocked) {
      total *= 1.5;
    }

    // Cout maintenance flotte
    let maintenance = 0;
    Object.values(this.gameState.fleet).forEach((ship) => {
      maintenance += ship.count * ship.maintenance;
    });

    return Math.max(0, total - maintenance);
  }
  startGameLoop() {
    setInterval(() => {
      // Production automatique
      Object.values(this.gameState.generators).forEach((gen) => {
        if (gen.count > 0) {
          let production = gen.count * gen.production;

          // Bonus technologies
          if (this.gameState.technologies.quantumComputing.unlocked) {
            production *= 1.5;
          }

          if (this.gameState.technologies.nanotechnology.unlocked) {
            production *= 1.3; // Bonus nanotechnologie
          }
          if (this.gameState.technologies.artificialIntelligence.unlocked) {
            production *= 1.2; // Bonus IA
          }

          // Bonus des nouvelles technologies ultra-avancées
          if (this.gameState.technologies.darkMatterPhysics.unlocked) {
            production *= 1.5; // Bonus matière noire
          }

          if (this.gameState.technologies.quantumEntanglement.unlocked) {
            production *= 2.0; // Production instantanée
          }

          if (this.gameState.technologies.voidTechnology.unlocked) {
            production *= 3.0; // Technologies du vide
          }

          if (this.gameState.technologies.realityManipulation.unlocked) {
            production *= 10.0; // Manipulation de la réalité
          }

          if (this.gameState.technologies.cosmicAscension.unlocked) {
            production *= 50.0; // Ascension cosmique
          }

          // Appliquer les bonus de prestige
          production *=
            this.gameState.prestige.permanentBonuses.productionMultiplier;

          this.gameState.resources[gen.resource] += production;

          if (gen.resource === "energy") {
            this.gameState.totalEnergyGenerated += production;
          }
        }
      });

      // Auto-clickers
      if (this.gameState.upgrades.autoClicker.count > 0) {
        const autoProduction =
          this.gameState.upgrades.autoClicker.count * this.gameState.clickPower;
        this.gameState.resources.energy += autoProduction;
        this.gameState.totalEnergyGenerated += autoProduction;
      }

      // Auto-amélioration des générateurs (Neural Networks)
      if (this.gameState.technologies.neuralNetworks.unlocked) {
        this.autoUpgradeGenerators();
      }

      // Maintenance flotte avec bonus efficacité énergétique
      let totalMaintenance = 0;
      Object.values(this.gameState.fleet).forEach((ship) => {
        totalMaintenance += ship.count * ship.maintenance;
      });

      // Réduction de maintenance avec la technologie
      if (this.gameState.technologies.energyEfficiency.unlocked) {
        totalMaintenance *= 0.7; // 30% de réduction
      }

      if (this.gameState.resources.energy >= totalMaintenance) {
        this.gameState.resources.energy -= totalMaintenance;
      } else {
        // Perdre des vaisseaux si pas assez d'energie
        this.sufferMaintenanceLosses();
      }

      // Bonus systemes conquis avec multiplicateur hyperspace
      let explorationMultiplier = 1;
      if (this.gameState.technologies.hyperSpace.unlocked) {
        explorationMultiplier = 2;
      }

      this.gameState.conqueredSystems.forEach((system) => {
        for (const [resource, amount] of Object.entries(system.rewards)) {
          this.gameState.resources[resource] += Math.floor(
            amount * 0.1 * explorationMultiplier
          );
        }
      }); // Calcul du niveau de civilisation basé sur les ressources totales
      const totalResources = Object.values(this.gameState.resources).reduce(
        (sum, val) => sum + val,
        0
      );
      this.gameState.civilizationLevel = Math.max(
        1,
        Math.log10(totalResources + 1)
      );

      // Vérifier les événements aléatoires
      this.checkRandomEvents();

      this.updateDisplay();
      this.saveGame();
    }, 1000);
  }

  sufferMaintenanceLosses() {
    // Perdre 5% de la flotte
    Object.values(this.gameState.fleet).forEach((ship) => {
      if (ship.count > 0) {
        const losses = Math.ceil(ship.count * 0.05);
        ship.count = Math.max(0, ship.count - losses);
      }
    });

    this.showNotification(
      "Maintenance insuffisante ! Perte de vaisseaux !",
      "error"
    );
  }
  updateDisplay() {
    // Mettre a jour les ressources
    document.getElementById("energy-count").textContent = this.formatNumber(
      this.gameState.resources.energy
    );
    document.getElementById("metal-count").textContent = this.formatNumber(
      this.gameState.resources.metal
    );
    document.getElementById("crystal-count").textContent = this.formatNumber(
      this.gameState.resources.crystals
    );

    const antimatterEl = document.getElementById("antimatter-count");
    if (antimatterEl)
      antimatterEl.textContent = this.formatNumber(
        this.gameState.resources.antimatter
      );

    const influenceEl = document.getElementById("influence-count");
    if (influenceEl)
      influenceEl.textContent = this.formatNumber(
        this.gameState.resources.influence
      );

    const darkMatterEl = document.getElementById("darkMatter-count");
    if (darkMatterEl)
      darkMatterEl.textContent = this.formatNumber(
        this.gameState.resources.darkMatter
      );

    const quantumEnergyEl = document.getElementById("quantumEnergy-count");
    if (quantumEnergyEl)
      quantumEnergyEl.textContent = this.formatNumber(
        this.gameState.resources.quantumEnergy
      );

    const ascensionPointsEl = document.getElementById("ascensionPoints-count");
    if (ascensionPointsEl)
      ascensionPointsEl.textContent = this.formatNumber(
        this.gameState.resources.ascensionPoints
      );

    // Mettre a jour les stats
    document.getElementById("energy-per-click").textContent =
      this.gameState.clickPower;
    document.getElementById("total-energy").textContent = this.formatNumber(
      this.gameState.totalEnergyGenerated
    );
    document.getElementById("energy-per-second").textContent =
      this.formatNumber(this.calculateEnergyPerSecond());

    const fleetPowerEl = document.getElementById("fleet-power");
    if (fleetPowerEl) fleetPowerEl.textContent = this.calculateFleetPower();

    const fleetPowerFooterEl = document.getElementById("fleet-power-footer");
    if (fleetPowerFooterEl)
      fleetPowerFooterEl.textContent = this.calculateFleetPower();

    const conqueredEl = document.getElementById("conquered-systems");
    if (conqueredEl)
      conqueredEl.textContent = this.gameState.conqueredSystems.length;

    const conqueredFooterEl = document.getElementById(
      "conquered-systems-footer"
    );
    if (conqueredFooterEl)
      conqueredFooterEl.textContent = this.gameState.conqueredSystems.length;

    const civLevelEl = document.getElementById("civilization-level");
    if (civLevelEl)
      civLevelEl.textContent = this.gameState.civilizationLevel.toFixed(1);

    // Mettre a jour l'affichage de la boutique
    this.updateShopDisplay();
    this.updateFleetDisplay();
    this.updateExplorationDisplay();
    this.updateTechnologyDisplay();
  }
  updateShopDisplay() {
    // Generateurs
    Object.entries(this.gameState.generators).forEach(([key, generator]) => {
      const elementId = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      const element = document.getElementById(elementId);
      if (element) {
        const costResource = generator.costResource || "energy";
        const costSymbol = this.getResourceSymbol(costResource);

        // Mise à jour sécurisée avec vérifications
        const ownedEl = element.querySelector(".owned");
        const costEl = element.querySelector(".cost");

        if (ownedEl) {
          ownedEl.textContent = generator.count;
        }

        if (costEl) {
          costEl.textContent = this.formatNumber(generator.cost);
        }

        // Vérifier si on peut se permettre l'achat
        const canAfford =
          this.gameState.resources[costResource] >= generator.cost;
        element.classList.toggle("affordable", canAfford);
        element.classList.toggle("unaffordable", !canAfford);

        // Mettre à jour le bouton si présent
        const button = element.querySelector("button, .buy-btn");
        if (button) {
          button.disabled = !canAfford;
        }
      }
    }); // Ameliorations
    Object.entries(this.gameState.upgrades).forEach(([key, upgrade]) => {
      const element = document.getElementById(
        key.replace(/([A-Z])/g, "-$1").toLowerCase()
      );
      if (element) {
        // Mettre à jour les textes
        const levelEl = element.querySelector(".level");
        const ownedEl = element.querySelector(".owned");
        const costEl = element.querySelector(".cost");

        if (key === "clickUpgrade" && levelEl) {
          levelEl.textContent = upgrade.level;
        } else if (ownedEl) {
          ownedEl.textContent = upgrade.count;
        }

        if (costEl) {
          costEl.textContent = this.formatNumber(upgrade.cost);
        }

        // Vérifier si on peut se permettre l'achat
        const canAfford = this.gameState.resources.energy >= upgrade.cost;
        element.classList.toggle("affordable", canAfford);
        element.classList.toggle("unaffordable", !canAfford);

        // Mettre à jour le bouton si présent
        const button = element.querySelector("button, .buy-btn");
        if (button) {
          button.disabled = !canAfford;
        }
      }
    });
  }
  updateFleetDisplay() {
    Object.entries(this.gameState.fleet).forEach(([shipType, ship]) => {
      const element = document.getElementById(`fleet-${shipType}`);
      if (element) {
        // Mettre à jour le nombre de vaisseaux et la maintenance
        const shipCountEl = element.querySelector(".ship-count");
        const maintenanceEl = element.querySelector(".maintenance-cost");

        if (shipCountEl) shipCountEl.textContent = ship.count;
        if (maintenanceEl)
          maintenanceEl.textContent = ship.count * ship.maintenance;

        // Mettre a jour les couts de construction
        Object.entries(ship.cost).forEach(([resource, currentCost]) => {
          const costEl = element.querySelector(`[data-resource="${resource}"]`);
          if (costEl) {
            // Calculer le coût avec réduction technologique si applicable
            let displayCost = currentCost;
            if (this.gameState.technologies.advancedPropulsion.unlocked) {
              displayCost = Math.floor(currentCost * 0.8);
            }

            costEl.textContent = displayCost;
            const canAfford = this.gameState.resources[resource] >= displayCost;
            costEl.classList.toggle("affordable", canAfford);
            costEl.classList.toggle("unaffordable", !canAfford);
          }
        });
      }
    });

    // Mettre a jour les stats de flotte
    const fleetPowerDisplay = document.getElementById("fleet-power-display");
    if (fleetPowerDisplay)
      fleetPowerDisplay.textContent = this.calculateFleetPower();

    const maintenanceEl = document.getElementById("fleet-maintenance");
    if (maintenanceEl) {
      let totalMaintenance = 0;
      Object.values(this.gameState.fleet).forEach((ship) => {
        totalMaintenance += ship.count * ship.maintenance;
      });
      maintenanceEl.textContent = totalMaintenance;
    }
  }
  updateExplorationDisplay() {
    const systemsContainer = document.getElementById("exploration-systems");
    if (systemsContainer) {
      systemsContainer.innerHTML = "";

      this.gameState.availableSystems.forEach((system, index) => {
        // Validation et correction des systèmes corrompus
        if (!system.defenseRating || typeof system.defenseRating !== "number") {
          console.log("Système corrompu détecté, correction:", system);
          system.defenseRating = (index + 1) * 10; // Valeur par défaut
        }
        if (!system.rewards) {
          system.rewards = {
            energy: (index + 1) * 50,
            metal: (index + 1) * 25,
            crystals: (index + 1) * 10,
            influence: index + 1,
          };
        }
        const systemDiv = document.createElement("div");
        systemDiv.className = `system-item ${
          system.isAdvanced ? "advanced-system" : ""
        }`;
        systemDiv.innerHTML = `
          <h4>${system.name}</h4>
          ${system.type ? `<p class="system-type">${system.type}</p>` : ""}
          ${
            system.description
              ? `<p class="system-description">${system.description}</p>`
              : ""
          }
          <p class="defense-rating">Défense: ${system.defenseRating} ${
          system.difficulty ? `(${system.difficulty})` : ""
        }</p>
          <p>Récompenses:</p>
          <ul>
            <li>${system.rewards.energy} ⚡ Énergie</li>
            <li>${system.rewards.metal} 🛠️ Métal</li>
            <li>${system.rewards.crystals} 💎 Cristaux</li>
            ${
              system.rewards.antimatter
                ? `<li>${system.rewards.antimatter} ⚛️ Antimatière</li>`
                : ""
            }
            <li>${system.rewards.influence} 👑 Influence</li>
          </ul>
          <button class="explore-btn" data-system-index="${index}">Explorer</button>
        `;

        const canExplore = this.calculateFleetPower() >= system.defenseRating;
        systemDiv.classList.toggle("explorable", canExplore);
        systemDiv.classList.toggle("unexplorable", !canExplore);

        // Ajouter l'event listener directement
        const exploreBtn = systemDiv.querySelector(".explore-btn");
        exploreBtn.addEventListener("click", () => this.exploreSystem(index));

        systemsContainer.appendChild(systemDiv);
      });
    }

    const conqueredContainer = document.getElementById(
      "conquered-systems-list"
    );
    if (conqueredContainer) {
      conqueredContainer.innerHTML = "";

      this.gameState.conqueredSystems.forEach((system) => {
        const systemDiv = document.createElement("div");
        systemDiv.className = "conquered-system";
        systemDiv.innerHTML = `
          <h4>${system.name}</h4>
          <p>Production par seconde:</p>
          <ul>
            <li>+${Math.floor(system.rewards.energy * 0.1)} ⚡ Energie</li>
            <li>+${Math.floor(system.rewards.metal * 0.1)} 🛠️ Metal</li>
            <li>+${Math.floor(system.rewards.crystals * 0.1)} 💎 Cristaux</li>
            ${
              system.rewards.antimatter
                ? `<li>+${Math.floor(
                    system.rewards.antimatter * 0.1
                  )} ⚛️ Antimatière</li>`
                : ""
            }
            <li>+${Math.floor(system.rewards.influence * 0.1)} 👑 Influence</li>
          </ul>
        `;
        conqueredContainer.appendChild(systemDiv);
      });
    }
  }

  updateTechnologyDisplay() {
    Object.entries(this.gameState.technologies).forEach(([techType, tech]) => {
      const element = document.getElementById(
        `tech-${techType.replace(/([A-Z])/g, "-$1").toLowerCase()}`
      );
      if (element) {
        const button = element.querySelector(".research-tech");
        if (tech.unlocked) {
          button.textContent = "Recherchée";
          button.disabled = true;
          element.classList.add("researched");
        } else {
          let canAfford = true;
          for (const [resource, cost] of Object.entries(tech.cost)) {
            if (this.gameState.resources[resource] < cost) {
              canAfford = false;
              break;
            }
          }

          button.disabled = !canAfford;
          element.classList.toggle("affordable", canAfford);
          element.classList.toggle("unaffordable", !canAfford);
        }
      }
    });
  }

  // Système d'événements aléatoires
  checkRandomEvents() {
    const currentTime = Date.now();
    if (
      currentTime - this.gameState.eventSystem.lastEventTime >
      this.gameState.eventSystem.eventCooldown
    ) {
      const eventChance = Math.random();
      if (eventChance < 0.3) {
        // 30% de chance d'événement
        this.triggerRandomEvent();
        this.gameState.eventSystem.lastEventTime = currentTime;
      }
    }
  }

  triggerRandomEvent() {
    const events = [
      {
        name: "Tempête Solaire",
        description: "Une tempête solaire boost votre production d'énergie !",
        effect: () => {
          const energyBonus = this.gameState.resources.energy * 0.5;
          this.gameState.resources.energy += energyBonus;
          this.showNotification(
            `Tempête solaire ! +${this.formatNumber(energyBonus)} ⚡`,
            "success"
          );
        },
      },
      {
        name: "Découverte Archéologique",
        description: "Vos explorateurs découvrent d'anciens cristaux !",
        effect: () => {
          const crystalBonus = Math.floor(
            this.gameState.civilizationLevel * 100
          );
          this.gameState.resources.crystals += crystalBonus;
          this.showNotification(
            `Découverte archéologique ! +${crystalBonus} 💎`,
            "success"
          );
        },
      },
      {
        name: "Anomalie Quantique",
        description: "Une anomalie spatiale vous octroie de l'antimatière !",
        effect: () => {
          const antimatterBonus = Math.floor(
            this.gameState.civilizationLevel * 10
          );
          this.gameState.resources.antimatter += antimatterBonus;
          this.showNotification(
            `Anomalie quantique ! +${antimatterBonus} ⚛️`,
            "success"
          );
        },
      },
      {
        name: "Rencontre Diplomatique",
        description: "Une civilisation alien vous offre de l'influence !",
        effect: () => {
          const influenceBonus = Math.floor(
            this.gameState.civilizationLevel * 5
          );
          this.gameState.resources.influence += influenceBonus;
          this.showNotification(
            `Contact alien ! +${influenceBonus} 👑`,
            "success"
          );
        },
      },
      {
        name: "Vortex de Matière Noire",
        description: "Un vortex cosmique vous apporte de la matière noire !",
        effect: () => {
          if (this.gameState.technologies.darkMatterPhysics.unlocked) {
            const darkMatterBonus = Math.floor(
              this.gameState.civilizationLevel
            );
            this.gameState.resources.darkMatter += darkMatterBonus;
            this.showNotification(
              `Vortex cosmique ! +${darkMatterBonus} 🌑`,
              "success"
            );
          }
        },
      },
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    randomEvent.effect();
  }

  // Système de prestige
  canAscend() {
    return this.gameState.resources.quantumEnergy >= 1000;
  }

  ascend() {
    if (!this.canAscend()) {
      this.showNotification(
        "Quantité d'énergie quantique insuffisante pour l'ascension !",
        "error"
      );
      return;
    }

    const ascensionPoints = Math.floor(
      this.gameState.resources.quantumEnergy / 1000
    );

    // Calculer les bonus permanents
    this.gameState.prestige.totalAscensions++;
    this.gameState.resources.ascensionPoints += ascensionPoints;

    // Bonus basés sur les ascensions
    this.gameState.prestige.permanentBonuses.clickMultiplier =
      1 + this.gameState.prestige.totalAscensions * 0.1;
    this.gameState.prestige.permanentBonuses.productionMultiplier =
      1 + this.gameState.prestige.totalAscensions * 0.2;
    this.gameState.prestige.permanentBonuses.fleetPowerMultiplier =
      1 + this.gameState.prestige.totalAscensions * 0.15;

    this.showNotification(
      `Ascension réussie ! +${ascensionPoints} points d'ascension`,
      "success"
    );

    // Reset partiel (garder certaines technologies et bonus)
    this.prestigeReset();
  }

  prestigeReset() {
    // Sauvegarder les éléments importants
    const savedTech = { ...this.gameState.technologies };
    const savedPrestige = { ...this.gameState.prestige };
    const savedAscensionPoints = this.gameState.resources.ascensionPoints;

    // Reset des ressources (garder un petit bonus)
    this.gameState.resources = {
      energy: Math.floor(this.gameState.prestige.totalAscensions * 100),
      metal: Math.floor(this.gameState.prestige.totalAscensions * 50),
      crystals: Math.floor(this.gameState.prestige.totalAscensions * 25),
      antimatter: Math.floor(this.gameState.prestige.totalAscensions * 5),
      influence: Math.floor(this.gameState.prestige.totalAscensions * 2),
      darkMatter: 0,
      quantumEnergy: 0,
      ascensionPoints: savedAscensionPoints,
    };

    // Reset des générateurs avec bonus
    Object.values(this.gameState.generators).forEach((gen) => {
      gen.count = 0;
      gen.cost = Math.floor(gen.cost * 0.9); // 10% de réduction des coûts
    });

    // Reset de la flotte
    Object.values(this.gameState.fleet).forEach((ship) => {
      ship.count = 0;
    });

    // Restaurer technologies et prestige
    this.gameState.technologies = savedTech;
    this.gameState.prestige = savedPrestige;

    // Reset des systèmes
    this.gameState.conqueredSystems = [];
    this.generateSystems();

    this.updateDisplay();
    this.saveGame();
  }

  // Nouvelles améliorations ultra-puissantes
  buyPrestigeUpgrade(upgradeType) {
    const upgrade = this.gameState.upgrades[upgradeType];
    if (!upgrade) return;

    let cost = upgrade.cost;
    let costResource = "ascensionPoints";

    // Coûts spéciaux pour certaines améliorations
    if (upgradeType === "quantumCore") costResource = "quantumEnergy";
    if (upgradeType === "darkMatterBooster") costResource = "darkMatter";
    if (upgradeType === "cosmicAscension") costResource = "quantumEnergy";

    if (this.gameState.resources[costResource] >= cost) {
      this.gameState.resources[costResource] -= cost;
      upgrade.level++;
      upgrade.cost = Math.floor(upgrade.cost * 2.5);

      // Effets spéciaux selon l'amélioration
      if (upgradeType === "prestigeMultiplier") {
        this.gameState.clickPower *= upgrade.multiplier;
      } else if (upgradeType === "quantumCore") {
        // Bonus de production quantique
        Object.values(this.gameState.generators).forEach((gen) => {
          if (gen.resource === "quantumEnergy") {
            gen.production *= upgrade.multiplier;
          }
        });
      }

      this.showNotification(
        `Amélioration cosmique achetée ! Niveau ${upgrade.level}`,
        "success"
      );
      this.updateDisplay();
      this.saveGame();
    } else {
      this.showNotification(`${costResource} insuffisant(e) !`, "error");
    }
  }

  // Mise à jour des symboles pour les nouvelles ressources
  getResourceSymbol(resource) {
    const symbols = {
      energy: "⚡",
      metal: "🛠️",
      crystals: "💎",
      antimatter: "⚛️",
      influence: "👑",
      darkMatter: "🌑",
      quantumEnergy: "🔮",
      ascensionPoints: "✨",
    };
    return symbols[resource] || "";
  }

  saveGame() {
    localStorage.setItem("starshipClickerSave", JSON.stringify(this.gameState));
  }
  loadGame() {
    const savedGame = localStorage.getItem("starshipClickerSave");
    if (savedGame) {
      try {
        const loadedState = JSON.parse(savedGame);

        // Fusionner de manière plus profonde pour éviter les erreurs
        this.gameState = this.deepMerge(this.gameState, loadedState);

        // Vérification et correction des systèmes après chargement
        if (
          !this.gameState.availableSystems ||
          this.gameState.availableSystems.length === 0
        ) {
          console.log("Aucun système disponible trouvé, régénération...");
          this.generateSystems();
        } else {
          // Vérifier que tous les systèmes ont une défense valide
          let hasCorruptedSystems = false;
          this.gameState.availableSystems.forEach((system, index) => {
            if (
              !system.defenseRating ||
              typeof system.defenseRating !== "number" ||
              isNaN(system.defenseRating)
            ) {
              console.log(
                "Système corrompu détecté lors du chargement:",
                system
              );
              system.defenseRating = (index + 1) * 10;
              hasCorruptedSystems = true;
            }
            if (!system.rewards) {
              system.rewards = {
                energy: (index + 1) * 50,
                metal: (index + 1) * 25,
                crystals: (index + 1) * 10,
                influence: index + 1,
              };
              hasCorruptedSystems = true;
            }
          });

          if (hasCorruptedSystems) {
            console.log("Systèmes corrompus corrigés");
            this.saveGame(); // Sauvegarder les corrections
          }
        }

        this.updateDisplay();
        console.log("Sauvegarde chargée avec succès");
      } catch (e) {
        console.log("Erreur lors du chargement de la sauvegarde:", e);
        // En cas d'erreur, supprimer la sauvegarde corrompue et regénérer
        localStorage.removeItem("starshipClickerSave");
        this.generateSystems();
        this.showNotification(
          "Sauvegarde corrompue supprimée, nouveau jeu démarré",
          "error"
        );
      }
    }
  }

  // Méthode pour fusionner profondément les objets
  deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = this.deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  }
  // Fonction de débogage pour ajouter des ressources
  debugAddResources() {
    this.gameState.resources.energy += 10000;
    this.gameState.resources.metal += 5000;
    this.gameState.resources.crystals += 2000;
    this.gameState.resources.antimatter += 100;
    this.gameState.resources.influence += 50;
    this.updateDisplay();
    this.saveGame();
    this.showNotification("Ressources ajoutées pour le débogage!", "info");
  }

  // Fonction de reset du jeu
  resetGame() {
    if (
      confirm(
        "Êtes-vous sûr de vouloir recommencer le jeu ? Toute progression sera perdue !"
      )
    ) {
      // Supprimer la sauvegarde
      localStorage.removeItem("starshipClickerSave"); // Réinitialiser l'état du jeu
      this.gameState = {
        resources: {
          energy: 0,
          metal: 0,
          crystals: 0,
          antimatter: 0,
          influence: 0,
          darkMatter: 0,
          quantumEnergy: 0,
          ascensionPoints: 0,
        },
        clickPower: 1,
        totalEnergyGenerated: 0,
        civilizationLevel: 1,
        explorationProgress: 0,
        generators: {
          solarPanel: { count: 0, cost: 10, production: 1, resource: "energy" },
          miningDrone: { count: 0, cost: 25, production: 1, resource: "metal" },
          crystalExtractor: {
            count: 0,
            cost: 50,
            production: 1,
            resource: "crystals",
            costResource: "metal",
          },
          fusionReactor: {
            count: 0,
            cost: 100,
            production: 10,
            resource: "energy",
            costResource: "crystals",
          },
          antimatterGenerator: {
            count: 0,
            cost: 500,
            production: 1,
            resource: "antimatter",
            costResource: "crystals",
          },
          quantumHarvester: {
            count: 0,
            cost: 1000,
            production: 5,
            resource: "antimatter",
            costResource: "energy",
          },
          stellarForge: {
            count: 0,
            cost: 2000,
            production: 50,
            resource: "metal",
            costResource: "antimatter",
          },
          dimensionalRift: {
            count: 0,
            cost: 5000,
            production: 25,
            resource: "crystals",
            costResource: "antimatter",
          },
          // Générateurs ultra-avancés
          darkMatterCollector: {
            count: 0,
            cost: 25000,
            production: 1,
            resource: "darkMatter",
            costResource: "antimatter",
          },
          quantumResonator: {
            count: 0,
            cost: 100000,
            production: 5,
            resource: "quantumEnergy",
            costResource: "darkMatter",
          },
          voidHarvester: {
            count: 0,
            cost: 500000,
            production: 100,
            resource: "energy",
            costResource: "quantumEnergy",
          },
          cosmicFurnace: {
            count: 0,
            cost: 1000000,
            production: 200,
            resource: "metal",
            costResource: "quantumEnergy",
          },
          realityEngine: {
            count: 0,
            cost: 5000000,
            production: 1000,
            resource: "crystals",
            costResource: "quantumEnergy",
          },
        },
        upgrades: {
          clickUpgrade: { level: 0, cost: 15, multiplier: 1.5 },
          autoClicker: { count: 0, cost: 200, multiplier: 2 },
          // Améliorations de prestige
          prestigeMultiplier: { level: 0, cost: 10, multiplier: 2.0 },
          quantumCore: { level: 0, cost: 100, multiplier: 1.5 },
          darkMatterBooster: { level: 0, cost: 50, multiplier: 3.0 },
          cosmicAscension: { level: 0, cost: 500, multiplier: 10.0 },
        },
        fleet: {
          fighters: {
            count: 0,
            cost: { energy: 150, metal: 75 },
            attack: 1,
            maintenance: 1,
          },
          cruisers: {
            count: 0,
            cost: { energy: 800, metal: 400, crystals: 50 },
            attack: 5,
            maintenance: 3,
          },
          dreadnoughts: {
            count: 0,
            cost: { energy: 3000, metal: 1500, crystals: 200, antimatter: 10 },
            attack: 25,
            maintenance: 10,
          },
          titans: {
            count: 0,
            cost: {
              energy: 10000,
              metal: 5000,
              crystals: 1000,
              antimatter: 50,
            },
            attack: 100,
            maintenance: 25,
          },
          motherships: {
            count: 0,
            cost: {
              energy: 50000,
              metal: 25000,
              crystals: 5000,
              antimatter: 200,
              influence: 10,
            },
            attack: 500,
            maintenance: 50,
          },
          // Vaisseaux légendaires
          worldBurners: {
            count: 0,
            cost: {
              energy: 250000,
              metal: 125000,
              crystals: 25000,
              antimatter: 1000,
              darkMatter: 5,
            },
            attack: 2500,
            maintenance: 100,
          },
          voidCrusaders: {
            count: 0,
            cost: {
              energy: 1000000,
              metal: 500000,
              crystals: 100000,
              antimatter: 5000,
              darkMatter: 25,
              quantumEnergy: 1,
            },
            attack: 10000,
            maintenance: 200,
          },
          realityShifters: {
            count: 0,
            cost: {
              energy: 5000000,
              metal: 2500000,
              crystals: 500000,
              antimatter: 25000,
              darkMatter: 100,
              quantumEnergy: 10,
            },
            attack: 50000,
            maintenance: 500,
          },
        },
        conqueredSystems: [],
        availableSystems: [],
        // Système d'événements aléatoires
        eventSystem: {
          lastEventTime: 0,
          eventCooldown: 60000, // 1 minute entre les événements
          activeEvent: null,
        },
        // Système de prestige
        prestige: {
          totalAscensions: 0,
          permanentBonuses: {
            clickMultiplier: 1,
            productionMultiplier: 1,
            fleetPowerMultiplier: 1,
          },
          lifetimeResources: {
            energy: 0,
            metal: 0,
            crystals: 0,
            antimatter: 0,
            influence: 0,
          },
        },
        technologies: {
          advancedPropulsion: {
            unlocked: false,
            cost: { crystals: 200, antimatter: 5 },
            effect: "Reduit le cout des vaisseaux de 20%",
          },
          quantumComputing: {
            unlocked: false,
            cost: { crystals: 500, antimatter: 15 },
            effect: "Augmente la production de tous les generateurs de 50%",
          },
          neuralNetworks: {
            unlocked: false,
            cost: { crystals: 1000, antimatter: 50 },
            effect: "Auto-ameliore les generateurs",
          },
          warpDrive: {
            unlocked: false,
            cost: { antimatter: 100, influence: 10 },
            effect: "Debloque l'exploration de nouveaux systemes",
          },
          energyEfficiency: {
            unlocked: false,
            cost: { energy: 50000, crystals: 300 },
            effect: "Reduit la maintenance de la flotte de 30%",
          },
          hyperSpace: {
            unlocked: false,
            cost: { antimatter: 200, influence: 25 },
            effect: "Double les recompenses d'exploration",
          },
          nanotechnology: {
            unlocked: false,
            cost: { crystals: 2000, antimatter: 150 },
            effect: "Les generateurs se reparent automatiquement",
          },
          artificialIntelligence: {
            unlocked: false,
            cost: { antimatter: 500, influence: 50 },
            effect: "Optimise automatiquement la production",
          },
          // Technologies ultra-avancées
          darkMatterPhysics: {
            unlocked: false,
            cost: { antimatter: 2500, darkMatter: 1 },
            effect: "Debloque la manipulation de la matiere noire",
          },
          quantumEntanglement: {
            unlocked: false,
            cost: { darkMatter: 10, quantumEnergy: 1 },
            effect: "Production instantanee pour tous les generateurs",
          },
          voidTechnology: {
            unlocked: false,
            cost: { darkMatter: 50, quantumEnergy: 5 },
            effect: "Acces aux technologies du vide cosmique",
          },
          realityManipulation: {
            unlocked: false,
            cost: { quantumEnergy: 25, ascensionPoints: 1 },
            effect: "Controle de la realite - bonus x10 a tout",
          },
          cosmicAscension: {
            unlocked: false,
            cost: { quantumEnergy: 100, ascensionPoints: 5 },
            effect: "Transcendance cosmique - prestige ameliore",
          },
        },
      };

      // Régénérer les systèmes
      this.generateSystems();

      // Mettre à jour l'affichage
      this.updateDisplay();

      // Retourner à l'onglet boutique
      this.showTab("shop");

      // Force la mise à jour des technologies
      this.updateTechnologyDisplay();

      this.showNotification("Jeu réinitialisé ! Nouveau départ !", "success");
    }
  }

  autoUpgradeGenerators() {
    // Auto-acheter des générateurs si on a assez de ressources
    Object.entries(this.gameState.generators).forEach(
      ([generatorType, generator]) => {
        const costResource = generator.costResource || "energy";
        const cost = generator.cost;

        // Acheter seulement si on a au moins 10x le coût pour éviter de dépenser toutes les ressources
        if (this.gameState.resources[costResource] >= cost * 10) {
          this.gameState.resources[costResource] -= cost;
          generator.count++;
          generator.cost = Math.floor(generator.cost * 1.15);
        }
      }
    );
  }
  // Méthode pour changer d'onglet
  showTab(tabName) {
    // Désactiver tous les onglets
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => {
      panel.classList.remove("active");
    });

    // Activer l'onglet sélectionné
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const activePanel = document.getElementById(`${tabName}-panel`);

    if (activeBtn) activeBtn.classList.add("active");
    if (activePanel) activePanel.classList.add("active");

    // Mettre à jour l'affichage pour cet onglet
    if (tabName === "exploration") {
      this.updateExplorationDisplay();
    } else if (tabName === "technology") {
      this.updateTechnologyDisplay();
    }
  }

  // Méthode pour afficher les notifications
  showNotification(message, type = "info") {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());

    // Créer la nouvelle notification
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Ajouter au DOM
    document.body.appendChild(notification);

    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }
}

// Initialisation du jeu
document.addEventListener("DOMContentLoaded", () => {
  console.log("🌟 DOM Content Loaded - Initializing game...");

  window.game = new StarshipClicker();

  // Attendre un court délai puis initialiser
  setTimeout(() => {
    console.log("🎮 Calling init() method...");
    game.init();

    // Initialiser avec l'onglet boutique actif
    game.showTab("shop");

    console.log("✅ Game fully initialized");
  }, 100);

  // Fonction de débogage accessible globalement
  window.debugAddResources = () => game.debugAddResources();

  // Fonction de reset accessible globalement
  window.resetGame = () => game.resetGame();

  // Fonction pour charger le script de test
  window.loadTestScript = () => {
    const script = document.createElement("script");
    script.src = "test-features.js";
    script.onload = () => {
      console.log("🧪 Script de test chargé !");
      console.log("🚀 Lancement des tests automatiques...");
      setTimeout(() => {
        if (typeof runAllTests === "function") {
          runAllTests();
        }
      }, 500);
    };
    script.onerror = () => {
      console.error("❌ Erreur lors du chargement du script de test");
    };
    document.head.appendChild(script);
  };

  // Informations de débogage
  console.log("Jeu initialisé. Commandes disponibles:");
  console.log("- debugAddResources() : Ajouter des ressources");
  console.log("- resetGame() : Réinitialiser le jeu");
});
