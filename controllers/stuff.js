const Thing = require('../models/thing');
const fs = require('fs');   //importation de file system du package node, pour avoir accès aux différentes opérations lié au système de fichiers

exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing); //pour extraire l'objet JSON du thing dans req.body
    delete thingObject._id;  //on enlève le champ id du corps de la requête, car le front-end renvoi un id qui n'est pas bon
    const thing = new Thing({ //création d'une nouvelle instance du model Thing
      ...thingObject, //permet de copier les champs qu'il y a dans le body de la request et il va détailler le titre, etc...
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //génération de l'url de l'image, req.protocol pour le http ou https, ensuite le host du serveur
                                                                                    //localhost:3000 mais pour un déploiement ça sera la racine du serveur, le dossier images, et le
                                                                                    //le nom du fichier
    });
    thing.save()  //permet d'enregistrer le thing dans la base de donnée, la méthode save renvoie une promise
    .then(() => res.status(201).json({ message: 'Objet enregistré !'})) //il faut renvoyer une réponse à la front-end, pour éviter l'expiration de la requête, code 201 pour une bonne
                                                                        //création de ressources, et envoie un message en json
    .catch(error => res.status(400).json({ error })); //on récupére l'erreur, on renvoie un code 400 avec un json de l'erreur
};

exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ?  //on crée un objet thingObject qui regarde si req.file existe ou non
    {
        ...JSON.parse(req.body.thing),  //s'il existe, on traite la nouvelle image, on récupère la chaîne de caractère, on la parse en objet
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`    //on modifie l'image URL
    } : { ...req.body };    //s'il n'existe pas, on traite simplement l'objet entrant, on prend le corps de la requête
    Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id }) //pour modifier un thing dans la base de donnée, le premier argument c'est l'objet de comparaison
    //pour savoir quel objet on modifie (celui dont l'id est égal à l'id qui est envoyé dans les paramètres de requête), le deuxième argument c'est la nouvelle version de l'objet
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })   //on trouve l'objet dans la bdd, on veut trouver celui qui a l'id qui correspond à celui dans les paramètres de la requête
        .then(thing => {    //quand on le trouve
            const filename = thing.imageUrl.split('/images/')[1];   //on extrait le nom du fichier à supprimer, le split va retourner un tableau de 2 éléments, 1er élément tout ce
                                                                    //qui est avant /images/, puis 2ème éléments tout ce qu'il y a après
            fs.unlink(`images/${filename}`, () => { //avec ce nom de fichier, on le supprime avec fs.unlink, le 1er argument c'est la chaîne de caractère qui correspond au chemin de
                                                    //l'image donc images/filename, et le 2ème argument c'est le callback (=>), ce qu'il faut faire une fois le fichier supprimé
                Thing.deleteOne({ _id: req.params.id }) //pour supprimer, qui prend l'objet de comparaison comme argument, comme updateOne, une fois que l'image est supprimer, on
                                                        //supprime l'objet dans la bdd
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));   //erreur 500 pour une erreur serveur
};

exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllThings = (req, res, next) => {
    Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}