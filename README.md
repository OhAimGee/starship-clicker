# 🚀 Starship Clicker

Jeu incrémental (idle / clicker) de civilisation spatiale, jouable dans le
navigateur : cliquez sur le vaisseau-mère pour produire de l'énergie,
réinvestissez dans des générateurs automatiques, une flotte, l'exploration de
systèmes stellaires, un arbre technologique, puis **ascendez** (prestige) pour
des bonus permanents.

100 % côté client — aucun compte, aucun serveur. Déployé en statique sur
GitHub Pages.

## Statut

Refonte en cours (2026). Voir `PRODUCT.md` pour la vision produit et le plan de
refonte dans `.claude/plans/`.

| Phase | Contenu                                                     | État |
| ----- | ----------------------------------------------------------- | ---- |
| 0     | Socle : git, Vite, lint, CI, nettoyage                      | ✅   |
| 1     | Réparer la boucle de jeu (prestige, progression hors-ligne) | ✅   |
| 2     | Architecture modulaire pilotée par les données + i18n       | ✅   |
| 3     | Refonte visuelle (nouveau design system)                    | ⏳   |
| 4     | Finition, équilibrage, déploiement                          | ⏳   |

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
  main.js             bootstrap
  legacy/             code d'origine, remplacé progressivement (non liné, non testé)
public/               assets copiés tels quels
docs/archive/         anciens rapports de développement
.github/workflows/    déploiement GitHub Pages
```

## Sauvegarde

Progression stockée dans le `localStorage` du navigateur (clé
`starshipClickerSave`), sauvegarde automatique. Aucune donnée ne quitte la
machine.

## Historique

L'état du projet avant refonte est conservé sous le tag git `legacy-v2`.
Les anciens rapports de nettoyage sont dans `docs/archive/`.
