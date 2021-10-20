const express = require('express');
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

app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes); //enregistrement des routes, api/auth est la route attendu par le frontend, la racine de tout ce qui sera authentification

module.exports = app;