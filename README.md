# 🚀 Starship Clicker

Jeu incrémental (idle / clicker) de civilisation spatiale, jouable dans le
navigateur, avec une couche rogue-lite sur le système d'Ascension : on choisit
une **faction** avant chaque run (clic → générateurs → flotte → technologies
→ exploration), on explore les systèmes via une **carte à nœuds**, et on
ascende en fin de run pour des points d'ascension dépensés entre deux runs
sur l'arbre de compétences de la faction et l'arbre commun.

100 % côté client — aucun compte, aucun serveur. Déployé en statique sur
GitHub Pages : **https://ohaimgee.github.io/starship-clicker/**

## Statut

Refonte 2026 (architecture + design) puis refonte rogue-like terminées.
Vision produit : `PRODUCT.md` · système visuel : `DESIGN.md` · plan :
`.claude/plans/`.

| Refonte | Phase | Contenu                                                     | État |
| ------- | ----- | ------------------------------------------------------------ | ---- |
| 2026    | 0     | Socle : git, Vite, lint, CI, nettoyage                        | ✅   |
| 2026    | 1     | Réparer la boucle de jeu (prestige, progression hors-ligne)   | ✅   |
| 2026    | 2     | Architecture modulaire pilotée par les données + i18n         | ✅   |
| 2026    | 3     | Refonte visuelle — « tableau des départs à palettes »         | ✅   |
| 2026    | 4     | Finition, équilibrage, déploiement                            | ✅   |
| Rogue-like | 0-1 | Factions, méta/run, sauvegarde v3                          | ✅   |
| Rogue-like | 2   | Sélection de faction & cycle de run                        | ✅   |
| Rogue-like | 3-4 | Carte d'exploration à nœuds + câblage moteur                | ✅   |
| Rogue-like | 5   | UI faction / carte / compétences                            | ✅   |
| Rogue-like | 6   | Contenu (générateurs, systèmes, arbres de faction)           | ✅   |
| Rogue-like | 7   | Outillage d'équilibrage (`npm run simulate`)                 | ✅   |

## Développement

```bash
npm install
npm run dev        # serveur de dev Vite
npm run build      # build de production -> dist/
npm run preview    # sert dist/ localement (simule GitHub Pages)
npm run lint
npm test
npm run simulate   # simulation d'équilibrage headless (rapport de rythme)
```

Node 20+ requis.

## Structure

```
index.html            coquille HTML (point d'entrée Vite)
src/
  main.js             bootstrap : charge la sauvegarde, calcule le hors-ligne, monte l'UI
  data/               définitions du jeu (ressources, générateurs, flotte, technos, systèmes,
                       événements, config, factions, objectifs, types de nœuds)
  game/               moteur pur + orchestrateur (economy, engine, save, offline, prestige,
                       run, exploration, nodemap, events)
  i18n/               t(key), fr + en (parité de clés testée)
  ui/                 interface data-driven (app, panels, flap, icons, board-row, node-map,
                       faction-select, styles)
public/               favicon, manifeste PWA, service worker, icônes
scripts/               outillage (simulate.mjs : simulation d'équilibrage headless)
docs/archive/         anciens rapports de développement
.github/workflows/    déploiement GitHub Pages
```

107 tests (`npm test`), lint (`npm run lint`).

## Sauvegarde

Progression stockée dans le `localStorage` du navigateur (clé
`starshipClickerSave`), sauvegarde automatique. Aucune donnée ne quitte la
machine. Les sauvegardes d'avant la refonte rogue-like (schéma < v3) sont
archivées automatiquement sous `starshipClickerSave.archived.v2` avant d'être
remplacées par une nouvelle partie propre (aucune conversion fidèle possible
— trop de changements structurels).

## Historique

L'état du projet avant refonte est conservé sous le tag git `legacy-v2`.
Les anciens rapports de nettoyage sont dans `docs/archive/`.
