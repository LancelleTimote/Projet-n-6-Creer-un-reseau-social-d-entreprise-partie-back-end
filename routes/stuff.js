// Création du router qui contient les fonctions qui s'appliquent aux différentes routes pour les stuffs
// Dans le routeur on ne veut QUE la logique de routing, ainsi la logique métier sera enregistrée dans le controller stuff.js

const express = require('express');
const router = express.Router();                        //on crée un router avec la méthode d'express
const stuffCtrl = require('../controllers/stuff');      //on importe les controllers, on associe les fonctions aux différentes routes
const auth = require('../middleware/auth');             //on importe le middleware pour l'ajouter sur les routes que l'on veut protéger
const multer = require('../middleware/multer-config');  //on importe le middleware pour le téléchargement des images, pour la route post quand on crée un nouvel objet

router.post('/', auth, multer, stuffCtrl.createStuff);      //route qui permet de créer "une stuff"
router.post('/:id/like', auth, stuffCtrl.rateOneStuff);     //route qui permet de gérer les likes des stuffs
router.put('/:id', auth, multer, stuffCtrl.modifyStuff);    //route qui permet de modifier "une stuff"
router.delete('/:id', auth, stuffCtrl.deleteStuff);         //route qui permet de supprimer "une stuff"
router.get('/:id', auth, stuffCtrl.getOneStuff);            //route qui permet de cliquer sur une des stuffs précise
router.get('/', auth, stuffCtrl.getAllStuffs);              //route qui permet de récupérer toutes les stuffs

module.exports = router;