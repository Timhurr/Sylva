# CLAUDE.md : passation du projet Sylva

Ce fichier est lu automatiquement par Claude Code à l'ouverture du dépôt. Il contient tout ce qu'il faut pour reprendre le travail exactement là où il s'est arrêté, comme si c'était la même session. Lis-le en entier avant de toucher au code.

---

## 1. Avec qui tu travailles et comment

- **Tim**, francophone, porteur du projet. Le contexte personnel (métier, planning des sorties) n'est volontairement pas écrit ici : demande-le-lui si besoin.
- **Langue :** tout en français, tutoiement. Réponses courtes et directes : ce qui a changé, ce qu'il doit faire, puis une question s'il y a un vrai choix. Pas de récapitulatif des étapes techniques.
- **Il teste sur iPhone (Safari, appli installée sur l'écran d'accueil)** et sur PC. Il envoie souvent des captures d'écran sans texte : déduis la demande de l'image (bug à corriger, image à intégrer, idée à ajouter).
- **Images :** il génère les gravures lui-même avec ChatGPT à partir des prompts de l'atelier (`docs/atelier-images.html`), puis te les envoie. Identifie chaque image à son contenu et range-la sur la bonne fiche.
- **Publication :** le dépôt est configuré pour que chaque modification soit commitée et poussée tout de suite. Annonce toujours la version publiée (« v0.9.xx ») et dis-lui de fermer puis rouvrir l'appli.
- **Toujours vérifier que GitHub Pages a bien publié** après un push (voir §6). Une publication a déjà échoué silencieusement : Tim ne voyait pas la nouvelle version.
- Il préfère qu'on agisse plutôt qu'on demande. Mais quand une idée est risquée (sécurité, droits, coûts), dis-le franchement, propose une meilleure version, puis fais ce qu'il décide.
- Il apprécie qu'on corrige les erreurs de sécurité dans ce qu'il envoie (recettes, astuces vues sur les réseaux), en lui disant lesquelles et pourquoi.

## 2. Le projet

**Sylva** est une application web progressive (PWA) de bivouac et de survie, en JavaScript pur, sans framework ni étape de build.

- En ligne : https://timhurr.github.io/Sylva/ (GitHub Pages, branche `main`, racine du dépôt).
- Dépôt : `Timhurr/Sylva`, compte GitHub **personnel** de Tim.
- **Objectif central :** aider quelqu'un qui est **seul, sans secours joignables**, en Belgique (Ardenne) et en Europe de l'Ouest. Tout doit marcher **hors ligne**.

### Ce que fait l'appli (onglets)
- **Aujourd'hui :** prochaine sortie, météo locale, alertes météo et alertes de saison (« En ce moment »), espèces de saison, bouton **SOS** (112, coordonnées GPS, SMS).
- **Carte :** Leaflet. Fonds IGN Belgique, plus MapTiler Outdoor et Satellite si une clé MapTiler est enregistrée. Styles (Naturel, Terminal vert rétro en vectoriel OpenFreeMap, Parchemin, Nuit rouge). Couches aires de bivouac et points d'eau (OSM/Overpass), Services (magasins, santé…), **Chasse** (SPW Wallonie), Mes spots. Toucher la carte pour placer un point ou « Y aller ». Guidage GPS intégré (à pied, vélo, voiture ; OSRM en ligne, flèche-boussole hors ligne). Trajet du journal en rouge.
- **Scan (bouton central) :** identification de plantes par photo via Pl@ntNet (clé de l'utilisateur, gardée sur le téléphone).
- **Apprendre :** fiches (Savoir-faire, 15 catégories), espèces (plantes, champignons, animaux, poissons), Guide de survie (17 chapitres). **Outils de terrain :** Prendre le pouls (minuteur et caméra expérimentale), Niveau et relief (pente, cuvette ou crête), Valeur R (isolation du sol). **S'entraîner :** Quiz (3 niveaux), Défis et badges.
- **Bivouac :** prochaine sortie (lieu par recherche, spot ou position, avec sa météo et sa vérification de chasse), « Au programme » (recettes et fiches ajoutées, qui remplissent le sac), **Journal de bord** (trajet GPS, notes, photos), Sac à dos (checklist modifiable avec photos), Anciens bivouacs (note sur 5, commentaire, journal), Carnet de spots.
- Thème jour, nuit ou automatique. Mode « Seul, sans secours » ou « Secours joignables » sur les fiches de premiers secours.

## 3. Architecture

Pas de build : les fichiers sont servis tels quels. **L'ordre de chargement compte** (voir `index.html`, fin du fichier) :

```
leaflet (unpkg) → data.js → especes_plus.js → especes_champignons.js → especes_regions.js → techniques_plus.js
→ illus.js → images.js → guide.js → secours_isole.js → noeuds_plus.js → classiques.js → abris_plus.js
→ poissons.js → astuces.js → cuisine_jeux.js → rvalue.js → app.js
```

| Fichier | Rôle |
|---|---|
| `index.html` | Toute l'interface (vues, panneaux, fenêtres modales). |
| `styles.css` | Thème clair et nuit (`html[data-theme="nuit"]`), composants. Couleurs en variables CSS (`--accent`, `--surface`, `--muted`, `--line`…). |
| `app.js` | Toute la logique (~2 700 lignes, une seule IIFE). |
| `sw.js` | Service worker : cache de l'appli, des images, des tuiles de carte. |
| `data.js` | Base : `SYLVA_ESPECES`, `SYLVA_TECHNIQUES`, `SYLVA_CATEGORIES`. |
| `especes_*.js` | Espèces supplémentaires (plantes, champignons, régions). |
| `techniques_plus.js`, `classiques.js`, `abris_plus.js`, `noeuds_plus.js`, `secours_isole.js`, `poissons.js`, `astuces.js`, `cuisine_jeux.js`, `rvalue.js` | Fiches, chapitres et compléments ajoutés par thème. Chaque fichier pousse dans les tableaux globaux et relie ses fiches aux chapitres. |
| `guide.js` | `SYLVA_GUIDE` : les chapitres du guide. |
| `illus.js` | Illustrations SVG de secours (`SYLVA_ILLUS`), utilisées quand une fiche n'a pas de gravure. |
| `images.js` | `SYLVA_IMAGES` : liste des fichiers `img/*.webp`. **Généré** par `tools/add_images.py`. |
| `img/` | Gravures WebP (840 px max, qualité 58). |
| `docs/atelier-images.html` | L'atelier d'images : prompts ChatGPT par fiche, style imposé. |
| `docs/SOURCES.md` | Sources et licences des contenus. |
| `tools/` | Tests, ajout d'images, changement de version. |

### Modèles de données

**Fiche** (`SYLVA_TECHNIQUES`) :
```js
{ id, cat /* une des SYLVA_CATEGORIES */, titre, illus /* clé SVG de secours */, intro, etapes: [..],
  attention: [..], source, priorite?: true,
  isole?: [..] /* étapes « Seul, sans secours » */, alerte?: [..] /* signes qui doivent faire sortir */,
  recette?: { jeu, cuisson?, effet?, tags?: [], ingredients: [], niveau, niv } }
```

**Espèce** (`SYLVA_ESPECES`) : `{ cat, id, nom, latin, niveau: "ok"|"caution"|"danger"|"info", statut, saison, mois, zones, resume, identification, sosies: [{nom, niveau, diff}], usages, notes: {BE} }`. `cat` vaut plante, champignon, animal ou poisson.

**Chapitre** (`SYLVA_GUIDE`) : `{ id, titre, sections: [{ titre, p?: [], liste?: [], etapes?: [], encadre?: {type, titre, texte} }], fiches: [ids], especes?: [ids] }`.

Catégories actuelles : Priorités, Eau, Équipement, Feu, Abri, Nœuds, Orientation, Déplacement, Secours, Premiers secours, Nourriture, Pêche, Recettes du feu, Faune et traces, Éthique. Une nouvelle catégorie demande aussi un raccourci dans `index.html` (`.skill-grid`, `data-learn-fiches="<catégorie>"`).

### Utilitaires de `app.js`
`$`, `$all`, `esc` (échappement HTML, à utiliser **partout**), `norm` (minuscules sans accents), `uid`, `load(clé, défaut)` / `save(clé, valeur)` (localStorage JSON, protégés par try/catch), `toast`, `openModal` / `closeModal`, `showView`, `learnShow`, `openTechnique(id)`, `openEspece(id)`, `idbDo` (IndexedDB pour les photos), `resizeImage`, `spotPhotoUrl`, `distKm`, `fmtKm`, `refPoint`, `getTrip`, `getPlan`, `getChecklist`, `getSpots`, `getHist`, `TECHS`, `ESPECES`, `IMGS`, `me` (position `[lat, lon, précision]` ou `null`), `map`, `layers`.

Toutes les données utilisateur sont **sur le téléphone**, clés `sylva_*` dans localStorage (par exemple `sylva_trip`, `sylva_spots`, `sylva_checklist`, `sylva_plan`, `sylva_hist`, `sylva_journal`, `sylva_key` pour Pl@ntNet, `sylva_mtkey` pour MapTiler) et photos dans IndexedDB. Il n'y a **aucun serveur à nous**.

## 4. Images et atelier

- Nommage dans `img/` :
  - `<id>.webp` : image principale d'une fiche ou d'une espèce ;
  - `<id>_<n>.webp` : étape n ;
  - `<id>_seul_<n>.webp` : étape n du mode « Seul, sans secours » ;
  - `chap_<id>.webp` : couverture de chapitre.
- Ajouter des images : `python3 tools/add_images.py chemin/a.png rj_pemmican chemin/b.png ps_tique` (convertit, puis régénère `images.js`).
- **Style imposé** (dans tous les prompts) : gravure à la plume, hachures fines, lavis aquarelle sourd, papier parchemin vieilli, tons sépia chauds ; **une seule personne**, aucun compagnon ; **aucun texte**, lettre ni chiffre ; format paysage 4:3.
- **Nœuds :** les IA inventent les croisements. Méthode retenue : Tim fait le nœud avec une vraie corde, le photographie à chaque étape, et ChatGPT redessine la photo dans le style. Le prompt est dans la section « Nœuds : phase 2 » de l'atelier. Ne jamais générer de schéma de nœud en SVG ou en 3D : ça a été essayé et jugé faux.
- Après un ajout de fiche, ajoute son prompt dans `docs/atelier-images.html` (tableau `ITEMS` : `[fichier, groupe, titre, sujet en anglais, prioritaire 0/1, à vérifier 0/1]`). L'atelier est aussi publié comme artefact claude.ai dans le compte de Tim. Si tu n'y as pas accès, la copie du dépôt fait foi.
- Vérifie chaque image reçue : une image qui contredit la fiche (par exemple des champignons sauvages sur une recette « champignons du commerce ») doit être signalée à Tim.

## 5. Ajouter du contenu

- **Fiches ou recettes :** dans un fichier de thème existant (ou un nouveau fichier, à ajouter **à la fois** dans `index.html` avant `app.js` et dans la liste `LOCAL` de `sw.js`). Pousse dans `SYLVA_TECHNIQUES` en évitant les doublons d'`id`, puis relie aux chapitres (`fiches` d'un chapitre de `SYLVA_GUIDE`).
- **Recettes du feu** (`cuisine_jeux.js`) : inspirées de jeux vidéo, le jeu est cité avec la mention « Non officiel : Sylva n'est affiliée à aucun éditeur… ». Les textes sont réécrits, rien n'est copié. Chaque recette a un niveau 1 Novice, 2 Apprenti ou 3 Maître trappeur (tableau `NIV`).
- **Relis toujours la sécurité** de ce que Tim envoie et corrige-la en le lui disant. Points déjà rencontrés :
  - champignons : du commerce uniquement ;
  - volaille et porc cuits à cœur ;
  - ne jamais chauffer une boîte de conserve fermée ;
  - pas de pierre de rivière dans le feu ;
  - jerky et pemmican maison : se conservent quelques jours ou semaines, pas indéfiniment ;
  - pas d'eau bouillante dans les sachets plastique ;
  - if, muguet, colchique : sosies mortels ;
  - méthodes de pêche interdites (nasse, ligne à ressort) : réservées à une vraie détresse ;
  - un filtre à mèche ne purifie pas l'eau.

## 6. Version, tests, publication

1. **Changer la version à chaque publication** : `sh tools/bump.sh 0.9.54`. Ça met à jour `VERSION` dans `app.js` et le nom de cache dans `sw.js`. Sans ça, les iPhones gardent l'ancienne version. La version actuelle est dans `app.js`, ligne `var VERSION`.
2. **Tests** (Node et Playwright, Chromium déjà installé dans l'environnement Claude Code distant) :
   - `node tools/tests/fulltest.js` : 27 vérifications (navigation, fiches, scan simulé, météo simulée, thème nuit…). Tout doit être `OK`. La seule alerte tolérée est « Fiches sans illustration gravée », tant que Tim n'a pas envoyé l'image.
   - `node tools/tests/offline.js` : mode avion avec service worker. Toutes les images doivent être en cache (`imgs: N/N`).
   - Pour une nouvelle fonction, écris un petit test Playwright du même modèle (serveur local sur le port 8766, Leaflet simulé, services externes simulés avec `page.route`). L'environnement ne joint pas les services externes (MapTiler, SPW, OpenFreeMap…) : simule-les et dis à Tim ce qui reste à vérifier sur son iPhone.
3. **Commit** en français : `V0.9.xx : description courte`, avec les lignes d'attribution demandées par l'environnement.
4. **Push** sur `main`. GitHub répond parfois en erreur 500 : réessaie en boucle (jusqu'à 8 fois, 20 s d'écart).
5. **Mets à jour le journal de développement (§10)** à la fin de la session.
6. **Vérifie la publication** :
   ```sh
   gh api repos/Timhurr/Sylva/actions/runs --jq '.workflow_runs[0]|.head_sha[0:7]+" "+.status+" "+(.conclusion//"")'
   ```
   Attends `completed success` pour ton commit. En cas d'échec, pousse un commit vide pour relancer.

## 7. Règles non négociables

- **Aucune clé ni secret dans le dépôt** : il est public. Les clés Pl@ntNet et MapTiler sont saisies par l'utilisateur dans Réglages et gardées dans le localStorage du téléphone. Si Tim colle une clé dans la conversation, ne la mets pas dans le code : rappelle-lui de la coller dans Réglages. Aucune donnée personnelle de Tim (adresse e-mail, employeur) dans le dépôt.
- **Droits d'auteur :**
  - pas de copie de livres (par exemple *Bushcraft 101*, les guides de nœuds DK), de PDF protégés ni d'images trouvées sur TikTok ou les réseaux ;
  - on réécrit le savoir-faire avec nos mots, ou on s'appuie sur le domaine public (Nessmuk, Kephart, Beard…) ;
  - pas d'imitation de visuels de jeux : ni logos, ni personnages, ni interfaces. Par exemple, pas de Pip-Boy : à la place, le style original « Terminal ».
  - pas de photo de personnalité publique.
- **Sécurité médicale :** l'appli aide quelqu'un de seul, mais ne remplace pas les secours. Pas de diagnostic présenté comme sûr. Les mesures (pouls par caméra, relief) sont marquées « repère » ou « expérimental ». Toujours garder la voie vers le 112.
- **Pas d'IA qui invente des réponses** sur les urgences : un module « Demande à Sylva » a été fait puis retiré à la demande de Tim. Ne pas proposer de modèle de langage local pour les conseils médicaux.
- **Hors ligne d'abord :** toute nouvelle fonction doit avoir un comportement sans réseau (cache, message clair).
- **Accessibilité et iPhone :** zones tactiles larges, `aria-label` sur les boutons-icônes, pas de `alert()` bloquant hors confirmation, `inputmode="decimal"` en `type="text"` pour les nombres à virgule.

## 8. Services externes et licences

| Service | Usage | Remarque |
|---|---|---|
| IGN Belgique CartoWeb | Fond de carte par défaut | Données ouvertes, usage commercial possible. Zoom natif 17. |
| MapTiler (Outdoor, Satellite) | Fonds de carte avec la clé de l'utilisateur | Clé restreinte au domaine `timhurr.github.io` (et `?` pour les requêtes sans origine). Formule gratuite = usage personnel ; pour la version payante : formule Flex (30 $/mois, 25 000 sessions) et clé intégrée à l'appli. |
| OpenFreeMap + MapLibre GL (unpkg) | Style vectoriel « Terminal » | Gratuit, usage commercial autorisé. |
| Overpass (OpenStreetMap) | Bivouacs, points d'eau, services | Usage léger ; données ODbL à attribuer. |
| Nominatim | Recherche de lieu | 1 requête par seconde maximum. |
| Open-Meteo | Météo, altitude (relief) | Gratuit pour un usage non commercial : licence payante à prévoir. |
| OSRM (routing.openstreetmap.de, FOSSGIS) | Itinéraires à pied, vélo, voiture | Serveur de démonstration : prévoir un service payant pour une version commerciale. |
| Pl@ntNet | Identification des plantes | Clé de l'utilisateur ; licence commerciale à négocier avant la vente. |
| SPW Wallonie `APP_DNFEXT/CHASSE_DATEFERM` (couche 1, territoires) | Chasses annoncées et fermetures de chemins | Wallonie seulement. Le format exact des dates n'a pas pu être vérifié depuis l'environnement de test : `parseDates` accepte `JJ/MM/AAAA` et `AAAA-MM-JJ`. Carte officielle : https://portalarcgis.spw.wallonie.be/portail/apps/experiencebuilder/experience/?id=ef94a8903433442f8082f3cdf5c7d3bd |

Les fonds retirés à la demande de Tim sont OpenStreetMap standard, OpenTopoMap, Plan IGN France et le satellite Esri : ne pas les remettre sans qu'il le demande. L'idée d'utiliser Google Maps ou Google Places a été écartée : clé payante, conditions incompatibles avec le hors ligne.

## 9. Ce qui reste à faire

**Après le premier test terrain :**
- Confirmer avec Tim, sur son iPhone : l'alerte chasse sur le lieu (rouge, orange, verte ou message d'erreur), le niveau à bulle, le pouls par caméra, le guidage GPS en marche réelle, le journal de bord.
- Si l'alerte chasse ne correspond pas à la carte officielle, inspecter le format réel des champs `LISTOFDATE*` du service SPW et corriger `parseDates` / `chasseDates` dans `app.js`.
- Idées proposées et pas encore faites :
  - « Préparer la sortie » : télécharger d'un coup la carte, les services, la météo et la chasse d'une zone ;
  - annonces vocales du guidage ;
  - « Retour à la voiture » ;
  - message de sécurité à un proche (lieu, heure de retour prévue) ;
  - mode économie de batterie.

**Contenu :**
- Étapes illustrées des nœuds restants (voir « Nœuds : phase 2 » dans l'atelier), à partir des photos de Tim.
- Encadrés « Conseil de terrain » dans les fiches, d'après les retours du test.

**Avant de vendre Sylva :**
- Licences des services listés au §8 avant tout usage commercial.
- Conditions d'utilisation et avertissement médical.

## 10. Journal de développement

À mettre à jour **à la fin de chaque session de travail** (le plus récent en haut, quelques lignes) : ce qui a été fait, ce qui est en cours, ce que Tim doit vérifier sur son iPhone. C'est ce qui permet à une autre session de reprendre au milieu d'un chantier.

### 2026-11-10 · v0.9.56
- Ajouté dans Outils de terrain : Clarté de l'eau (photo d'une bouteille devant un trait noir, contraste et teinte → préfiltrage conseillé ; dit toujours de traiter l'eau), Ciel et soleil (photo vers le ciel, seuil d'Otsu sur le canal bleu → % de ciel ; course du soleil calculée pour le lieu et la date de la sortie), Télémètre (clinomètre : angles de visée du sommet et de la base via `deviceorientation`, caméra en fond ; distance d'un objet de hauteur connue, ou hauteur d'un arbre à distance connue avec rayon de chute). Réglages : export GPX et KML (spots, bivouac, voiture, trajet) pour ATAK, iTAK, Garmin, OsmAnd.
- Écartés à dessein (ne pas refaire sans en reparler avec Tim) : écoute acoustique de nuit (Safari coupe le micro écran verrouillé, et une fausse alerte ou une alerte manquée est dangereuse), diffusion CoT en UDP vers ATAK (impossible depuis un navigateur : l'export KML/GPX le remplace), détecteur magnétique de métaux ou de câbles (iPhone n'expose pas le magnétomètre au web, et promettre de détecter des munitions enfouies serait dangereux).
- À vérifier par Tim sur iPhone : autorisation caméra et capteurs du télémètre, résultats des photos d'eau et de ciel en conditions réelles, ouverture des fichiers GPX/KML.

### 2026-11-10 · v0.9.55
- Révision complète : 366 fiches, espèces et chapitres ouverts sans erreur ; tous les écrans en jour, nuit et économie, sur iPhone SE et 13 ; aucune erreur console ; mode avion OK (243/243 gravures). Zones tactiles des liens et puces agrandies (44 px utiles). « Préparer la sortie » vérifie aussi les gravures hors ligne, demande le stockage persistant et affiche la place occupée.
- Ajouté dans la fenêtre SOS : signal lumineux SOS en morse (blanc ou rouge, écran maintenu allumé), sifflet de détresse (3 coups à 3,15 kHz puis pause, Web Audio), « Mes infos d'urgence » (groupe sanguin, allergies, traitements, contact ; uniquement sur le téléphone, et conseil de remplir la fiche médicale iPhone).
- À vérifier par Tim sur iPhone : volume du sifflet (le bouton silencieux de l'iPhone coupe le son web), signal lumineux à luminosité maximale.

### 2026-11-10 · v0.9.54
- Fait : onglet Bivouac, « Préparer la sortie » (télécharge cartes IGN + MapTiler Outdoor sur 2,5 km aux zooms 11 à 16, météo, chasse, services, relief) ; « Prévenir un proche » (SMS avec lieu, coordonnées, retour prévu, alerte 2 h après) et « Je suis rentré » ; « Ma voiture est garée ici » et « Retour à la voiture » (guidage, marche hors ligne) ; économie de batterie (thème nuit forcé, GPS économe hors guidage, alerte 20 % là où l'API batterie existe, donc pas sur iPhone) ; annonces vocales du guidage (bouton 🔊 dans le panneau).
- À vérifier par Tim sur iPhone : envoi du SMS (format `sms:` iOS), voix en français pendant le guidage, durée et poids de « Préparer la sortie ».

### 2026-11-10 · v0.9.53
- Fait : calculateur de valeur R et fiche « Isolation du sol » (avec sa gravure) ; retrait de « Demande à Sylva » ; fonds de carte réduits à IGN Belgique, MapTiler Outdoor et MapTiler Satellite ; passation (ce fichier, `tools/`, `docs/BASCULE.md`, copie de l'atelier).
- En cours : rien.
- À vérifier par Tim sur iPhone : alerte chasse sur son lieu de bivouac (couleur et dates cohérentes avec la carte officielle SPW), niveau à bulle, pouls par caméra, guidage GPS en marchant, journal de bord pendant une sortie.

### 2026-11-09 · v0.9.34 à v0.9.52
- Raccourcis Savoir-faire, programme du bivouac qui remplit le sac, lieu et météo de la sortie, anciens bivouacs, guidage GPS (pied, vélo, voiture), services autour, recettes du feu (42 recettes et niveaux), journal de bord, quiz, badges, alertes de saison, chasse SPW, pouls, niveau et relief, MapTiler.

## 11. Basculer sur un autre compte

Voir `docs/BASCULE.md`.

## 12. Démarrer une nouvelle session

Message d'amorce que Tim peut envoyer à une nouvelle session Claude Code reliée à ce dépôt :

> Tu reprends le projet Sylva. Lis `CLAUDE.md` en entier (surtout le journal de développement), lance `node tools/tests/fulltest.js` pour vérifier que tout passe, puis dis-moi en trois lignes où on en est et ce que tu proposes en premier.

Ensuite, travaille comme décrit au §1 : en français, en tutoyant, réponses courtes, et toujours vérifier la publication.
