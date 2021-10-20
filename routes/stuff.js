const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth'); //on importe le middleware pour l'ajouter sur les routes que l'on veut protéger
const multer = require('../middleware/multer-config'); //on importe le middleware pour le téléchargement des images, pour la route post quand on crée un nouvel objet

router.post('/', auth, multer, stuffCtrl.createThing);    //l'url viser par l'application, correspondant à la route pour laquelle nous souhaitons enregistrer cet élément de middleware
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);   //pour supprimer un objet
router.get('/:id', auth, stuffCtrl.getOneThing);  //pour récupérer un seul objet
router.get('/', auth, stuffCtrl.getAllThings);    //notre route get pour récupérer tous les objets

module.exports = router;