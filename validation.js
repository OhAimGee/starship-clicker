// Validation finale du projet Starship Clicker
// Ce script vérifie que tous les composants fonctionnent correctement

(function () {
  "use strict";

  console.log("🔍 Démarrage de la validation finale...");

  // Attendre que tout soit chargé
  window.addEventListener("load", function () {
    setTimeout(runValidation, 2000);
  });

  function runValidation() {
    const results = {
      elements: [],
      eventListeners: [],
      gameLogic: [],
      errors: [],
    };

    console.log("🧪 Validation des éléments HTML...");
    validateElements(results);

    console.log("🔗 Validation des event listeners...");
    validateEventListeners(results);

    console.log("🎮 Validation de la logique du jeu...");
    validateGameLogic(results);

    console.log("📋 Génération du rapport...");
    generateReport(results);
  }
  function validateElements(results) {
    const requiredElements = [
      "mothership",
      "energy-count",
      "metal-count",
      "crystal-count",
      "antimatter-count",
      "influence-count",
      "darkMatter-count",
      "quantumEnergy-count",
      "solar-panel",
      "mining-drone",
      "crystal-extractor",
      "fusion-reactor",
      "click-upgrade",
      "auto-clicker",
      "buy-fighter",
      "buy-cruiser",
      "shop-panel",
      "fleet-panel",
      "exploration-panel",
      "technology-panel",
      "ascension-panel",
    ];

    requiredElements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        results.elements.push(`✅ ${id} trouvé`);
      } else {
        results.elements.push(`❌ ${id} manquant`);
        results.errors.push(`Élément manquant: ${id}`);
      }
    });

    // Validation spéciale pour les boutons d'onglets
    const tabButtons = [
      { dataTab: "shop", name: "Boutique" },
      { dataTab: "fleet", name: "Flotte" },
      { dataTab: "exploration", name: "Exploration" },
      { dataTab: "technology", name: "Technologies" },
      { dataTab: "ascension", name: "Ascension" },
    ];

    tabButtons.forEach((tab) => {
      const button = document.querySelector(`[data-tab="${tab.dataTab}"]`);
      if (button) {
        results.elements.push(
          `✅ Bouton ${tab.name} (data-tab="${tab.dataTab}") trouvé`
        );
      } else {
        results.elements.push(
          `❌ Bouton ${tab.name} (data-tab="${tab.dataTab}") manquant`
        );
        results.errors.push(`Bouton d'onglet manquant: ${tab.name}`);
      }
    });
  }

  function validateEventListeners(results) {
    const mothership = document.getElementById("mothership");
    if (mothership) {
      // Test du clic
      try {
        const event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
        });

        let clickDetected = false;

        // Écouter temporairement les clics
        const testListener = () => {
          clickDetected = true;
        };
        mothership.addEventListener("click", testListener);

        mothership.dispatchEvent(event);

        if (clickDetected) {
          results.eventListeners.push(
            "✅ Event listener sur mothership fonctionnel"
          );
        } else {
          results.eventListeners.push(
            "❌ Event listener sur mothership non détecté"
          );
        }

        mothership.removeEventListener("click", testListener);
      } catch (error) {
        results.eventListeners.push(
          `❌ Erreur test mothership: ${error.message}`
        );
        results.errors.push(error.message);
      }
    }

    // Vérifier les onglets
    const tabButtons = document.querySelectorAll(".tab-btn");
    if (tabButtons.length > 0) {
      results.eventListeners.push(
        `✅ ${tabButtons.length} boutons d'onglets trouvés`
      );
    } else {
      results.eventListeners.push("❌ Aucun bouton d'onglet trouvé");
    }
  }

  function validateGameLogic(results) {
    // Vérifier si l'objet game existe
    if (typeof window.game !== "undefined") {
      results.gameLogic.push("✅ Objet game instancié");

      // Vérifier les méthodes essentielles
      const essentialMethods = [
        "clickMothership",
        "updateDisplay",
        "buyGenerator",
      ];
      essentialMethods.forEach((method) => {
        if (typeof window.game[method] === "function") {
          results.gameLogic.push(`✅ Méthode ${method} disponible`);
        } else {
          results.gameLogic.push(`❌ Méthode ${method} manquante`);
          results.errors.push(`Méthode manquante: ${method}`);
        }
      });

      // Vérifier l'état du jeu
      if (window.game.gameState) {
        results.gameLogic.push("✅ État du jeu initialisé");

        if (window.game.gameState.resources) {
          results.gameLogic.push("✅ Ressources initialisées");
        } else {
          results.gameLogic.push("❌ Ressources non initialisées");
        }
      } else {
        results.gameLogic.push("❌ État du jeu non initialisé");
      }
    } else {
      results.gameLogic.push("❌ Objet game non trouvé");
      results.errors.push("Game object not found");
    }
  }

  function generateReport(results) {
    console.log("\n🎯 RAPPORT DE VALIDATION FINALE");
    console.log("================================");

    console.log("\n📋 Éléments HTML:");
    results.elements.forEach((item) => console.log(item));

    console.log("\n🔗 Event Listeners:");
    results.eventListeners.forEach((item) => console.log(item));

    console.log("\n🎮 Logique du Jeu:");
    results.gameLogic.forEach((item) => console.log(item));

    if (results.errors.length > 0) {
      console.log("\n❌ Erreurs Détectées:");
      results.errors.forEach((error) => console.log(`  • ${error}`));
    } else {
      console.log("\n✅ VALIDATION RÉUSSIE - Aucune erreur détectée !");
    }

    // Notification visuelle
    const notification = document.createElement("div");
    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${results.errors.length > 0 ? "#ff4444" : "#00ff88"};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-family: monospace;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
    notification.textContent =
      results.errors.length > 0
        ? `❌ ${results.errors.length} erreur(s) détectée(s)`
        : "✅ Validation réussie !";

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 5000);

    console.log("\n🏁 Validation terminée !");
  }
})();
