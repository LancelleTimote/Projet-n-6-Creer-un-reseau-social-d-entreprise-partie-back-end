// Création du router qui contient les fonctions qui s'appliquent aux différentes routes pour les stuffs
// Dans le routeur on ne veut QUE la logique de routing, ainsi la logique métier sera enregistrée dans le controller stuff.js
const express = require('express');
const router = express.Router();                        //on crée un router avec la méthode d'express
const postController = require('../controllers/post');  //on importe les controllers, on associe les fonctions aux différentes routes
const likeController = require('../controllers/like');
const auth = require('../middleware/auth');             //on importe le middleware pour l'ajouter sur les routes que l'on veut protéger
const multer = require('../middleware/multer-config');  //on importe le middleware pour le téléchargement des images, pour la route post quand on crée un nouvel objet

router.post('', auth, multer, postController.createPost);
router.get('', auth, postController.getAllPosts);
router.put('/:postId', auth, multer, postController.modifyPost);
router.delete('/:postId', auth, postController.deletePost);
router.post('/:postId/like', auth, likeController.likePost);
router.get('/:postId/like', auth, likeController.getAllLike);

module.exports = router;