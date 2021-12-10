//app.js fait appel aux différentes fonctions implémentées dans l'APi : Accès aux images, aux route User, aux route Stuff

//import des modules npm - Ajout des plugins externes
const express = require('express');

//pour extraire l'objet JSON de la demande POST provenant de l'application front-end (anciennement body parser intégré à express)
const app = express();

//on donne accès au chemin de notre système de fichier
const path = require('path'); //plugin qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const helmet = require('helmet');
require('dotenv').config();

//middleware Header pour contourner les erreurs en débloquant certains systèmes de sécurité CORS, afin que tout le monde puisse faire des requetes depuis son navigateur
app.use((req, res, next) => {
    //on indique que les ressources peuvent être partagées depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    //on indique les entêtes qui seront utilisées après la pré-vérification cross-origin afin de donner l'autorisation
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //on indique les méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(helmet());

app.use(express.json());

//gestion de la ressource image de façon statique
//midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

module.exports = app;