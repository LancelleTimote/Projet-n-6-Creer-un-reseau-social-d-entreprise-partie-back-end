# Création d'un réseau social d'entreprise pour Groupomania

## Partie back-end

## Sujet

Vous êtes développeur depuis plus d'un an chez CONNECT-E, une petite agence web regroupant une douzaine d'employés. Votre directrice, Stéphanie, invite toute l'agence à prendre un verre pour célébrer une bonne nouvelle ! Elle vient de signer un contrat pour un nouveau projet ambitieux ! Le client en question est Groupomania, un groupe spécialisé dans la grande distribution et l'un des plus fidèles clients de l'agence.
Le client souhaite que ses employés écrivent et/ou partagent des articles avec leurs collègues sur des sujets qui les intéressent comme pour Reddit.

## Demandes à respecter

* L’utilisateur doit pouvoir requêter les données requises depuis SQL et soumettre ces changements à la base de données SQL.
* Les données de connexion doivent être sécurisées.
* La web app doit pouvoir se connecter et se déconnecter de l’application.
* La session de l’utilisateur doit persister pendant qu’il est connecté.
* L'utilisation d'un framework pour le front-end, comme par exemple Vue.js, React, est obligatoire.
* Le projet doit être codé en Javascript.
* Les pages doivent respecter les standards WCAG.
* La présentation des fonctionnalités doit être simple.
* L'utilisation du site doit être simple et possible depuis un téléphone mobile.
* Le profil doit contenir très peu d’informations pour que sa complétion soit rapide.
* La suppression du compte doit être possible.
* Les utilisateurs doivent pouvoir publier des contenus multimédias.
* Les utilisateurs doivent pouvoir publier des textes.
* Les utilisateurs doivent pouvoir facilement repérer les dernières participations sur le réseau social.
* Il doit être possible de modérer les interactions des utilisateurs.

## Technologies utilisées

* Node.js
* Express.js
* MySQL

## Prérequis

* Avoir Node.js et MySQL d'installés sur la machine.
* Avoir fait le necéssaire avec la partie front-end disponible ici : https://github.com/LancelleTimote/TimoteLancelle_7_27092021_frontend

## Installation

* Cloner ce repository.
* Pour installer les différents packages, dans le terminal à partir du dossier back-end, exécuter npm install.
* Renommer le .envExemple en .env, et modifier les informations au besoin.
* Pour la BDD, utiliser celle dans le backend, dans le dossier database.
* Vérifier dans le backend, dans le dossier config, puis le fichier config.js, les informations correspondent à celle de la base de donnée que vous utilisez, ainsi que dans le fichier .env.
* Vérifier aussi dans le backend, dans le dossier models, puis le fichier index.js, à la ligne 7 il est indiqué la base de donnée qui sera utilisé, à modifier au besoin.
* Pour qu'un compte devienne administrateur, créez un compte, puis sur MySQL passer la colonne admin du compte de 0 à 1.
* Ensuite pour démarrer l'application, dans le terminal à partir du dossier back-end, exécuter nodemon server, le serveur doit fonctionner sur localhost avec le port par défaut 3000.

## Utiliser l'application

Ouvrir le navigateur et aller sur : http://localhost:8080/