const fs = require('fs');   //importation de file system du package node, pour avoir accès aux différentes opérations lié au système de fichiers (ici les téléchargements et modifications d'images)
const jwt = require('jsonwebtoken');
const db = require('../models');
require('dotenv').config();

//Création d'un nouveau message
exports.createPost = (req, res, next) => {   
    const content = req.body.content;
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.tokenSecretKey);
    const userId = decodedToken.userId;
    //Vérification tous les champs complet
    if (content == null || content == '') {
        return res.status(400).json({ error: 'All fields must be completed !' });
    } 
    //Contrôle longueur du titre et contenu du message
    if (content.length <= 4) {
        return res.status(400).json({ error: 'The content of the message must contain at least 4 characters !' });
    }
    db.User.findOne({
        where: { id: userId }
    })
    .then(userFound => {
        if(userFound) {
            const post = db.Post.build({
                content: req.body.content,
                imagePost: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`: req.body.imagePost,
                UserId: userFound.id
            })
            post.save()
            .then(() => res.status(200).json({ message: 'Your message has been created !' }))
            .catch(error => res.status(500).json({ error }));
        } else {
            return res.status(401).json({ error: 'User not found !' })
        }
    })
    .catch(error => res.status(500).json({ error }));
};

//Affichage tous les messages
exports.getAllPosts = (req, res, next) => {
    db.Post.findAll({
        order: [['createdAt', "DESC"]] ,
        include: [{
            model: db.User,
            attributes: [ 'lastName', 'firstName', 'imageProfile' ]
        },{
            model: db.Comment
        }]
    })
    .then(postFound => {
        if(postFound) {
            res.status(200).json(postFound);
        } else {
            res.status(401).json({ error: 'No message found !' });
        }
    })
    .catch(error => res.status(500).json({ error }));
}

//Modification d'un message
exports.modifyPost = (req, res, next) => {
    console.log('file', req.file);
    console.log('content', req.body.content);
    console.log('bodypost', req.body.post);
    const postObject = req.file ?
    {
    content: req.body.content,
    imagePost: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    console.log('body', req.body);
    console.log(req.params.postId);
    db.Post.findOne({
        where: {  id: req.params.postId },
    })
    .then(postFound => {
        if(postFound) {
            db.Post.update(postObject, {
                where: { id: req.params.postId}
            })
            .then(post => res.status(200).json({ message: 'Your message has been modified !' }))
            .catch(error => res.status(500).json({ error }))
        }
        else {
            res.status(401).json({ error: 'Message not found !' });
        }
    })
    .catch(error => res.status(500).json({ error }));
}

//Suppression d'un message
exports.deletePost = (req, res, next) => {
    db.Post.findOne({
        attributes: ['id'],
        where: { id: req.params.postId }
    })
    .then(post => {
        if(post) {
            if(post.imagePost != null) {
                const filename = post.imagePost.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    db.Post.destroy({ 
                        where: { id: req.params.postId } 
                    })
                    .then(() => res.status(200).json({ message: 'Your message has been deleted !' }))
                    .catch(() => res.status(500).json({ error }));
                })
            } else {
                db.Post.destroy({ 
                    where: { id: req.params.postId } 
                })
                .then(() => res.status(200).json({ message: 'Your message has been deleted !' }))
                .catch(() => res.status(500).json({ error }));
            }
        } else {
            return res.status(401).json({ error: 'Message not found !'})
        }
    })
    .catch(error => res.status(500).json({ error }));
}
