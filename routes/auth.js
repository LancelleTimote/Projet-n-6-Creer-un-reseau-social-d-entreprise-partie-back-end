//contient les fonctions qui s'appliquent aux différentes routes pour la création et l'authentification
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth'); 

router.post('/signup', authController.signup);  //crée un nouvel utilisateur
router.post('/login', authController.login);    //connecte un utilisateur

module.exports= router;