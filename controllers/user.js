const jwt = require('jsonwebtoken');    //on utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const db = require('../models');
const fs = require("fs");
const CryptoJS = require('crypto-js');  //on utilise le package cryptojs pour hash l'email
require('dotenv').config();

//cryptoJS clés cryptage email
const key = CryptoJS.enc.Utf8.parse(process.env.emailSecretKey);
const iv = CryptoJS.enc.Utf8.parse(process.env.otherEmailSecretKey);

//avoir les informations d'un compte
exports.getUserProfile = (req, res, next) => {
    const id = req.params.id;
    db.User.findOne({
        attributes: [ 'id', 'lastName', 'firstName', 'email', 'admin', 'profileAvatar', 'createdAt' ],
        where: { id: id }
    })
    .then(userFound => {
        if(userFound) {
            const decryptedEmail = CryptoJS.AES.decrypt(userFound.email, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
            userFound.email = decryptedEmail;
            res.status(200).json(userFound);
        } else {
            res.status(401).json({ error: 'Utilisateur inconnu !' })
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}

//modification d'un compte
exports.modifyUserProfile = (req, res, next) => {
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.tokenSecretKey);
    const userId = decodedToken.userId;
    req.body.user = userId;
    db.User.findOne({   //avant de modifier l'utilisateur, on va le chercher
        where: { id: userId },
    })
    .then(userFound => {
        if (userFound.id === userId) {   //on vérifie que l'userId dans la BDD correspond à celui de l'utilisateur
            if (req.file && userFound.profileAvatar !== null) {  //on crée un objet thingObject qui regarde si req.file existe ou non + image de profil
                const userObject = req.file ?
                {
                ...JSON.parse(req.body.user),
                profileAvatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`   //on modifie l'image URL
                } : { ...req.body };
                const filename = userFound.profileAvatar.split('/images/')[1];   //on supprime l'ancienne image
                fs.unlinkSync(`images/${filename}`);
                db.User.update(userObject, {    //on modifie le compte dans la BDD
                    where: { id: userId }
                })
                .then(() => res.status(200).json({ message: 'Votre profil a été modifié avec succès !' }))
                .catch(() => res.status(400).json({ error : 'Une erreur s\'est produite pendant la modification du profil, veuillez recommencer ultérieurement.' }))
            } else if (req.file && userFound.profileAvatar === null) {
                const userObject = req.file ?
                {
                ...JSON.parse(req.body.user),
                profileAvatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };
                db.User.update(userObject, {
                    where: { id: userId }
                })
                .then(() => res.status(200).json({ message: 'Votre profil a été modifié avec succès !' }))
                .catch(() => res.status(400).json({ error : 'Une erreur s\'est produite pendant la modification du profil, veuillez recommencer ultérieurement.' }))
            } else {
                res.status(401).json({ error: 'Utilisateur inconnu !' });
            }
        } else {
            res.status(401).json({ error: 'Utilisateur inconnu !' });
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}

//suppression d'un compte
exports.deleteAccount = (req, res, next) => {
    const decodedToken = jwt.decode(req.headers.authorization.split(' ')[1], process.env.tokenSecretKey);
    const userId = decodedToken.userId;
    req.body.user = userId;
    db.User.findOne({               //avant de modifier l'utilisateur, on va le chercher
        where: { id: userId },
    })
    .then(userFound => {
        if (userFound.id === userId) {   //on vérifie que l'userId dans la BDD correspond à celui de l'utilisateur
            if (userFound.profileAvatar !== null) {         //on vérifie s'il y a une image de profil
                const filename = userFound.profileAvatar.split('/images/')[1];   //on supprime l'ancienne image
                fs.unlink(`images/${filename}`, () => {
                    db.User.destroy({                                       //on supprime le compte dans la BDD
                        where: { id: userId } 
                    })
                    .then(() => res.status(200).json({ message: 'Votre compte a été supprimé avec succès !' }))
                    .catch(() => res.status(500).json({ error : 'Une erreur s\'est produite pendant la suppression du compte, veuillez recommencer ultérieurement.' }));
                })
            } else if (userFound.profileAvatar === null) {
                db.User.destroy({ 
                    where: { id: userId }
                })
                .then(() => res.status(200).json({ message: 'Votre compte a été supprimé avec succès !' }))
                .catch(() => res.status(500).json({ error : 'Une erreur s\'est produite pendant la suppression du compte, veuillez recommencer ultérieurement.' }));
            } else {
                res.status(401).json({ error: 'Utilisateur inconnu !' })
            } 
        } else {
            res.status(401).json({ error: 'Utilisateur inconnu !' })
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}

// post.destroy({ where: { id: id }})
// comment.destroy({ where: { id: id  }})