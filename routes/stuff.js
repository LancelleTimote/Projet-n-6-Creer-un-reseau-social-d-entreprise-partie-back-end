const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth'); //on importe le middleware pour l'ajouter sur les routes que l'on veut protéger

router.post('/', auth, stuffCtrl.createThing);    //l'url viser par l'application, correspondant à la route pour laquelle nous souhaitons enregistrer cet élément de middleware
router.put('/:id', auth, stuffCtrl.modifyThing);  //pour modifier un objet, :id dit a express que cette partie est dynamique
router.delete('/:id', auth, stuffCtrl.deleteThing);   //pour supprimer un objet
router.get('/:id', auth, stuffCtrl.getOneThing);  //pour récupérer un seul objet
router.get('/', auth, stuffCtrl.getAllThings);    //notre route get pour récupérer tous les objets

module.exports = router;