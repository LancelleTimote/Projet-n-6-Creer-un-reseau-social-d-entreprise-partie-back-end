//contient les fonctions qui s'appliquent aux différentes routes pour les utilisateurs
const express = require('express');
const router = express.Router();                        //on crée un router avec la méthode mise à disposition par Express
const userController = require('../controllers/user');  //contrôleur pour associer les fonctions aux différentes routes
const auth = require('../middleware/auth');             //on importe le middleware pour l'ajouter sur les routes que l'on veut protéger
const multer = require('../middleware/multer-config');  //on importe le middleware pour le téléchargement des images, pour la route post quand on crée un nouvel objet

router.get('/:id', auth, userController.getUserProfile);
router.put('/:id', auth, multer, userController.modifyUserProfile);
router.delete('/:id', auth, userController.deleteAccount);

module.exports = router;