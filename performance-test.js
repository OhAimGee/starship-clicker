// Test de performance et fonctionnalité du jeu Starship Clicker
// À exécuter dans la console du navigateur

console.log("🚀 Test de Performance Starship Clicker");
console.log("=====================================");

function performanceTest() {
  const startTime = performance.now();

  // Test 1: Initialisation du jeu
  console.log("1️⃣ Test d'initialisation...");
  const gameExists = typeof window.game !== "undefined";
  console.log(`   Game object: ${gameExists ? "✅" : "❌"}`);

  if (!gameExists) {
    console.log("❌ Impossible de continuer sans l'objet game");
    return;
  }

  // Test 2: État initial des ressources
  console.log("2️⃣ Test des ressources initiales...");
  const resources = window.game.gameState?.resources;
  if (resources) {
    Object.keys(resources).forEach((resource) => {
      console.log(`   ${resource}: ${resources[resource]} ✅`);
    });
  } else {
    console.log("   ❌ Ressources non trouvées");
  }

  // Test 3: Simulation de clics
  console.log("3️⃣ Test de simulation de clics...");
  const mothership = document.getElementById("mothership");
  if (mothership) {
    const initialEnergy = window.game.gameState?.resources?.energy || 0;

    // Simuler 5 clics
    for (let i = 0; i < 5; i++) {
      mothership.click();
    }

    setTimeout(() => {
      const finalEnergy = window.game.gameState?.resources?.energy || 0;
      const gained = finalEnergy - initialEnergy;
      console.log(`   Énergie avant: ${initialEnergy}`);
      console.log(`   Énergie après: ${finalEnergy}`);
      console.log(`   Gain: ${gained} ${gained > 0 ? "✅" : "❌"}`);

      // Test 4: Mise à jour de l'affichage
      console.log("4️⃣ Test de l'affichage...");
      const energyDisplay = document.getElementById("energy-count");
      if (energyDisplay) {
        const displayValue = parseInt(energyDisplay.textContent || "0");
        console.log(
          `   Affichage synchronisé: ${
            displayValue === finalEnergy ? "✅" : "❌"
          }`
        );
      }

      // Test 5: Performance
      const endTime = performance.now();
      const duration = endTime - startTime;
      console.log(
        `5️⃣ Performance: ${duration.toFixed(2)}ms ${
          duration < 100 ? "✅" : "⚠️"
        }`
      );

      // Résumé final
      console.log("\n🎯 RÉSUMÉ DES TESTS");
      console.log("==================");
      console.log(`✅ Jeu initialisé: ${gameExists}`);
      console.log(`✅ Ressources: ${!!resources}`);
      console.log(`✅ Clics fonctionnels: ${gained > 0}`);
      console.log(`✅ Affichage: ${energyDisplay ? "OK" : "Erreur"}`);
      console.log(
        `✅ Performance: ${duration < 100 ? "Excellente" : "Acceptable"}`
      );
    }, 500);
  } else {
    console.log("   ❌ Élément mothership non trouvé");
  }
}

// Attendre le chargement complet
if (document.readyState === "complete") {
  performanceTest();
} else {
  window.addEventListener("load", () => {
    setTimeout(performanceTest, 1000);
  });
}
