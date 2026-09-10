// Script de test rapide pour la validation corrigée
// À coller dans la console du navigateur sur index.html

console.log("🔧 Test Rapide de Validation");
console.log("============================");

// Test manuel des éléments qui posaient problème
const elementsToCheck = [
  "fleet-panel", // Au lieu de 'fleet-tab'
  "exploration-panel", // Au lieu de 'exploration-tab'
  "technology-panel", // Au lieu de 'technology-tab'
  "ascension-panel",
];

console.log("📋 Vérification des panneaux d'onglets:");
elementsToCheck.forEach((id) => {
  const element = document.getElementById(id);
  console.log(
    `${element ? "✅" : "❌"} ${id}: ${element ? "TROUVÉ" : "MANQUANT"}`
  );
});

console.log("\n📋 Vérification des boutons d'onglets:");
const tabButtons = ["shop", "fleet", "exploration", "technology", "ascension"];
tabButtons.forEach((tab) => {
  const button = document.querySelector(`[data-tab="${tab}"]`);
  console.log(
    `${button ? "✅" : "❌"} data-tab="${tab}": ${
      button ? "TROUVÉ" : "MANQUANT"
    }`
  );
});

// Tester la fonction de validation si elle existe
if (typeof window.runValidation === "function") {
  console.log("\n🧪 Exécution de la validation automatique...");
  setTimeout(() => {
    window.runValidation();
  }, 1000);
} else {
  console.log("\n❌ Fonction runValidation non disponible");
}

console.log("\n✅ Test rapide terminé!");
