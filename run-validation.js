// Script pour exécuter la validation automatiquement dans la console du navigateur
console.log(
  "🔍 Début de la validation automatique du projet Starship Clicker..."
);

// Attendre que tous les scripts soient chargés
setTimeout(() => {
  try {
    // Vérifier si la fonction de validation existe
    if (typeof window.runValidation === "function") {
      console.log("✅ Fonction de validation trouvée, exécution en cours...");
      window.runValidation();
    } else {
      console.log("❌ Fonction de validation non trouvée");

      // Alternative : tests manuels de base
      console.log("🔧 Exécution des tests manuels de base...");

      // Test 1 : Éléments essentiels
      const mothership = document.getElementById("mothership");
      const energyCount = document.getElementById("energy-count");
      const metalCount = document.getElementById("metal-count");

      console.log("Test éléments DOM:", {
        mothership: !!mothership,
        energyCount: !!energyCount,
        metalCount: !!metalCount,
      });

      // Test 2 : Classes JavaScript
      console.log("Test classes JavaScript:", {
        StarshipGame: typeof window.StarshipGame !== "undefined",
        game: typeof window.game !== "undefined",
      });

      // Test 3 : Simulation de clic
      if (mothership) {
        const initialEnergy = parseInt(energyCount?.textContent || "0");
        mothership.click();
        setTimeout(() => {
          const newEnergy = parseInt(energyCount?.textContent || "0");
          console.log("Test de clic:", {
            before: initialEnergy,
            after: newEnergy,
            success: newEnergy > initialEnergy,
          });
        }, 100);
      }
    }
  } catch (error) {
    console.error("❌ Erreur lors de la validation:", error);
  }
}, 2000); // Attendre 2 secondes pour le chargement
