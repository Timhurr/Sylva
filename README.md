# Sylva – V1 test terrain

Web-app installable (PWA) : carte des aires de bivouac et points d'eau (OpenStreetMap),
scan photo des plantes (Pl@ntNet), fiches espèces et techniques hors-ligne, bouton SOS.

## 1. Mettre en ligne (GitHub Pages, gratuit, ~10 min)

1. Créer un compte sur github.com si besoin, puis un dépôt **public** nommé `sylva`.
2. « Add file » → « Upload files » → glisser **tout le contenu** de ce dossier
   (index.html, app.js, data.js, styles.css, sw.js, manifest.webmanifest, dossier icons) → « Commit ».
3. Settings → Pages → Source : « Deploy from a branch », branche `main`, dossier `/ (root)` → Save.
4. Après 1–2 minutes, l'appli est en ligne sur `https://<ton-pseudo>.github.io/sylva/`.

## 2. Clé Pl@ntNet (pour le scan)

1. Créer un compte sur https://my.plantnet.org et récupérer la clé API (gratuite, 500 identifications/jour).
2. Dans les réglages du compte, si une liste de domaines autorisés existe, ajouter `<ton-pseudo>.github.io`.
3. Dans Sylva : roue crantée → coller la clé → Enregistrer.

## 3. Installer sur l'iPhone

Ouvrir l'adresse dans **Safari** → bouton Partager → « Sur l'écran d'accueil ».
Autoriser la localisation quand l'appli la demande.

## 4. Avant de partir (avec du réseau)

- Ouvrir l'appli une première fois pour qu'elle se mette en cache.
- Sur la carte, parcourir toute la zone du bivouac à plusieurs niveaux de zoom :
  seules les tuiles déjà affichées restent disponibles hors-ligne.
- Vérifier que les aires de bivouac et points d'eau s'affichent (bouton ↻ pour recharger).
- Tester un scan sur une plante du jardin.

## Mettre à jour

Remplacer les fichiers sur GitHub, puis changer `VERSION` dans `sw.js` pour forcer la mise à jour sur le téléphone.

## Pour reprendre le développement

Voir [`CLAUDE.md`](CLAUDE.md) : architecture, conventions, tests, publication et règles du projet.
