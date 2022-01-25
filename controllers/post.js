const fs = require('fs');   //importation de file system du package node, pour avoir accès aux différentes opérations lié au système de fichiers (ici les téléchargements et modifications d'images)
const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

//création d'un nouveau message
exports.createPost = (req, res, next) => {
    const postObject = req.file ?
    {
    content: req.body.content,
    imagePost: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.tokenSecretKey);
    const userId = decodedToken.userId;
    if(postObject.content === null || postObject.content === '') {     //vérification si tous les champs complets
        if(postObject.imagePost != null) {
            const filename = postObject.imagePost.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
            return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
        } else {
            return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
        }
    } else if(postObject.content.length <= 2) {      //contrôle longueur du titre et contenu du message
        if(postObject.imagePost != null) {
            const filename = postObject.imagePost.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
            return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
        } else {
            return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
        }
    } else {
        db.User.findOne({
            where: { id: userId }
        })
        .then(userFound => {
            if(userFound) {
                const post = db.Post.build({
                    content: req.body.content,
                    imagePost: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: req.body.imagePost,
                    userId: userFound.id
                })
                post.save()
                .then(() => res.status(200).json({ message: 'Votre message a été créé avec succès !' }))
                .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite pendant la création du message, veuillez recommencer ultérieurement.' }));
            } else {
                return res.status(401).json({ error: 'Utilisateur inconnu !' })
            }
        })
        .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
    }
};

//affichage tous les messages
exports.getAllPosts = (req, res, next) => {
    db.Post.findAll({
        order: [['createdAt', "DESC"]] ,
        include: [{
            model: db.User,
            attributes: [ 'lastName', 'firstName', 'profileAvatar' ]
        },{
            model: db.Comment
        }]
    })
    .then(postFound => {
        if(postFound) {
            res.status(200).json(postFound);
        } else {
            res.status(401).json({ error: 'Aucun message trouvé !' });
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite pendant l\'affichage des messages, veuillez recommencer ultérieurement.' }));
}

//modification d'un message
exports.modifyPost = (req, res, next) => {
    const postObject = req.file ?
    {
    content: req.body.content,
    imagePost: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    db.Post.findOne({
        where: {  id: req.params.postId },
    })
    .then(postFound => {
        if(postObject.content === null || postObject.content === '') {     //vérification si le post contient quelque chose
            if (postObject.imagePost != null) {
                const filename = postObject.imagePost.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`);
                return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
            } else {
                return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
            }
        } else if(postObject.content.length <= 2) {      //contrôle longueur contenu du message
            if (postObject.imagePost != null) {
                const filename = postObject.imagePost.split('/images/')[1];
                fs.unlinkSync(`images/${filename}`);
                return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
            } else {
                return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
            }
        } else if(postFound && postFound.imagePost !== null && postObject.imagePost != null) {
            const filename = postFound.imagePost.split('/images/')[1];   //on supprime l'ancienne image
            fs.unlink(`images/${filename}`, () => {
                db.Post.update(postObject, {
                    where: { id: req.params.postId}
                })
                .then(post => res.status(200).json({ message: 'Votre message a été modifié avec succès !' }))
                .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite pendant la modification de votre message, veuillez recommencer ultérieurement.' }))
            })
        } else if(postFound && postFound.imagePost !== null && postObject.imagePost == null) {
            db.Post.update(postObject, {
                where: { id: req.params.postId}
            })
            .then(post => res.status(200).json({ message: 'Votre message a été modifié avec succès !' }))
            .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite pendant la modification de votre message, veuillez recommencer ultérieurement.' }))
        } else if(postFound) {
            db.Post.update(postObject, {
                where: { id: req.params.postId}
            })
            .then(post => res.status(200).json({ message: 'Votre message a été modifié avec succès !' }))
            .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite pendant la modification de votre message, veuillez recommencer ultérieurement.' }))
        } else {
            res.status(401).json({ error: 'Aucun message trouvé !' });
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}

//suppression d'un message
exports.deletePost = (req, res, next) => {
    db.Post.findOne({
        where: {  id: req.params.postId },
    })
    .then(postFound => {
        if(postFound) {
            if(postFound.imagePost != null) {
                const filename = postFound.imagePost.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    db.Post.destroy({ 
                        where: { id: req.params.postId } 
                    })
                    .then(() => res.status(200).json({ message: 'Votre message a été supprimé avec succès !' }))
                    .catch(() => res.status(500).json({ error : 'Une erreur s\'est produite pendant la suppression de votre message, veuillez recommencer ultérieurement.' }));
                })
            } else {
                db.Post.destroy({ 
                    where: { id: req.params.postId } 
                })
                .then(() => res.status(200).json({ message: 'Votre message a été supprimé avec succès !' }))
                .catch(() => res.status(500).json({ error : 'Une erreur s\'est produite pendant la suppression de votre message, veuillez recommencer ultérieurement.' }));
            }
        } else {
            return res.status(401).json({ error: 'Aucun message trouvé !'})
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}