// Améliorations visuelles pour Starship Clicker
// Ce script ajoute des effets visuels supplémentaires

(function () {
  "use strict";

  // Fonction pour ajouter l'effet de mise à jour des ressources
  function animateResourceUpdate(resourceId) {
    const element = document.getElementById(resourceId);
    if (element) {
      element.classList.add("updated");
      setTimeout(() => {
        element.classList.remove("updated");
      }, 500);
    }
  }

  // Observer les changements dans les compteurs de ressources
  function setupResourceObservers() {
    const resourceIds = [
      "energy-count",
      "metal-count",
      "crystal-count",
      "antimatter-count",
      "influence-count",
    ];

    resourceIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        let lastValue = element.textContent;

        const observer = new MutationObserver(() => {
          const currentValue = element.textContent;
          if (currentValue !== lastValue) {
            animateResourceUpdate(id);
            lastValue = currentValue;
          }
        });

        observer.observe(element, {
          childList: true,
          characterData: true,
          subtree: true,
        });
      }
    });
  }

  // Ajouter des particules flottantes autour du vaisseau mère
  function createFloatingParticles() {
    const mothership = document.querySelector(".mothership");
    if (!mothership) return;

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";
      particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(0, 212, 255, 0.6);
                border-radius: 50%;
                pointer-events: none;
                animation: float-${i % 3} ${
        3 + Math.random() * 2
      }s ease-in-out infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                z-index: -1;
            `;
      mothership.appendChild(particle);
    }

    // Styles d'animation pour les particules
    const style = document.createElement("style");
    style.textContent = `
            @keyframes float-0 {
                0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
                50% { transform: translate(-10px, -20px) scale(1.2); opacity: 1; }
            }
            @keyframes float-1 {
                0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
                50% { transform: translate(15px, -15px) rotate(180deg); opacity: 0.8; }
            }
            @keyframes float-2 {
                0%, 100% { transform: translate(0, 0) scale(0.8); opacity: 0.5; }
                50% { transform: translate(-5px, -25px) scale(1.3); opacity: 0.9; }
            }
        `;
    document.head.appendChild(style);
  }
  // Améliorer les effets de clic via délégation d'événements
  function enhanceClickEffects() {
    // Utiliser la délégation d'événements pour éviter les conflits
    document.addEventListener(
      "click",
      function (e) {
        if (e.target.id === "mothership" || e.target.closest("#mothership")) {
          const mothership = document.getElementById("mothership");
          if (!mothership) return;

          // Effet de ripple
          const ripple = document.createElement("div");
          const rect = mothership.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;

          ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(0, 255, 136, 0.3);
                transform: translate(${x}px, ${y}px) scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
                z-index: 10;
            `;

          mothership.appendChild(ripple);

          setTimeout(() => {
            ripple.remove();
          }, 600);
        }
      },
      true
    ); // Utiliser la phase de capture pour éviter les conflits

    // Style pour l'animation ripple
    const style = document.createElement("style");
    style.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(0px, 0px) scale(2);
                    opacity: 0;
                }
            }
        `;
    document.head.appendChild(style);
  }

  // Ajouter des effets de survol dynamiques
  function addHoverEffects() {
    document.addEventListener("mouseover", function (e) {
      if (
        e.target.matches(".shop-item, .ship-item, .system-item, .tech-item")
      ) {
        e.target.style.transform = "translateY(-5px) scale(1.02)";
      }
    });

    document.addEventListener("mouseout", function (e) {
      if (
        e.target.matches(".shop-item, .ship-item, .system-item, .tech-item")
      ) {
        e.target.style.transform = "";
      }
    });
  }

  // Initialiser toutes les améliorations visuelles
  function init() {
    // Attendre que le DOM soit complètement chargé
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
      return;
    }

    // Attendre un court délai pour s'assurer que le jeu est initialisé
    setTimeout(() => {
      setupResourceObservers();
      createFloatingParticles();
      enhanceClickEffects();
      addHoverEffects();
      console.log("✨ Améliorations visuelles activées !");
    }, 1000);
  }

  // Démarrer l'initialisation
  init();
})();
