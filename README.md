# 🚀 Starship Clicker

Jeu incrémental (idle / clicker) de civilisation spatiale, jouable dans le
navigateur : cliquez sur le vaisseau-mère pour produire de l'énergie,
réinvestissez dans des générateurs automatiques, une flotte, l'exploration de
systèmes stellaires, un arbre technologique, puis **ascendez** (prestige) pour
des bonus permanents.

100 % côté client — aucun compte, aucun serveur. Déployé en statique sur
GitHub Pages : **https://ohaimgee.github.io/starship-clicker/**

## Statut

Refonte 2026 terminée. Vision produit : `PRODUCT.md` · système visuel :
`DESIGN.md` · plan : `.claude/plans/`.

| Phase | Contenu                                                     | État |
| ----- | ----------------------------------------------------------- | ---- |
| 0     | Socle : git, Vite, lint, CI, nettoyage                      | ✅   |
| 1     | Réparer la boucle de jeu (prestige, progression hors-ligne) | ✅   |
| 2     | Architecture modulaire pilotée par les données + i18n       | ✅   |
| 3     | Refonte visuelle — « tableau des départs à palettes »       | ✅   |
| 4     | Finition, équilibrage, déploiement                          | ✅   |

## Développement

```bash
npm install
npm run dev        # serveur de dev Vite
npm run build      # build de production -> dist/
npm run preview    # sert dist/ localement (simule GitHub Pages)
npm run lint
npm test
```

Node 20+ requis.

## Structure

```
index.html            coquille HTML (point d'entrée Vite)
src/
  main.js             bootstrap : charge la sauvegarde, calcule le hors-ligne, monte l'UI
  data/               définitions du jeu (ressources, générateurs, flotte, technos, systèmes, événements, config)
  game/               moteur pur + orchestrateur (economy, engine, save, offline, prestige, exploration, events)
  i18n/               t(key), fr + en (parité de clés testée)
  ui/                 interface data-driven (app, panels, flap, icons, board-row, styles)
public/               favicon, manifeste PWA, service worker, icônes
docs/archive/         anciens rapports de développement
.github/workflows/    déploiement GitHub Pages
```

77 tests (`npm test`), lint (`npm run lint`).

## Sauvegarde

Progression stockée dans le `localStorage` du navigateur (clé
`starshipClickerSave`), sauvegarde automatique. Aucune donnée ne quitte la
machine.

## Historique

L'état du projet avant refonte est conservé sous le tag git `legacy-v2`.
Les anciens rapports de nettoyage sont dans `docs/archive/`.
