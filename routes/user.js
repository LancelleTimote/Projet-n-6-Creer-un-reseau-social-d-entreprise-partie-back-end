//contient les fonctions qui s'appliquent aux différentes routes pour les utilisateurs

const express = require('express');
const router = express.Router();                        //on crée un router avec la méthode mise à disposition par Express
const userController = require('../controllers/user');  //contrôleur pour associer les fonctions aux différentes routes
const passwordVerification = require('../middleware/passwordVerification');

//chiffre le mot de passe de l'utilisateur, ajoute l'utilisateur à la base dedonnées
router.post('/signup', passwordVerification, userController.signup);  //crée un nouvel utilisateur
//vérifie les informations d'identification de l'utilisateur, en renvoyant l'identifiant userID depuis la base de données et un TokenWeb JSON signé(contenant également l'identifiant userID)
router.post('/login', userController.login);    //connecte un utilisateur

module.exports = router;