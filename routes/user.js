const express = require('express'); //importation d'express (après l'avoir installer avec la console)
const router = express.Router();    //routeur express (routes dans notre routeur)
const userCtrl = require('../controllers/user');    //contrôleur pour associer les fonctions aux différentes routes

router.post('/signup', userCtrl.signup);    //post parce que le frontend va aussi envoyer des informations (mail et mdp)
router.post('/login', userCtrl.login);

module.exports = router;    //on exporte ce routeur