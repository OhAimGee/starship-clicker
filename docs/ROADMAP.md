# Starship Clicker — Feuille de route de contenu (après « Fifty Update »)

## Contexte

La Fifty Update a livré la refonte mobile « Passerelle », les débits avec décimales
et le pré-remplissage de flotte minimal. Le jeu tient debout, mais son contenu
s'épuise vite et plusieurs mécaniques sont « plates » :

| Constat (code lu)                                                                                                                                                                                                        | Conséquence                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| Combat **instantané et déterministe** : `resolveBattle` (`src/game/combat.js`) = victoire ssi `puissance ≥ défense`. Les vaisseaux n'ont **ni PV ni blindage**, l'ennemi est **un seul nombre** (`planet.defenseRating`) | Aucune tension, aucun enjeu de composition de flotte : « plus gros = mieux » |
| Influence : **1 seul producteur** (`senateArchive`) et presque aucun débouché. Énergie quantique : 1 producteur. Matière noire : 2                                                                                       | Chaînes de production inégales, ressources « orphelines »                    |
| Fin de progression : T5 = 2 générateurs, dernière techno `realityManipulation`, 8 vaisseaux                                                                                                                              | Peu à viser après la 1ʳᵉ Ascension                                           |
| 3 factions × 5 compétences **de structure identique** (liste plate, niveaux illimités)                                                                                                                                   | Peu d'identité entre les factions                                            |
| 11 succès **sans récompense**, 5 événements aléatoires **purement passifs** (gain de ressources), 4 types d'objectifs                                                                                                    | Peu de rejouabilité                                                          |
| Aucun fil narratif : le « lore » se limite aux descriptions d'une ligne                                                                                                                                                  | Ambiance faible                                                              |

**Objectif** : cadrer plusieurs mises à jour futures, cohérentes entre elles, en couvrant
les quatre axes choisis (Production & économie · Exploration & combat · Prestige &
rejouabilité · Ambiance & narration), avec le **combat vivant** en chantier phare.

### Décisions déjà validées avec le joueur

- **Scénario** : fil rouge **par chapitres** — un chapitre ≈ une mise à jour, débloqué par des
  jalons de gameplay (systèmes conquis, runs terminées, Ascensions…).
- **Rythme** : mises à jour **thématiques moyennes** — un axe principal + de petits extras
  (comme Corbi / Fifty).
- **Priorités** : les quatre axes.
- **Demande spécifique** : journal d'événements de combat qui s'ouvre au début de la bataille,
  événements aléatoires (« vaisseau ennemi détruit », « attaque évitée »…) jusqu'à
  destruction totale d'un camp ; combats non instantanés, tension, meilleure gestion de
  flotte ; **gros vaisseaux = solides mais chers, petits vaisseaux = peu chers mais fragiles**.

> Les noms de code des mises à jour (Corbi, Fifty…) sont au choix du joueur : les titres
> ci-dessous sont des noms de travail thématiques.

---

## Règles de cadrage (valables pour toutes les mises à jour)

1. **Une MAJ = un `id`** dans `src/data/updates.js` + 3 puces `updateNotice.<id>.*` (FR/EN) + un chapitre.
2. **Données d'abord** : tout contenu est une entrée de `src/data/*` + clés i18n **FR et EN**
   (parité testée par `src/i18n/i18n.test.js`) ; l'UI est générée depuis les données.
3. **Sauvegarde toujours additive** : `SCHEMA_VERSION` 8 → 9 → 10… (précédent : v4→v8).
   `mergeIntoShape` (`src/game/save.js`) comble les champs manquants ; jamais de reset forcé.
   Les jalons d'histoire se rattrapent rétroactivement au chargement (motif
   `Engine#_scanAchievements`) : un joueur avancé obtient les chapitres déjà « mérités ».
4. **Pas de nouveau type d'effet sans nécessité** : réutiliser le vocabulaire de
   `economy.js#applyLeveledEffect` (productionMultiplier, resourceProductionMultiplier,
   clickMultiplier, fleetMultiplier, fleetMaintenance, shipCost). Les seuls ajouts prévus :
   `fleetDurability` (PV, MAJ 1), `lootMultiplier` + `decreeSlots` (MAJ 2), `garrisonPower` (MAJ 3).
5. **Pas d'onglet supplémentaire** : le pager mobile 390 px a 5 onglets. Les nouveaux écrans
   (Journal de bord, Statistiques, Décrets…) passent par le tiroir / des modales
   (motif `achievements-screen.js`, `options-screen.js`, `modal.js#openPanel`).
6. **DESIGN.md respecté** : une seule police (Barlow Condensed), pas d'emoji, icônes dessinées
   à la main sur la grille 24 (`src/ui/icons.js` + `icon-map.js`), portraits de planètes par
   archétype (`planet-art.js`), couleurs via tokens de thème uniquement.
7. **L'idle reste sacré** : combats et histoire ne bloquent jamais la production ; le calcul
   hors-ligne (`offline.js`, plafond 8 h) reste inchangé.
8. **Équilibrage vérifié, pas supposé** : `npm run simulate` (`scripts/simulate.mjs`) avant/après,
   `src/data/balance.test.js` étendu à chaque nouvelle catégorie, garde du système 0
   (le tutoriel en dépend).

---

## Chantier phare : « Combat vivant » (MAJ 1)

### Modèle de jeu

- **Stats de vaisseau** (`src/data/fleet.js`) : ajouter `hp` (PV) et `armorTier` (blindage
  exprimé en palier, donc insensible aux multiplicateurs de flotte). Règle de conception :
  _attaque/coût ≈ constant_ d'un palier à l'autre, mais _PV/attaque croît_ avec le palier.
  - **Petits** (chasseurs, croiseurs) : peu chers, forte cadence, esquive élevée, **fragiles** ;
    ils gaspillent leurs tirs sur les gros blindages.
  - **Gros** (cuirassés → réalité-shifters) : chers (+ maintenance), **solides**, peu de tirs :
    un tir tue au plus 1 vaisseau ⇒ leur salve est **gâchée** contre un essaim de petites cibles.
  - Valeurs indicatives à régler par simulation :

    | Vaisseau          | attaque | PV      | blindage (palier) |
    | ----------------- | ------- | ------- | ----------------- |
    | Chasseurs         | 2       | 6       | 0                 |
    | Croiseurs         | 6       | 30      | 1                 |
    | Cuirassés         | 25      | 180     | 2                 |
    | Titans            | 110     | 900     | 3                 |
    | Vaisseaux-mères   | 550     | 5 500   | 4                 |
    | Brûle-mondes      | 2 800   | 30 000  | 5                 |
    | Croiseurs du vide | 11 000  | 130 000 | 6                 |
    | Réalité-shifters  | 55 000  | 700 000 | 7                 |

- **Flottes ennemies** (nouveau `src/data/enemies.js`) : 5 classes génériques (drone, frégate,
  croiseur, bastion, léviathan) et des **profils de faction ennemie** = pondérations de
  composition + noms + lignes de journal propres (L'Essaim = beaucoup de drones ; les
  Sentinelles = peu de bastions…). `buildEnemyFleet(defenseRating, profil, rng)` **répartit
  le budget `defenseRating`** entre les classes : la puissance totale ennemie reste égale à
  `defenseRating` ⇒ toute la courbe de progression, `EXPLORATION.baseDefense` et le tutoriel
  restent valides.
- **Simulation** (nouveau `src/game/battle.js`, fonction **pure et seedée** — réutiliser
  `mulberry32` déjà employé par `exploration.js`) : rounds de salves simultanées, calculés **par
  pile de classe** (jamais par vaisseau : des milliers d'unités), efficacité de tir bornée
  [0,25 ; 1] selon palier tireur / blindage cible, esquive, critiques, événements aléatoires ;
  fin quand un camp n'a plus de vaisseau (plafond `CONFIG.combat.maxRounds`).
  Retourne `{ victory, rounds:[{n, events[], allyHp, enemyHp}], losses, seed }`.
- **Invariant d'équilibrage (loi de Lanchester)** : pour que « puissance ≥ défense » reste vrai _en
  moyenne_, les multiplicateurs de flotte (`committedFleetPower`) s'appliquent à
  l'attaque **et** aux PV, et l'ennemi est bâti avec le même ratio PV/attaque. Le hasard, le
  blindage et la composition créent la variance ; `fleetDurability` (PV seuls) devient un
  effet de techno/compétence à part entière.
- **Événements de combat** (nouveau `src/data/combatEvents.js`, pondérés, `when(ctx)` / `apply(ctx, rng)`,
  même motif que `RANDOM_EVENTS`) — ~12 au départ : vaisseau ennemi détruit, attaque évitée,
  coup critique, bouclier saturé, brèche dans la coque, réacteur en surchauffe (perte alliée),
  salve groupée, renforts ennemis, manœuvre d'évasion, ravitaillement d'urgence, panne
  d'armes, vaisseau amiral touché + lignes propres à chaque faction ennemie.
- **Pertes réelles** : les vaisseaux perdus sont ceux détruits dans la simulation (la formule
  `lossFraction` / `CONFIG.combat.winLoss*` disparaît). Défaite = flotte engagée détruite/repliée,
  la phase de la planète n'avance pas (comportement actuel conservé). Survivants intégralement réparés.

### Flux et UI

1. « Engager » (`system-detail.js`) → `Engine#resolvePlanetCombat` : simule **immédiatement** avec une
   graine, applique pertes/récompenses/XP comme aujourd'hui (sûr pour la sauvegarde et l'idle), puis
   émet `battle-resolved` avec `entry.log`.
2. `src/ui/app.js` (l. 474) ouvre le nouveau **`src/ui/battle-log.js`** (modale `openPanel`) : deux barres de
   PV agrégées (flotte alliée / ennemie), compteur de round, lignes de journal ajoutées toutes les
   ~600 ms avec icônes ; boutons **Vitesse ×1/×2/×4** et **Passer** ; fermer = passer. À la fin :
   le rapport actuel (`battle-report.js`) — pertes, butin.
   `prefers-reduced-motion` ⇒ affichage immédiat.
3. **Option « Combats : animés / résumé seulement »** dans `options-screen.js` (le joueur qui enchaîne
   les combats ne subit pas l'animation).
4. `run.combatLog` (déjà présent, plafonné à 20) stocke seulement `seed` + résumé, **jamais le journal
   complet** : la fonction pure permet de « Revoir » un combat.
5. **Modale d'allocation** (`fleet-allocation.js`) : affiche la **composition ennemie** (icônes + effectifs), une
   **indication de profil** (« Essaim : privilégiez le nombre »), et une **chance de victoire estimée**
   (Monte-Carlo ~200 simulations seedées, < 5 ms chacune). Le pré-remplissage « moins puissants d'abord »
   (`minimumAllocation`, Fifty Update) devient `safeAllocation(state, enemy, cible)` : plus petite flotte
   atteignant `CONFIG.combat.winChanceTarget` (≈ 80 %). `minimumAllocation` reste comme repli déterministe.
6. **Préréglages de flotte** (2 emplacements, petit extra QoL) dans la modale d'allocation.

### Garde-fous / tests

- `battle.test.js` : mêmes entrées + même graine ⇒ même journal ; pertes ≤ effectif engagé ;
  monotonie (plus de puissance ⇒ plus de victoires) ; test **statistique** à graines fixes :
  puissance ≥ défense ⇒ ≥ ~55 % de victoires, puissance ≤ 0,7 × défense ⇒ ≤ ~10 %.
- `balance.test.js` : PV/blindage valides, PV/attaque croissant, budget ennemi = `defenseRating`.
- **Tutoriel** : le premier combat du système 0 doit rester une victoire quasi certaine
  (garde dans `balance.test.js` : chance ≥ 99 % avec le pré-remplissage du tutoriel).
- Recalibrer `EXPLORATION.baseDefense` / `CONFIG.run.defenseGrowthPerLevel` pour que `simulate.mjs`
  garde son rythme à ±10 % (le pré-remplissage à 80 % demande ~15–25 % de puissance en plus).

---

## Fil rouge narratif

**Prémisse** : le Commandant (nom saisi à la création) pilote l'**arche-vaisseau** rescapée de la
**Rupture** qui a fait tomber le Sénat galactique (les _Archives du Sénat_ produisent déjà l'influence).
Les planètes « envahies » sont tenues par des forces qui ont profité du vide laissé. Les trois factions
sont trois **doctrines** que le Commandant adopte à chaque run (industrie, guerre, science). Chaque
**Ascension est un « Cycle »** : l'arche replie la réalité pour repartir en gardant la mémoire
(technologies, points d'ascension) — justification narrative du rogue-lite, révélée au chapitre 4.

**Ennemis = profils de composition** (chaque faction ennemie est une simple entrée de données) :

| Faction ennemie   | Composition / mécanique de combat                                                                   | Introduite |
| ----------------- | --------------------------------------------------------------------------------------------------- | ---------- |
| L'Essaim          | Nuées de drones fragiles, beaucoup de tirs ; punit les gros vaisseaux                               | MAJ 1      |
| Les Sentinelles   | Peu de bastions très blindés, ne poursuivent pas ; punissent les petits vaisseaux ; **négociables** | MAJ 2      |
| Corsaires du Vide | Esquive élevée, raids sur les systèmes conquis                                                      | MAJ 3      |
| Les Éveillés      | Nés de la matière noire : s'**adaptent** en cours de combat, drainent                               | MAJ 5      |
| L'Adversaire      | Boss final multi-phases                                                                             | MAJ 6      |

**Chapitres** (jalons **indicatifs**, à régler avec `simulate.mjs`) :

| Chapitre                | MAJ | Accès                                                   | Finale                                 | Choix (conséquence légère)                           |
| ----------------------- | --- | ------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------- |
| Prologue « Réveil »     | 1   | Nouvelle partie                                         | 1ᵉʳ système conquis                    | —                                                    |
| 1 « La Marée »          | 1   | 1ʳᵉ run terminée                                        | Planète-boss « Nid-mère » (système ~4) | —                                                    |
| 2 « Les Sentinelles »   | 2   | 5 systèmes conquis à vie + techno _Diplomatie spatiale_ | Bastion des Sentinelles                | Allier (→ faction **Gardiens**) / Détruire (→ butin) |
| 3 « Corsaires du Vide » | 3   | Niveau de joueur ~8                                     | Repaire des Corsaires                  | Enrôler / Écraser                                    |
| 4 « Cycles »            | 4   | 1ʳᵉ Ascension                                           | 3ᵉ Ascension                           | — (révèle la boucle)                                 |
| 5 « Le Chant sombre »   | 5   | Techno `darkMatterPhysics` + systèmes avancés           | Éveillé-prime                          | Résister / Composer                                  |
| 6 « L'Adversaire »      | 6   | ~5 Ascensions                                           | Cœur du Vide                           | Fin A / B / C                                        |

**Journal de bord** (écran depuis le tiroir) : entrées de texte révélées par jalons, une par
jalon (~4-6 par chapitre), + bestiaire des ennemis rencontrés. État : `state.story = { chapter, entries, flags }`
(sauvegarde v9) ; les choix sont mémorisés **par Cycle** (remis à zéro à l'Ascension pour encourager
à rejouer l'autre branche). Aucun contenu ne dépend d'un choix pour rester jouable : une faction
verrouillée par un choix a un repli (ex. Ascension ≥ 2) pour qu'aucun joueur ne rate définitivement du contenu.

---

## Feuille de route

| MAJ | Titre de travail     | Axe principal                            | Chapitre                  | Taille |
| --- | -------------------- | ---------------------------------------- | ------------------------- | ------ |
| 1   | **Combat vivant**    | Exploration & combat                     | Prologue + 1 « La Marée » | L      |
| 2   | **Grands Chantiers** | Production & économie                    | 2 « Les Sentinelles »     | M      |
| 3   | **Frontières**       | Exploration (monde) + combat tactique    | 3 « Corsaires du Vide »   | M      |
| 4   | **Héritages**        | Prestige & rejouabilité                  | 4 « Cycles »              | M      |
| 5   | **Le Chant sombre**  | Fin de partie (production + exploration) | 5                         | M      |
| 6   | **L'Adversaire**     | Narration & clôture                      | 6 + Épilogue              | M      |

Ordre voulu : le combat d'abord (il conditionne PV, ennemis, journal et toute la suite) ; l'économie
ensuite pour donner un débouché à l'influence ; le prestige une fois le socle de contenu large.

### MAJ 1 — « Combat vivant » _(schéma v9)_

- Tout le chantier phare ci-dessus (PV/blindage, ennemis, simulation seedée, journal, chance de victoire, préréglages).
- L'**Essaim** comme première faction ennemie ; planète-boss « Nid-mère ».
- **Journal de bord** (écran + Prologue + Chapitre 1, ~8 entrées) et `state.story`.
- Extras : option « animés / résumé », 4 succès de combat (Premier sang, Victoire sans perte, Écraseur d'Essaim…),
  une bulle de tutoriel sur « petits vs gros ».

#### Bilan d'implémentation de la MAJ 1

**Livré** (nom de code « Enhanced Combat », id `enhancedCombat` ; thème « Combat vivant ») :

- **Vaisseaux** : `hp` et `armorTier` (0-7) dans `data/fleet.js` ; règle `PV = attaque × (3,2 + 0,12 × palier)`,
  donc le ratio PV/attaque croît avec le palier. Effet `fleetDurability` (PV seuls) + compétence de run
  « Coques renforcées » ; les multiplicateurs de flotte s'appliquent à l'attaque **et** aux PV (invariant de Lanchester).
- **Ennemis** (`data/enemies.js`, `game/enemy-fleet.js`) : 5 classes, profils **Essaim / Forces d'occupation / Faune
  hostile / Nid-mère** ; le budget `defenseRating` est réparti entre les classes (Σ attaque = défense).
- **Simulation** (`game/battle.js`, `game/rng.js`) : pure, seedée, **par piles de classes** (des millions de vaisseaux sans
  surcoût) ; 1 tir par vaisseau et par round, esquive selon la taille, efficacité bornée par le blindage, surplus de dégâts
  à moitié perdu, épaves récupérées à 50 % (25 % en cas de défaite) ; **10 événements** pondérés (`data/combatEvents.js`).
- **Interface** : fenêtre de bataille animée (`ui/battle-log.js` — barres de structure, journal, Vitesse ×1/×2/×4, Passer,
  Échap), option « Journal animé / Résumé seulement » (appareil, `ui/combat-prefs.js`), `prefers-reduced-motion` ⇒ affichage
  immédiat ; fenêtre d'allocation enrichie (composition et indice de l'ennemi, **chance de victoire et pertes prévues**
  estimées par Monte-Carlo, « Recommandé » / « Tout engager », boutons collés en bas) ; PV affichés dans la fiche des vaisseaux.
- **Histoire** : `state.story` (entrées, bestiaire, boss vaincus) et `state.combatStats`, **schéma v9** (additif) ; Journal de
  bord (tiroir) avec prologue + chapitre 1 « La Marée » (8 entrées, rattrapées à la charge d'une ancienne sauvegarde) et
  bestiaire ; planète-boss **Nid-mère** (système 4, 2 phases, butin ×3, ajoutée après le tirage seedé) ; 4 succès de combat.
- **Équilibrage** : la chance de victoire monte vite autour d'un ratio puissance/défense de 1,15-1,3 ; il faut ≈ 1,3-1,7 × la
  défense pour 80 % de chances. `EXPLORATION.baseDefense` recalibré (12 → 9,4 ; avancé 22 → 17) : `npm run simulate` donne
  **27 min 40 → 30 min 03** jusqu'à la 1ʳᵉ Ascension (+ 9 %, cible ±10 %). Garde du système 0 : ≥ 93 % de victoire avec les
  2 chasseurs du tutoriel (≈ 95-97 % mesuré) ; parcours complet du tutoriel vérifié (`_tuto-run.mjs`).

**Reporté** (à reprendre dans une prochaine MAJ) : préréglages de flotte (2 emplacements) ; bulle de tutoriel « petits vs
gros » ; « Revoir » un combat depuis l'historique de la run (la graine est stockée, l'écran manque) ; icônes dédiées aux
événements de combat.

**À savoir** : la Nid-mère n'apparaît que dans les runs dont le système 4 est généré après la mise à jour (une run en cours
qui l'a déjà généré ne l'a pas). Le journal complet d'une bataille n'est pas sauvegardé (seule la graine l'est, dans `combatLog`).

### MAJ 2 — « Grands Chantiers » _(schéma v10)_

- **Mégastructures** (`src/data/megastructures.js`, propres à la run, 3-5 niveaux, coûts multi-ressources,
  effets dans le vocabulaire existant) : Sphère de Dyson (énergie), Ascenseur orbital (coût des vaisseaux),
  Forge-monde (métal/cristaux), Réseau des Archives (influence), **Chantier amiral** (`fleetDurability`),
  Anneau-monde (revenu des systèmes conquis). Section dans la Boutique (pas d'onglet).
- **Décrets du Sénat** : puits d'influence — politiques à double tranchant (ex. « Mobilisation » : +flotte,
  −production ; « Austérité » : −maintenance, −coût), 2 emplacements (3 avec une techno), payés en INF, changeables.
- **+6 générateurs** (16 → 22) pour combler les trous : **influence ×3** (Ambassade, Bureau des traités,
  Tribunal galactique), **énergie quantique ×2**, **matière noire ×1**.
- **+5 technologies** (Blindage composite → PV, Logistique orbitale, Diplomatie spatiale → Décrets,
  Ingénierie des mégastructures, Constitution galactique → +1 emplacement de décret).
- **Sentinelles** (profil ennemi blindé) + Chapitre 2 et son choix.

#### Bilan d'implémentation de la MAJ 2

**Livré** (nom de code « Civil Engineer », id `civilEngineer` ; thème « Grands Chantiers ») :

- **Mégastructures** (`data/megastructures.js`, `game/empire.js`) : 6 chantiers propres à la run, 3-4 niveaux, coût du niveau
  n = base × croissance^n en plusieurs ressources. Débloqués par la technologie *Ingénierie des mégastructures*, puis chacun
  par un seuil de production cumulée (la ligne est « teasée » avant). Effets dans le vocabulaire existant, agrégés par
  `economy.js#empireMultipliers` — **exactement ×1 en leur absence**, aucun chiffre existant ne bouge. Deux effets nouveaux :
  `explorationIncome` (revenu des systèmes conquis) et `lootMultiplier` (butin). Sphère de Dyson (énergie +50 %/niv.),
  Ascenseur orbital (coût des vaisseaux −8 %/niv.), Forge-monde (métal et cristaux +40 %/niv.), Réseau des Archives
  (influence +60 %/niv.), Chantier amiral (PV de flotte +15 %/niv.), Anneau-monde (revenu des systèmes +60 %/niv.).
- **Décrets du Sénat** (`data/decrees.js`) : 8 politiques **à double tranchant** (chacune a au moins un bonus et un malus,
  garanti par `balance.test.js`), payées en influence (30-50 INF), **2 emplacements** (+1 avec *Constitution galactique*),
  abrogation gratuite, ré-adoption payante ; remis à zéro à la fin de la run. Débloqués par *Diplomatie spatiale*.
- **+6 générateurs** (16 → 22) : influence ×3 (Ambassade payée en métal, Bureau des traités en antimatière, Tribunal galactique
  en énergie quantique), énergie quantique ×2 (Collisionneur de particules en antimatière, Extracteur du point zéro en énergie),
  matière noire ×1 (Archive interdite, payée en **influence** : première fois qu'elle sert de monnaie de construction).
- **+5 technologies** (13 → 18) : Blindage composite (PV ×1,25), Logistique orbitale (butin ×1,4, maintenance −10 %),
  Diplomatie spatiale, Ingénierie des mégastructures, Constitution galactique.
- **Sentinelles** : classe `sentinel` (blindage +3) et profil `sentinels` (peu de sentinelles très blindées + croiseurs),
  réglé au banc à quasi-parité avec les Forces d'occupation (un peu plus dur pour les petites flottes, parité vers un ratio de
  1,7). Elles tiennent toutes les forteresses galactiques et environ la moitié des planètes envahies des systèmes avancés
  (jamais le système 0, réservé à l'Essaim).
- **Négociation** : « Négocier · N INF » sur toute planète tenue par les Sentinelles (technologie *Diplomatie spatiale*).
  Coût = ⌈défense × phases restantes × 0,25⌉ INF, butin réduit de moitié, ni combat ni perte ; XP et point de compétence
  comme une victoire (`game/diplomacy.js`, `CONFIG.negotiation`).
- **Bastion des Sentinelles** (boss, système 9, 3 phases, butin ×3) et **choix du chapitre 2** : négocier = *Allier*
  (PV de flotte +25 % pour la run), vaincre par la force = *Détruire* (butin +25 % pour la run). Le choix est mémorisé
  **par Cycle** (`story.choices`, remis à zéro à l'Ascension) ; les entrées du Journal, elles, restent.
- **Histoire** : chapitre 2 « Les Sentinelles » (5 entrées ; s'ouvre avec 5 systèmes conquis à vie et *Diplomatie spatiale*),
  Sentinelles au bestiaire, 5 succès (Bâtisseur, Architecte de l'impossible, Législateur, Diplomate, Les portes du Bastion).
- **Interface** : deux sections dans la Boutique (« Chantiers », « Décrets du Sénat » — pas d'onglet) ; dans le tiroir d'un
  décret, bonus en vert et malus en rouge, et le résumé de la ligne passe à la ligne pour que le malus ne soit jamais tronqué
  sur 390 px ; bouton Négocier dans le détail d'un système ; notifications ; icônes dessinées à la main ; FR/EN.
- **Sauvegarde v10**, additive : `run.megastructures`, `run.decrees`, `story.choices`, `combatStats.systemsConquered` et
  `negotiations`. Une sauvegarde v9 se charge sans perte (testé et vérifié dans le navigateur).
- **Équilibrage** : `npm run simulate` donne **30 min 03 → 30 min 24** jusqu'à la 1ʳᵉ Ascension (+ 0,7 %, cible ±10 %) ;
  le bot glouton n'achète ni chantier ni décret (il ne met jamais rien de côté), la mesure ne dépend donc que des nouveaux
  générateurs et technologies. Mesuré à part : trois décrets bien choisis (Économie de guerre, Mobilisation, Propagande) dès
  leur déblocage raccourcissent la longue run d'environ **9 %** ; la technologie des mégastructures (40 k cristaux à mettre de
  côté) n'est atteignable qu'à ≈ 23 min de la longue run d'un bot optimisé, et les six chantiers au complet représentent
  ≈ 10 min de revenu à ce moment-là. La Sphère de Dyson sert surtout à alimenter l'Extracteur du point zéro (l'énergie est
  saturée à ce stade). Garde du système 0 et parcours du tutoriel (18 étapes) inchangés. 280 tests (dont `game/empire.test.js`).

**Reporté / à surveiller** : les coûts des chantiers et des décrets sont des estimations — un bot glouton ne peut pas les
évaluer, à recaler sur des retours de joueurs ; la faction *Gardiens du Sénat* (récompense de l'alliance) reste prévue pour la
MAJ 4 ; le tutoriel n'a pas de bulle sur les décrets.

**À savoir** : le Bastion n'apparaît que dans les runs dont le système 9 est généré après la mise à jour ; sur une ancienne
sauvegarde, `systemsConquered` démarre à 0 : le chapitre 2 demande donc 5 systèmes conquis *depuis* la mise à jour.

### MAJ 3 — « Frontières » _(schéma v11)_

- **5 archétypes de systèmes** (Ceinture d'astéroïdes, Nébuleuse, Trou noir, Épave de flotte, Station marchande)
  avec portraits (`planet-art.js`) et **nouveaux types de planète** : ruines (butin/lore), épave, anomalie
  (choix risqué), avant-poste fortifié.
- **Systèmes nommés uniques** (écrits à la main, sur le modèle du système 0) : Nid-mère, Bastion, Repaire ;
  chacun protégé par un test de garde. Fin du bouclage des noms par modulo.
- **Raids et garnison** : les Corsaires attaquent les systèmes conquis (revenu suspendu jusqu'à défense) ;
  une fraction de la flotte peut être placée **en garnison** (`garrisonPower`) → arbitrage attaque/défense.
- **Rôles de vaisseaux** : +4 vaisseaux (Escorteur — attire les tirs, Ravitailleur — répare par round,
  Porte-chasseurs — engendre des chasseurs, Bombardier) ⇒ pondération de ciblage / réparation dans `battle.js`.
- **Événements à choix** (5 → ~15, dont 6 avec deux options risque/gain) et **+3 objectifs de run**
  (« Survivre à N raids », « Conquérir sans perte », « Éliminer un boss »).
- Profil ennemi **Corsaires** + Chapitre 3 et son choix. Option « ordres de bataille » (retraite en cours de combat) :
  à étudier ici — nécessite de différer l'application du résultat (`run.pendingBattle`).

### MAJ 4 — « Héritages » _(schéma v12)_

- **Mutateurs de run** (`src/data/mutators.js`, ~8, choisis à l'écran de faction) : ennemis +30 % PV,
  maintenance ×2, production −20 %, etc., avec **multiplicateur de points d'ascension** — la difficulté
  optionnelle à la Hades. Niveaux de « Cycle » de difficulté.
- **2 nouvelles factions** : **Gardiens du Sénat** (PV/défense, débloqués par l'alliance avec les Sentinelles, repli Ascension ≥ 2)
  et **Consortium marchand** (influence/butin/échanges). **Mécanique signature** par faction (les 5) :
  ex. Légion de fer = critiques accrus, Collectif minier = filons sur les planètes minières,
  Ordre quantique = chance de doubler un événement.
- **Arbres de compétences structurés** : branches + prérequis + une **pierre angulaire** (niveau 1, puissante) au lieu d'une liste plate.
- **Succès étendus** 11 → ~35 par catégories, avec **récompenses** (titres de Commandant, thèmes, petits bonus permanents).
- **+4 améliorations communes** et **+4 récompenses d'Ascension** ; **Statistiques à vie** + historique des 10 dernières runs.
- Chapitre 4 : la boucle des Cycles.

### MAJ 5 — « Le Chant sombre » _(schéma v13)_

- **Ressource de palier 9 « Singularités »** (post-énergie quantique) : à valider d'abord sur le bandeau de ressources 390 px ;
  sinon repli = simple palier de générateurs T6 sans nouvelle ressource.
- **+4 générateurs T6**, **+3 mégastructures**, **+2 vaisseaux** (T9 Arche-noire, T10 Faucheur d'étoiles), **+5 technologies**.
- **3ᵉ réserve de systèmes « Abysses »** (débloquée par `voidTechnology`) : ~6 archétypes, ~20 noms.
- **Les Éveillés** : événements de combat d'**adaptation** (résistances changeantes) et de drain ; 2 boss.

### MAJ 6 — « L'Adversaire » _(schéma v14)_

- **Cœur du Vide** : dernier système écrit à la main, boss **multi-phases** avec ordres de bataille
  (retraite / focus / formation) si non livrés en MAJ 3.
- **Fins multiples** (3) selon les choix des chapitres + épilogue ; **Cycle infini** (mode post-fin à difficulté croissante).
- Option : **3ᵉ couche de prestige** (« Transcendance ») si le rythme des Ascensions le justifie.

### Réserve d'idées (non planifiées)

Ambiance sonore synthétisée en WebAudio (opt-in, aucune dépendance) · thèmes supplémentaires · skins de
vaisseau-mère débloqués par succès · codex des vaisseaux · auto-conquête (techno) pour les combats à ≥ 95 % de
chances · saison/événements de calendrier · défis quotidiens (sans serveur : graine par date).

---

## Fichiers critiques et éléments à réutiliser

| Sujet                             | Fichiers / fonctions existants                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Combat actuel à remplacer/étendre | `src/game/combat.js` (`committedFleetPower`, `minimumAllocation`, `resolveBattle`), `Engine#resolvePlanetCombat` (`src/game/engine.js:455`) |
| Aléa seedé                        | `mulberry32` dans `src/game/exploration.js`                                                                                                 |
| Événements pondérés (motif)       | `src/game/events.js#pickWeighted`, `src/data/events.js`                                                                                     |
| Vocabulaire d'effets              | `src/game/economy.js#applyLeveledEffect`, `techMultipliers`, `factionMultipliers`, `ascensionRewardMultipliers`                             |
| Prestige / fin de run             | `src/game/prestige.js` (`endRun`, `ascend`), `src/game/run.js#pickObjective`, `src/data/objectives.js`                                      |
| Systèmes / planètes               | `src/data/systems.js`, `src/game/exploration.js` (`ensureVisibleSystems`), `src/game/systems-map.js`                                        |
| Sauvegarde                        | `src/game/initial-state.js` (`SCHEMA_VERSION`), `src/game/save.js#mergeIntoShape`, `Engine#_scanAchievements`                               |
| UI modale / écrans                | `src/ui/modal.js#openPanel`, `fleet-allocation.js`, `battle-report.js`, `achievements-screen.js`, `options-screen.js`, `drawer.js`          |
| Icônes / portraits                | `src/ui/icons.js`, `icon-map.js`, `planet-art.js`                                                                                           |
| Annonce de MAJ                    | `src/data/updates.js`                                                                                                                       |
| Tests / outillage                 | `src/data/balance.test.js`, `src/game/combat.test.js`, `scripts/simulate.mjs`, `src/i18n/i18n.test.js`                                      |

**Checklist « ajouter un élément »** (par catégorie) : entrée dans `src/data/<catégorie>.js` → clés i18n FR + EN →
icône (`icons.js` + `icon-map.js`) → invariants dans `balance.test.js` → `npm run simulate` si l'économie est touchée.

---

## Vérification (à répéter à chaque MAJ)

1. `npm run lint && npm test && npm run build` — tous verts (parité i18n incluse).
2. `npm run simulate` avant/après : rythme de run et de 1ʳᵉ Ascension à ±10 % de la référence
   (en-tête de `scripts/simulate.mjs` : ~2 h 20 optimisé pour la 1ʳᵉ Ascension, ~40 min ensuite).
3. Garde du système 0 et parcours du tutoriel (`_tuto-run.mjs`) intacts.
4. Contrôle visuel 390×844 (mobile, gestes réels) et bureau, FR **et** EN, dans les thèmes existants
   (outillage noté dans la mémoire : Vite en polling sur `/mnt/c`, Playwright avec `libasound`).
5. Chargement d'une **ancienne sauvegarde** (v8, puis v9…) : aucune perte, jalons rattrapés, aucun reset.
6. Pour MAJ 1 en plus : journal jouable sur 390 px (Vitesse/Passer accessibles au pouce), `prefers-reduced-motion`,
   combat identique à graine égale (rejeu), chance de victoire estimée cohérente avec l'issue observée sur ~200 combats.

## Statut

| MAJ                 | État                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------- |
| 1 « Combat vivant » | Livrée sous le nom de code « Enhanced Combat » (2026-09-20) ; bilan dans la section MAJ 1 |
| 2 « Grands Chantiers » | Livrée sous le nom de code « Civil Engineer » (2026-09-20) ; bilan dans la section MAJ 2 |
| 3 à 6               | Cadrées à gros grain : chiffres et jalons à confirmer après l'équilibrage de la MAJ 2 |

Ce document est la source de vérité de la feuille de route : le mettre à jour à chaque MAJ livrée
(état, jalons réellement retenus, valeurs d'équilibrage finales).
