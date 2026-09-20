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
Vision produit : `PRODUCT.md` · système visuel : `DESIGN.md` · feuille de route
de contenu : [`docs/ROADMAP.md`](docs/ROADMAP.md) · plan : `.claude/plans/`.

| Refonte    | Phase | Contenu                                                     | État |
| ---------- | ----- | ----------------------------------------------------------- | ---- |
| 2026       | 0     | Socle : git, Vite, lint, CI, nettoyage                      | ✅   |
| 2026       | 1     | Réparer la boucle de jeu (prestige, progression hors-ligne) | ✅   |
| 2026       | 2     | Architecture modulaire pilotée par les données + i18n       | ✅   |
| 2026       | 3     | Refonte visuelle — « tableau des départs à palettes »       | ✅   |
| 2026       | 4     | Finition, équilibrage, déploiement                          | ✅   |
| Rogue-like | 0-1   | Factions, méta/run, sauvegarde v3                           | ✅   |
| Rogue-like | 2     | Sélection de faction & cycle de run                         | ✅   |
| Rogue-like | 3-4   | Carte d'exploration à nœuds + câblage moteur                | ✅   |
| Rogue-like | 5     | UI faction / carte / compétences                            | ✅   |
| Rogue-like | 6     | Contenu (générateurs, systèmes, arbres de faction)          | ✅   |
| Rogue-like | 7     | Outillage d'équilibrage (`npm run simulate`)                | ✅   |

## Feuille de route

Six mises à jour thématiques sont prévues, chacune avec un axe principal et un
chapitre du fil rouge (une histoire par chapitres, débloqués par des jalons de
jeu : systèmes conquis, runs terminées, Ascensions). Détail, règles de cadrage
et chiffres indicatifs dans [`docs/ROADMAP.md`](docs/ROADMAP.md).

| MAJ | Titre de travail                    | Axe principal                | Contenu clé                                                                                              | État     |
| --- | ----------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Combat vivant (« Enhanced Combat ») | Exploration & combat         | PV et blindage des vaisseaux, flottes ennemies, combat simulé avec journal d'événements, Journal de bord | ✅ livrée |
| 2   | Grands Chantiers (« Civil Engineer ») | Production & économie        | Mégastructures, décrets du Sénat, +6 générateurs, +5 technologies, Sentinelles négociables               | ✅ livrée |
| 3   | Frontières                          | Exploration (monde) & combat | Nouveaux systèmes et planètes, raids et garnison, rôles de vaisseaux, événements à choix                 | prévu    |
| 4   | Héritages                           | Prestige & rejouabilité      | Mutateurs de run, 2 nouvelles factions, arbres structurés, succès à récompenses, statistiques            | prévu    |
| 5   | Le Chant sombre                     | Fin de partie                | Ressource « Singularités », générateurs T6, systèmes « Abysses », les Éveillés                           | prévu    |
| 6   | L'Adversaire                        | Narration & clôture          | Boss multi-phases, fins multiples, cycle infini                                                          | prévu    |

**Chantier phare — « Combat vivant »** : les combats cessent d'être instantanés.
Chaque vaisseau a des PV et un blindage (petits vaisseaux : peu chers mais
fragiles ; gros vaisseaux : chers mais solides), l'ennemi devient une vraie
flotte, et la bataille se déroule round par round dans un **journal
d'événements** aléatoires (« vaisseau ennemi détruit », « attaque évitée »…)
jusqu'à la destruction d'un camp. La fenêtre d'allocation affiche la composition
ennemie et une chance de victoire estimée.

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
                       événements, config, factions, objectifs, ennemis, événements de
                       combat, Journal de bord)
  game/               moteur pur + orchestrateur (economy, engine, save, offline, prestige,
                       run, exploration, events, battle : simulation de combat seedée)
  i18n/               t(key), fr + en (parité de clés testée)
  ui/                 interface data-driven (app, panels, flap, icons, board-row, battle-log,
                       journal-screen, faction-select, styles)
public/               favicon, manifeste PWA, service worker, icônes
scripts/               outillage (simulate.mjs : simulation d'équilibrage headless)
docs/ROADMAP.md      feuille de route de contenu (mises à jour prévues)
docs/archive/         anciens rapports de développement
.github/workflows/    déploiement GitHub Pages
```

Près de 280 tests (`npm test`), lint (`npm run lint`).

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
