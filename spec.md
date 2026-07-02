Tu es mon assistant de développement senior React / TypeScript.

Je veux développer une petite PWA mobile-first appelée **Le Poussin Observateur**.

Objectif : créer un carnet d’observation d’oiseaux utilisable sur iPhone via Safari, installable sur l’écran d’accueil, utilisable hors ligne, sans backend et sans compte utilisateur.

L’application doit permettre d’enregistrer les oiseaux observés pendant des balades, randonnées ou week-ends vélo.

Stack souhaitée :

* Vite
* React
* TypeScript
* Tailwind CSS
* React Router
* Dexie.js pour IndexedDB
* vite-plugin-pwa pour rendre l’application installable/offline
* éventuellement lucide-react pour les icônes
* éventuellement date-fns pour les dates

Contraintes importantes :

* Application mobile-first, agréable sur iPhone.
* Design doux, nature, carnet de voyage.
* Palette : vert sauge, beige papier, bleu rivière, touches terracotta.
* Pas de backend.
* Données stockées localement dans IndexedDB.
* Prévoir export JSON pour éviter la perte de données.
* Code propre, modulaire, typé, maintenable.
* Architecture par features.
* Ne pas faire une architecture trop complexe type clean architecture.
* Priorité à une V1 finissable rapidement.

Fonctionnalités V1 obligatoires :

1. Page Accueil

   * Afficher le nombre total d’observations.
   * Afficher le nombre d’espèces différentes vues.
   * Afficher la dernière observation.
   * Bouton principal “Ajouter une observation”.
   * Petite phrase douce / nature.

2. Ajouter une observation

   * Espèce observée.
   * Date et heure, préremplies avec la date actuelle.
   * Lieu texte.
   * Nombre d’individus.
   * Comportement : posé, en vol, chante, pêche, se nourrit, autre.
   * Habitat : lac, rivière, forêt, champ, ville, montagne, zone humide, autre.
   * Notes libres.
   * Possibilité d’utiliser la géolocalisation si le navigateur le permet.
   * Photo optionnelle si faisable simplement, sinon préparer le modèle sans bloquer la V1.

3. Liste des observations

   * Liste chronologique des observations.
   * Carte visuelle simple pour chaque observation.
   * Accès à une fiche détail.
   * Suppression d’une observation.
   * Modification d’une observation si possible.

4. Liste des espèces vues

   * Afficher chaque espèce unique observée.
   * Afficher le nombre d’observations par espèce.
   * Afficher la première date d’observation.

5. Sorties

   * Pouvoir créer une sortie : par exemple “ViaRhôna sud”, “Miribel-Jonage”, “Dombes”.
   * Pouvoir associer une observation à une sortie.
   * Afficher les observations d’une sortie.

6. Réglages

   * Exporter les données en JSON.
   * Importer les données depuis un JSON.
   * Supprimer toutes les données avec confirmation.
   * Afficher une petite section “À propos”.

Modèle de données attendu :

Observation :

* id: string
* speciesName: string
* observedAt: string
* locationName?: string
* latitude?: number
* longitude?: number
* count?: number
* behavior?: string
* habitat?: string
* notes?: string
* photo?: string
* outingId?: string
* createdAt: string
* updatedAt: string

Outing :

* id: string
* name: string
* startedAt: string
* endedAt?: string
* locationName?: string
* notes?: string
* createdAt: string
* updatedAt: string

BirdSpecies :

* id: string
* commonName: string
* scientificName?: string
* family?: string
* emoji?: string

L’application doit proposer une liste locale d’espèces communes pour commencer, mais permettre aussi de saisir librement une espèce non présente dans la liste.

Liste d’espèces initiale :

* Martin-pêcheur d’Europe
* Héron cendré
* Grande aigrette
* Aigrette garzette
* Grèbe huppé
* Canard colvert
* Foulque macroule
* Gallinule poule-d’eau
* Grand cormoran
* Milan noir
* Buse variable
* Faucon crécerelle
* Rougegorge familier
* Mésange charbonnière
* Mésange bleue
* Merle noir
* Pic vert
* Pic épeiche
* Hirondelle rustique
* Martinet noir
* Bergeronnette grise
* Guêpier d’Europe
* Héron pourpré
* Nette rousse

Architecture souhaitée :

src/

* app/

  * App.tsx
  * router.tsx
  * providers.tsx

* components/

  * layout/

    * AppLayout.tsx
    * BottomNav.tsx
    * Header.tsx
  * ui/

    * Button.tsx
    * Card.tsx
    * Input.tsx
    * Select.tsx
    * Textarea.tsx
    * Badge.tsx
    * EmptyState.tsx

* data/

  * birdSpecies.ts
  * behaviors.ts
  * habitats.ts

* db/

  * database.ts
  * schema.ts

* features/

  * home/

    * pages/HomePage.tsx
    * components/StatsCard.tsx
    * components/LastObservationCard.tsx

  * observations/

    * pages/ObservationsPage.tsx
    * pages/AddObservationPage.tsx
    * pages/EditObservationPage.tsx
    * pages/ObservationDetailPage.tsx
    * components/ObservationForm.tsx
    * components/ObservationCard.tsx
    * components/ObservationList.tsx
    * services/observationService.ts
    * hooks/useObservations.ts
    * types.ts

  * species/

    * pages/SpeciesPage.tsx
    * pages/SpeciesDetailPage.tsx
    * components/SpeciesCard.tsx
    * services/speciesService.ts
    * types.ts

  * outings/

    * pages/OutingsPage.tsx
    * pages/AddOutingPage.tsx
    * pages/OutingDetailPage.tsx
    * components/OutingCard.tsx
    * components/OutingForm.tsx
    * services/outingService.ts
    * types.ts

  * settings/

    * pages/SettingsPage.tsx
    * services/exportService.ts
    * services/importService.ts

* hooks/

  * useGeolocation.ts
  * useDebounce.ts

* lib/

  * date.ts
  * id.ts
  * validation.ts

* styles/

  * index.css

Travail demandé :

1. Commence par créer la structure du projet.
2. Installe/configure les dépendances nécessaires.
3. Configure Tailwind.
4. Configure la PWA avec manifest, icônes placeholder, nom de l’app, thème et service worker.
5. Crée la base Dexie avec les tables observations et outings.
6. Crée les types TypeScript.
7. Crée les services de lecture/écriture dans IndexedDB.
8. Crée le layout mobile avec header et bottom navigation.
9. Crée les pages principales.
10. Crée les formulaires.
11. Ajoute les fonctions export/import JSON.
12. Ajoute des empty states propres.
13. Ajoute quelques données de démo uniquement si utile pour tester, mais pas en dur dans la base en production.
14. Vérifie que le projet build sans erreur TypeScript.

Ne génère pas une solution bâclée. Travaille par petites étapes cohérentes.

À chaque étape :

* explique brièvement ce que tu fais ;
* crée ou modifie les fichiers nécessaires ;
* garde le code propre ;
* évite les dépendances inutiles ;
* assure-toi que l’application reste simple et utilisable sur mobile.

Priorité absolue :
avoir une V1 fonctionnelle, jolie, installable en PWA et capable d’enregistrer, lister, modifier, supprimer, exporter et importer des observations d’oiseaux.

Avance étape par étape.

Ne code pas toute l’application en une seule réponse.

Commence uniquement par :

1. créer/configurer le projet Vite React TypeScript ;
2. installer les dépendances ;
3. configurer Tailwind ;
4. configurer la PWA ;
5. créer l’arborescence de base.

Ensuite, attends ma validation avant de passer à la base Dexie et aux écrans.
