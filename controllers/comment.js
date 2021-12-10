const jwt = require("jsonwebtoken");
const db = require('../models/index');
require('dotenv').config();

//Création d'un nouveau commentaire
exports.createComment = (req, res, next) => {    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.tokenSecretKey);
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
            comment.save()
                .then(() => res.status(201).json({ message: 'Your comment has been created !' }))
                .catch(error => res.status(400).json({ error }));
        } else {
            return res.status(401).json({ error: 'Message not found !'})
        }
    })
    .catch(error => res.status(500).json({ error }));
}

//Affichage des commentaires
exports.getAllComments = (req, res, next) => {
    db.Comment.findAll({
        order: [['updatedAt', "ASC"], ['createdAt', "ASC"]],
        where: { postId: req.params.postId },
        include: [{
            model: db.User,
            attributes: [ 'firstName', 'lastName', 'imageProfile' ]
        }]
    })
    .then(commentFound => {
        if(commentFound) {
            res.status(200).json(commentFound);
            console.log(commentFound);
        } else {
            res.status(401).json({ error: 'No comments found !' });
        }
    })
    .catch(error => {
        res.status(500).send({ error });
    });
}

//Suppression d'un commentaire
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
            .then(() => res.status(200).json({ message: 'Your comment has been deleted !' }))
            .catch(() => res.status(500).json({ error }));
            
        } else {
            return res.status(401).json({ error: 'Comment not found !'})
        }
    })
    .catch(error => res.status(500).json({ error }));
}