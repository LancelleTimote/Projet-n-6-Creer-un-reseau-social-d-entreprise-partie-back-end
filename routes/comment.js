const express = require('express');
const router = express.Router();                                //on crée un router avec la méthode d'express
const commentController = require('../controllers/comment');    //on importe les controllers, on associe les fonctions aux différentes routes
const auth = require('../middleware/auth');                     //on importe le middleware pour l'ajouter sur les routes que l'on veut protéger

router.post('/:postId', auth, commentController.createComment);
router.get('/:postId', auth, commentController.getAllComments);
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;