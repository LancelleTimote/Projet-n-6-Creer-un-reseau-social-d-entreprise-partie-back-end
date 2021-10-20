const express = require('express');
const path = require('path'); //nous donne accès au chemin de notre système de fichiers (comme on sait pas le chemin exact à l'avance pour le dossier images(express.static))
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');  //importation routes utilisateurs

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images'))); //répond aux requêtes envoyé à /images, express.static pour servir le dossier static images, __dirname pour le nom
                                                                    //du dossier dans lequel on va se trouver, auquel on rajoute images

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes); //enregistrement des routes, api/auth est la route attendu par le frontend, la racine de tout ce qui sera authentification

module.exports = app;