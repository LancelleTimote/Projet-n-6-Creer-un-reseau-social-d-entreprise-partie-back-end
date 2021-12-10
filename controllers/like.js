const jwt = require("jsonwebtoken");
const db = require('../models/index');
require('dotenv').config();

//Aimer un message
exports.likePost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.tokenSecretKey);
    const userId = decodedToken.userId;
    const isliked = req.body.like
    db.Post.findOne({
        where: { id: req.params.postId },
    })
    .then(postfound => {
        if(!postfound) {
            return res.status(401).json({ error: 'Message not found !' })
        } else if (isliked == false) {
            db.Like.create({ 
                postId: req.params.postId, 
                userId: userId 
            })
            .then(response => {
                console.log(postfound.likes);
                
                db.Post.update({ 
                    likes: postfound.likes +1
                },{
                    where: { id: req.params.postId }
                })
                .then(() => res.status(201).json({ message: 'You like this message !' }))
                .catch(error => res.status(500).json({ error })) 
            })
            .catch(error => res.status(500).json({ error }))
        } else if(isliked == true) {
            db.Like.destroy({ 
                where: { 
                    postId: req.params.postId, 
                    userId: userId 
                } 
            })
            .then(() => {
                db.Post.update({ 
                    likes: postfound.likes -1
                },{
                    where: { id: req.params.postId }
                })
                .then(() => res.status(201).json({ message: 'You don\'t like this message anymore !' }))
                .catch(error => res.status(500).json({ error })) 
            })
            .catch(error => res.status(500).json({ error }))
        } else {
            console.log('ko');
        }
    })
    .catch(error => res.status(500).json({ error }))  
}

//Afficher les likes d'un message
exports.getAllLike = (req, res, next) => {
    db.Like.findAll({
        where: { postId: req.params.postId},
        include: {
            model: db.User,
            attributes: ['lastName', 'firstName']
        },
    })
    .then(likePostFound => {
        if(likePostFound) {
            res.status(200).json(likePostFound);
            console.log(likePostFound);
        } else {
            res.status(404).json({ error: 'No like found !' });
        }
    })
    .catch(error => res.status(500).json({ error }))
}