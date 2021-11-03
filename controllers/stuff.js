//on prend toute la logique métier pour la déporter dans le fichier stuff.js de controllers
//on ne garde que la logique de routing dans le fichier stuff.js du router. On importe aussi le model stuff
//on a ajouté le controller stuff avec une constante stuffCtrl dans le fichier stuff.js du router

const Stuff = require('../models/Stuff');   //on importe notre nouveau modèle pour l'utiliser dans l'application
const fs = require('fs');   //importation de file system du package node, pour avoir accès aux différentes opérations lié au système de fichiers (ici les téléchargements et modifications d'images)
const jwt = require('jsonwebtoken');
require('dotenv').config();

//création d'un stuff
exports.createStuff = (req, res, next) => {
    const stuffObject = JSON.parse(req.body.stuff); //on stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
    delete stuffObject._id;     //on supprime l'id généré automatiquement et envoyé par le front-end. L'id de la stuff est créé par la base MongoDB lors de la création dans la base
    const stuff = new Stuff({   //création d'une instance du modèle Stuff
        ...stuffObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`   //on modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
    });
    stuff.save()    //sauvegarde du stuff dans la base de données
    .then(() => res.status(201).json({ message: 'The stuff was created successfully !' }))  //on envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
    .catch(error => res.status(400).json({ error }));   //on ajoute un code erreur en cas de problème
};

//modification d'un stuff
exports.modifyStuff = (req, res, next) => {
    let stuffObject = {};
    Stuff.findOne({ _id: req.params.id })   //avant de modifier l'objet, on va le chercher pour obtenir l'url de l'image
    .then(stuff => {
        const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.tokenSecretKey);
        const userId = decodedToken.userId;
        if (stuff.userId === userId) {
            stuffObject = req.body.stuff ? { ...JSON.parse(req.body.stuff)} : {...req.body }
            if (req.file) {      //on crée un objet thingObject qui regarde si req.file existe ou non
                const filename = stuff.imageUrl.split('/images/')[1];    //on supprime l'ancienne image
                fs.unlinkSync(`images/${filename}`);
                stuffObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;  //on modifie l'image URL
            }
            Stuff.updateOne({ _id: req.params.id }, { ...stuffObject, _id: req.params.id }) //pour modifier dans la base de donnée
            .then(() => res.status(200).json({ message: 'The stuff has been changed !' }))
            .catch(error => res.status(400).json({ error }));
        } else {
            res.status(401).json({ error: 'Identifiant utilisateur invalide !' });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

//suppression d'un stuff
exports.deleteStuff = (req, res, next) => {
    Stuff.findOne({ _id: req.params.id })   //avant de supprimer l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
    .then(stuff => {
        const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.tokenSecretKey);
        const userId = decodedToken.userId;
        if (stuff.userId === userId) {
            const filename = stuff.imageUrl.split('/images/')[1];   //pour extraire ce fichier, on récupère l'url du stuff, et on le split autour de la chaine de caractères, donc le nom du fichier
            fs.unlink(`images/${filename}`, () => {                 //avec ce nom de fichier, on appelle unlink pour suppr le fichier
                Stuff.deleteOne({ _id: req.params.id })             //on supprime le document correspondant de la base de données
                    .then(() => res.status(200).json({ message: 'The stuff has been removed !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        } else {
            res.status(401).json({ error: 'Identifiant utilisateur invalide !' });
        }
    })
    .catch(error => res.status(500).json({ error }));
};

//récupère un stuff grâce à son id depuis la bdd
exports.getOneStuff = (req, res, next) => {
    Stuff.findOne({ _id: req.params.id })   //on utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la stuff soit le même que le paramètre de requêt
    .then(stuff => res.status(200).json(stuff))         //si ok on retourne une réponse et l'objet
    .catch(error => res.status(404).json({ error }));   //si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
};

//récupère tous les stuffs
exports.getAllStuffs = (req, res, next) => {
    Stuff.find()    //on utilise la méthode find pour obtenir la liste complète des stuffs trouvées dans la base, l'array de toutes les sauves de la base de données
    .then(stuffs => res.status(200).json(stuffs))       //si OK on retourne un tableau de toutes les données
    .catch(error => res.status(400).json({ error }));   //si erreur on retourne un message d'erreur
};

//fonction d'évaluation des stuffs (like ou dislike)
//3 conditions possible car voici ce qu'on reçoit du frontend, la valeur du like est soit: 0, 1 ou -1 (req.body.like)
//un switch statement est parfaitement adapté
exports.rateOneStuff = (req, res, next) => {
    Stuff.findOne({_id: req.params.id})
    .then(stuff => { 
        switch (req.body.like) {
            case 0:                                                                 //si l'utilisateur enlève son like ou dislike
                if (stuff.usersLiked.includes(req.body.userId)) {                   //on vérifie si le user a déjà like ce stuff
                    Stuff.updateOne({ _id: req.params.id }, {                       //on décrémente la valeur des likes de 1 (soit -1)
                    $inc: { likes: -1 },                                            //si oui, on va mettre à jour le stuff avec le _id présent dans la requête
                    $pull: { usersLiked: req.body.userId },                         //on retire l'utilisateur du tableau
                    _id: req.params.id})
                    .then(() => res.status(201).json({ message: "Like successfully canceled !" }))   //code 201: created
                    .catch(error => res.status(400).json({ error }));                               //code 400 : bad request

                }else if (stuff.usersDisliked.includes(req.body.userId)){           //on vérifie si l'utilisateur a déjà dislike ce stuff
                    Stuff.updateOne({ _id: req.params.id }, {
                    $inc: { dislikes: -1 },
                    $pull: { usersDisliked: req.body.userId },
                    _id: req.params.id})
                    .then(() => res.status(201).json({ message: "Dislike successfully canceled !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            break;
            
            case 1:                                                         //si l'utilisateur like le stuff
                if (!stuff.usersLiked.includes(req.body.userId) && !stuff.usersDisliked.includes(req.body.userId)) {    //on vérifie si l'utilisateur n'a pas déjà like ou dislike ce stuff
                    Stuff.updateOne({ _id: req.params.id }, {               //on recherche le stuff avec le _id présent dans la requête
                    $inc: { likes: 1 },                                     //on incrémente de 1 la valeur de likes
                    $push: { usersLiked: req.body.userId },                 //on ajoute l'utilisateur dans le array usersLiked
                    _id: req.params.id })
                    .then(() => res.status(201).json({ message: "Like successfully added !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            break;
            
            case -1:                                                        //si utilisateur dislike le stuff
                if (!stuff.usersDisliked.includes(req.body.userId) && !stuff.usersLiked.includes(req.body.userId)) {    //on vérifie si l'utilisateur n'a pas déjà dislike ou like ce stuff
                    Stuff.updateOne({ _id: req.params.id }, {               //on recherche le stuff avec le _id présent dans la requête
                    $inc: { dislikes: 1 },                                  //on incrémente de 1 la valeur de dislikes
                    $push: { usersDisliked: req.body.userId },              //on rajoute l'utilisateur à l'array usersDiliked
                    _id: req.params.id })
                    .then(() => res.status(201).json({ message: "Dislike successfully added !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            break;

            default:
                throw("Impossible to react on this stuff, try again later !") //on envoie l'exception
        }
    })
    .catch(error => res.status(400).json({ error }));    
  };