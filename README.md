# Projet n°6 : Créer un réseau social d'entreprise (partie back-end)

![GitHub contributors](https://img.shields.io/github/contributors/LancelleTimote/Projet-n-6-Creer-un-reseau-social-d-entreprise-partie-back-end?color=green&style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/LancelleTimote/Projet-n-6-Creer-un-reseau-social-d-entreprise-partie-back-end?style=for-the-badge)
![GitHub repo size](https://img.shields.io/github/repo-size/LancelleTimote/Projet-n-6-Creer-un-reseau-social-d-entreprise-partie-back-end?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/LancelleTimote/Projet-n-6-Creer-un-reseau-social-d-entreprise-partie-back-end?style=for-the-badge)
![GitHub](https://img.shields.io/github/license/LancelleTimote/Projet-n-6-Creer-un-reseau-social-d-entreprise-partie-back-end?style=for-the-badge)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/timote-lancelle-devweb/)

## :mag: Aperçu

![Aperçu du site web](visuel_projet/visuel_projet.png)

## :bookmark_tabs: Sommaire
<ol>
    <li><a href="#sujet">Sujet</a></li>
    <li><a href="#demandes_respecter">Demandes à respecter</a></li>
    <li><a href="#objectifs_projet">Objectifs du projet</a></li>
    <li><a href="#technologies_utilisees">Technologies utilisées</a></li>
    <li><a href="#prerequis">Prérequis</a></li>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#utilisation_siteweb">Utilisation du site web</a></li>
    <li><a href="#auteurs_contributeurs">Auteurs et contributeurs</a></li>
    <li><a href="#licence">Licence</a></li>
</ol>

## :page_facing_up: 1. Sujet <a name = "sujet"></a>

Vous êtes développeur depuis plus d'un an chez CONNECT-E, une petite agence web regroupant une douzaine d'employés.

Votre directrice, Stéphanie, invite toute l'agence à prendre un verre pour célébrer une bonne nouvelle ! Elle vient de signer un contrat pour un nouveau projet ambitieux ! 🥂

Le client en question est Groupomania, un groupe spécialisé dans la grande distribution et l'un des plus fidèles clients de l'agence.

Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues. Le département RH de Groupomania a laissé libre cours à son imagination pour les fonctionnalités du réseau et a imaginé plusieurs briques pour favoriser les échanges entre collègues.

## :memo: 2. Demandes à respecter <a name = "demandes_respecter"></a>

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

## :checkered_flag: 3. Objectifs du projet <a name = "objectifs_projet"></a>

* Apprendre à utiliser MySQL tout en respectant les bonnes nomenclatures et pratiques.
* Gérer un stockage de données à l'aide de SQL.
* Personnaliser le contenu envoyé à un client web.
* Implémenter un stockage de données sécurisé en utilisant SQL.
* Authentifier un utilisateur et maintenir sa session.

## :computer: 4. Technologies utilisées <a name = "technologies_utilisees"></a>

* Node.js / Express.js
* MySQL
* Git & GitHub

## :exclamation: 5. Prérequis <a name = "prerequis"></a>

* Avoir Node.js et MySQL d'installés sur la machine.
* Avoir fait le necéssaire avec la partie front-end disponible ici : https://github.com/LancelleTimote/TimoteLancelle_7_27092021_frontend

## :wrench: 6. Installation <a name = "installation"></a>

* Cloner ce repository.
* Pour installer les différents packages, dans le terminal à partir du dossier back-end, exécuter npm install.
* Renommer le .envExemple en .env, et modifier les informations au besoin.
* Pour la BDD, utiliser celle dans le backend, dans le dossier database.
* Vérifier dans le backend, dans le dossier config, puis le fichier config.js, les informations correspondent à celle de la base de donnée que vous utilisez, ainsi que dans le fichier .env.
* Vérifier aussi dans le backend, dans le dossier models, puis le fichier index.js, à la ligne 7 il est indiqué la base de donnée qui sera utilisé, à modifier au besoin.
* Pour qu'un compte devienne administrateur, créez un compte, puis sur MySQL passer la colonne admin du compte de 0 à 1.

## :question: 7. Utilisation du site web <a name = "utilisation_siteweb"></a>

* Pour démarrer l'application, dans le terminal à partir du dossier back-end, exécuter nodemon server, le serveur doit fonctionner sur localhost avec le port par défaut 3000.
* Faire le necéssaire côté front-end.
* Ouvrir le navigateur et aller sur : http://localhost:8080/

## :beers: 8. Auteurs et Contributeurs <a name = "auteurs_contributeurs"></a>

Timoté Lancelle : [GitHub](https://github.com/LancelleTimote) / [LinkedIn](https://www.linkedin.com/in/timote-lancelle-devweb/)

## :page_with_curl: 9. Licence <a name = "licence"></a>

Distribué sous la licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.