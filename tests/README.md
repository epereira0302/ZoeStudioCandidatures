# Tests du site

Tests écrits selon la méthode du plugin ECC (Everything Claude Code) : `test-coverage` pour la couverture, `e2e-testing` pour les parcours Playwright. Ils vivent dans ce dossier pour ne rien ajouter au site en ligne (voir `.vercelignore`).

## Lancer

```sh
cd tests
npm install
npm test                 # données et fonctions, puis parcours dans le navigateur
npm run test:couverture  # parcours + rapport de couverture (seuil 80 % des lignes)
```

Le site est servi par `serveur.mjs` (avec les requêtes partielles dont les vidéos ont besoin). Les parcours tournent en format bureau (1440 × 900) et mobile (Pixel 7).

## Ce qui est vérifié

- `unitaires/contenus.test.mjs` : projets.json et site.json cohérents ; chaque planche, photo de grille, image de galerie, média de gabarit et fichier cité dans le HTML existe.
- `unitaires/donnees.test.mjs` : chemins des planches, adresses des projets, lecture des données.
- `e2e/accueil.spec.js` : sommaire, projets phares, pied de page, bandeau des logos.
- `e2e/projets.spec.js` : grille et filtres par catégorie.
- `e2e/projet.spec.js` : les 20 pages projet, projet introuvable, projets suivants (flèche, pause au survol, titre qui ne passe pas sous la pile).
- `e2e/columbus.spec.js` et `e2e/studio-zoe.spec.js` : modules interactifs des deux gabarits (vidéo du logo, carnet, testeur de Gyst, carte de fidélité…).
- `e2e/navigation.spec.js` : lien d’évitement, menu mobile au clavier, rideau, 404, pas de débordement horizontal.
- `e2e/animations-reduites.spec.js` : avec « réduire les animations », rien ne bouge seul et tout reste utilisable.

Chaque parcours échoue aussi si la page lève une erreur JavaScript ou écrit une erreur dans la console.

Rapports produits : `rapport-playwright/` et `rapport-couverture/` (non versionnés).
