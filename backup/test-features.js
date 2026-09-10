// Script de test pour vérifier toutes les fonctionnalités du Starship Clicker
// À exécuter dans la console du navigateur

console.log("🚀 Démarrage des tests du Starship Clicker");

// Test 1: Vérification de l'initialisation du jeu
function testGameInitialization() {
  console.log("\n📋 Test 1: Initialisation du jeu");

  const expectedResources = [
    "energy",
    "metal",
    "crystals",
    "antimatter",
    "darkMatter",
    "quantumEnergy",
    "ascensionPoints",
  ];
  const missingResources = expectedResources.filter(
    (resource) => !(resource in gameData)
  );

  if (missingResources.length === 0) {
    console.log("✅ Toutes les ressources sont initialisées");
  } else {
    console.log("❌ Ressources manquantes:", missingResources);
  }

  console.log("📊 État des ressources:");
  expectedResources.forEach((resource) => {
    if (resource in gameData) {
      console.log(`  ${resource}: ${gameData[resource]}`);
    }
  });
}

// Test 2: Vérification des vaisseaux légendaires
function testLegendaryShips() {
  console.log("\n🚢 Test 2: Vaisseaux légendaires");

  const legendaryShips = ["worldburner", "voidcrusader", "realityshifter"];

  legendaryShips.forEach((ship) => {
    const shipData = ships[ship];
    const button = document.getElementById(`buy-${ship}`);

    if (shipData && button) {
      console.log(`✅ ${ship}: Données et bouton présents`);
      console.log(`  Coût: ${JSON.stringify(shipData.cost)}`);
      console.log(
        `  Attaque: ${shipData.attack}, Maintenance: ${shipData.maintenance}`
      );
    } else {
      console.log(
        `❌ ${ship}: ${shipData ? "Données OK" : "Données manquantes"}, ${
          button ? "Bouton OK" : "Bouton manquant"
        }`
      );
    }
  });
}

// Test 3: Vérification des technologies quantiques
function testQuantumTechnologies() {
  console.log("\n🔬 Test 3: Technologies quantiques");

  const quantumTechs = Object.keys(technologies).filter(
    (tech) =>
      technologies[tech].cost.quantumEnergy ||
      technologies[tech].cost.darkMatter ||
      tech.includes("quantum") ||
      tech.includes("dark")
  );

  console.log(`📚 Technologies quantiques trouvées: ${quantumTechs.length}`);
  quantumTechs.forEach((tech) => {
    console.log(`  ${tech}: ${technologies[tech].description}`);
  });
}

// Test 4: Test de la fonctionnalité d'ascension
function testAscensionSystem() {
  console.log("\n⭐ Test 4: Système d'ascension");

  const ascensionButton = document.getElementById("ascend-button");
  if (ascensionButton) {
    console.log("✅ Bouton d'ascension présent");

    // Vérifier les conditions d'ascension
    const canAscend = gameData.antimatter >= 100000;
    console.log(
      `💫 Peut ascendre: ${canAscend} (Antimatière: ${gameData.antimatter})`
    );
  } else {
    console.log("❌ Bouton d'ascension manquant");
  }
}

// Test 5: Test du système d'événements
function testEventSystem() {
  console.log("\n🎯 Test 5: Système d'événements");

  if (typeof triggerRandomEvent === "function") {
    console.log("✅ Fonction triggerRandomEvent disponible");

    // Vérifier la structure des événements
    if (typeof gameEvents !== "undefined" && gameEvents.length > 0) {
      console.log(`📅 ${gameEvents.length} événements configurés`);
      console.log("🎲 Événements disponibles:");
      gameEvents.forEach((event, index) => {
        console.log(`  ${index + 1}. ${event.name}: ${event.description}`);
      });
    } else {
      console.log("❌ Aucun événement configuré");
    }
  } else {
    console.log("❌ Système d'événements non disponible");
  }
}

// Test 6: Test des effets visuels
function testVisualEffects() {
  console.log("\n✨ Test 6: Effets visuels");

  const visualFunctions = [
    "createParticleEffect",
    "animateResourceGain",
    "updateShipAnimations",
    "createQuantumEffect",
  ];

  visualFunctions.forEach((func) => {
    if (typeof window[func] === "function") {
      console.log(`✅ ${func} disponible`);
    } else {
      console.log(`❌ ${func} manquant`);
    }
  });
}

// Test 7: Test de la persistance des données
function testDataPersistence() {
  console.log("\n💾 Test 7: Persistance des données");

  try {
    const savedData = localStorage.getItem("starshipClickerSave");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      console.log("✅ Données sauvegardées trouvées");
      console.log("📁 Clés sauvegardées:", Object.keys(parsed));
    } else {
      console.log("ℹ️ Aucune sauvegarde existante");
    }

    // Test de sauvegarde
    if (typeof saveGame === "function") {
      console.log("✅ Fonction saveGame disponible");
    } else {
      console.log("❌ Fonction saveGame manquante");
    }

    // Test de chargement
    if (typeof loadGame === "function") {
      console.log("✅ Fonction loadGame disponible");
    } else {
      console.log("❌ Fonction loadGame manquante");
    }
  } catch (error) {
    console.log("❌ Erreur lors du test de persistance:", error);
  }
}

// Test 8: Test de la performance et des fuites mémoire
function testPerformance() {
  console.log("\n⚡ Test 8: Performance");

  const startTime = performance.now();

  // Simuler quelques cycles de jeu
  for (let i = 0; i < 10; i++) {
    if (typeof gameLoop === "function") {
      gameLoop();
    }
  }

  const endTime = performance.now();
  console.log(
    `🕐 Temps d'exécution pour 10 cycles: ${(endTime - startTime).toFixed(2)}ms`
  );

  // Vérifier les intervalles actifs
  console.log("🔄 Intervalles actifs:", {
    gameLoop: typeof gameLoopInterval !== "undefined",
    autoSave: typeof autoSaveInterval !== "undefined",
  });
}

// Fonction principale de test
function runAllTests() {
  console.log("🎮 STARSHIP CLICKER - SUITE DE TESTS COMPLÈTE");
  console.log("=".repeat(50));

  testGameInitialization();
  testLegendaryShips();
  testQuantumTechnologies();
  testAscensionSystem();
  testEventSystem();
  testVisualEffects();
  testDataPersistence();
  testPerformance();

  console.log("\n" + "=".repeat(50));
  console.log("🏁 Tests terminés ! Vérifiez les résultats ci-dessus.");
  console.log("💡 Pour tester manuellement:");
  console.log("   - Cliquez sur 'Generate Energy' plusieurs fois");
  console.log("   - Achetez des vaisseaux et vérifiez les ressources");
  console.log("   - Testez les technologies quantiques");
  console.log("   - Essayez l'ascension si possible");
}

// Fonction pour donner des ressources de test
function giveTestResources() {
  console.log("🎁 Attribution de ressources de test...");

  gameData.energy = 10000000;
  gameData.metal = 5000000;
  gameData.crystals = 1000000;
  gameData.antimatter = 200000;
  gameData.darkMatter = 1000;
  gameData.quantumEnergy = 100;

  updateDisplay();
  console.log(
    "✅ Ressources attribuées ! Vous pouvez maintenant tester toutes les fonctionnalités."
  );
}

// Exposer les fonctions globalement
window.runAllTests = runAllTests;
window.giveTestResources = giveTestResources;

console.log("📝 Script de test chargé !");
console.log("🔧 Utilisez runAllTests() pour lancer tous les tests");
console.log(
  "🎁 Utilisez giveTestResources() pour obtenir des ressources de test"
);
