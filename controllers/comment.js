const jwt = require("jsonwebtoken");
const db = require('../models');
require('dotenv').config();

//création d'un nouveau commentaire
exports.createComment = (req, res, next) => {    
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.tokenSecretKey);
    const userId = decodedToken.userId;
    db.Post.findOne({
        where: { id: req.params.postId }
    })
    .then(postFound => {
        if(postFound) {
            const comment = db.Comment.build({
                content: req.body.content,
                postId: postFound.id,
                userId: userId
            })
            if(comment.content === null || comment.content === '') {
                return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
            } else if(comment.content.length <= 2) {
                return res.status(400).json({ error: 'Vous devez obligatoirement écrire quelque chose avec au minimum 3 lettres !' });
            } else {
                comment.save()
                .then(() => res.status(201).json({ message: 'Votre commentaire a été créé avec succès !' }))
                .catch(error => res.status(400).json({ error : 'Une erreur s\'est produite pendant la création de votre commentaire, veuillez recommencer ultérieurement.' }));
            }
        } else {
            return res.status(401).json({ error: 'Aucun message trouvé !'})
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}

//affichage des commentaires
exports.getAllComments = (req, res, next) => {
    db.Comment.findAll({
        order: [['updatedAt', "ASC"], ['createdAt', "ASC"]],
        where: { postId: req.params.postId },
        include: [{
            model: db.User,
            attributes: [ 'firstName', 'lastName', 'profileAvatar' ]
        }]
    })
    .then(commentFound => {
        if(commentFound) {
            res.status(200).json(commentFound);
        } else {
            res.status(401).json({ error: 'Aucun commentaire trouvé !' });
        }
    })
    .catch(error => {
        res.status(500).send({ error : 'Une erreur s\'est produite pendant la recherche des commentaires, veuillez recommencer ultérieurement.' });
    });
}

//suppression d'un commentaire
exports.deleteComment = (req, res, next) => {
    db.Comment.findOne({
        attributes: ['id'],
        where: { id: req.params.commentId }
    })
    .then(commentFound => {
        if(commentFound) {
            db.Comment.destroy({ 
                where: { id: req.params.commentId } 
            })
            .then(() => res.status(200).json({ message: 'Votre commentaire a été supprimé avec succès !' }))
            .catch(() => res.status(500).json({ error : 'Une erreur s\'est produite pendant la suppression de votre commentaire, veuillez recommencer ultérieurement.' }));
            
        } else {
            return res.status(401).json({ error: 'Aucun commentaire trouvé !'})
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}