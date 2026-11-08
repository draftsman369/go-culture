# Go'Cultur

Prototype cliquable d'une application de covoiturage vers les lieux culturels (musées, concerts, cinéma, théâtre) autour de Lens, dans les Hauts-de-France.

**Problématique :** en quoi une application mêlant partage de transports, rencontres et récompenses culturelles peut-elle répondre simultanément à la précarité des jeunes, à l'isolement social et à l'urgence climatique ?

## Ce que montre le prototype

- **Découverte** : des trajets proposés par des conducteurs, à faire défiler (garder, passer, revenir).
- **Recherche** de lieux culturels avec filtres.
- **Trajet partagé** vérifié : QR code au départ, proximité Bluetooth pendant le trajet.
- **Pass trajet** à présenter à la caisse pour obtenir une réduction.
- **Playlist du trajet** collaborative (Spotify simulé).
- **Quêtes du mois**, carte souvenir, équipages et geste solidaire (offrir sa place).
- **Offres et défis** des partenaires (cloche de l'accueil).
- **Trajets mixtes** (covoit, transports, bande à vélo ou en skate) avec le CO₂ économisé.
- **Mode simple** pour les seniors (persona René, 65 ans).

## Organisation des fichiers

```
index.html        la page (structure seulement)
css/style.css     tout le style
js/icons.js       icônes SVG et petites fonctions utilitaires
js/data.js        données de démo : lieux, conducteurs, sorties, CO2, offres et défis
js/magalie.js     parcours de Magalie (19 ans) : état et écrans
js/rene.js        parcours de René (65 ans, mode simple)
js/app.js         affichage, swipe, QR code et gestion des clics
images/           photos et logos
```

Les scripts sont chargés dans cet ordre dans `index.html` : chacun utilise ce que les précédents ont défini.

## Lancer le prototype

Ouvrir `index.html` dans un navigateur. Aucune installation n'est nécessaire.

## À savoir

Toutes les données (lieux, horaires, conducteurs, prix) sont des exemples. Rien n'est connecté à un vrai service (Spotify, billetterie, géolocalisation).
