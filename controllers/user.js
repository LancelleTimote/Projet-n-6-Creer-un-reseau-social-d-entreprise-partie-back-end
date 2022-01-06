const jwt = require('jsonwebtoken');    //on utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const db = require('../models');
// const CryptoJS = require('crypto-js');  //on utilise le package cryptojs pour hash l'email
require('dotenv').config();

// //CryptoJS cryptage email
// const key = CryptoJS.enc.Utf8.parse(process.env.emailSecretKey);
// const iv = CryptoJS.enc.Utf8.parse(process.env.otherEmailSecretKey);

// function encryptEmail(string) {
//     const enc = CryptoJS.AES.encrypt(string, key, { iv: iv });
//     return enc;
// }

// const encryptEmailTest = encryptEmail(req.body.email);
// const decryptEmail = CryptoJS.AES.decrypt(encryptEmailTest, key, { iv: iv });
// console.log("encryptEmailTest :");
// console.log(encryptEmailTest.toString());
// console.log("decryptEmail :");
// console.log(decryptEmail.toString(CryptoJS.enc.Utf8));

//Avoir les informations d'un compte
exports.getUserProfile = (req, res, next) => {
    const id = req.params.id;
    db.User.findOne({
        attributes: [ 'id', 'lastName', 'firstName', 'email', 'admin', 'profileAvatar', 'createdAt' ],
        where: { id: id }
    })
    .then(user => {
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ error: 'Utilisateur inconnu !' })
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}

//Modification d'un compte
exports.modifyUserProfile = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.tokenSecretKey);
    const userId = decodedToken.userId;
    req.body.user = userId
    console.log('bodyUser', req.body.user);
    const userObject = req.file ?
    {
    ...JSON.parse(req.body.user),
    profileAvatar: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    db.User.findOne({
        where: { id: userId },
    })
    .then(userFound => {
        if(userFound) {
            db.User.update(userObject, {
                where: { id: userId }
            })
            .then(user => res.status(200).json({ message: 'Votre profil a été modifié !' }))
            .catch(error => res.status(400).json({ error : 'Une erreur s\'est produite pendant la modification du profil, veuillez recommencer ultérieurement.' }))
        }
        else {
            res.status(401).json({ error: 'Utilisateur inconnu !' });
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}

//Suppression d'un compte
exports.deleteAccount = (req, res, next) => {
    const id = req.params.id;
    db.User.findOne({
        attributes: ['id'],
        where: { id: id }
    })
    .then(user => {
        if(user) {
            db.User.destroy({ 
                where: { id: id } 
            })
            .then(() => res.status(200).json({ message: 'Votre compte a été supprimé !' }))
            .catch(() => res.status(500).json({ error : 'Une erreur s\'est produite pendant la suppression du compte, veuillez recommencer ultérieurement.' }));
        } else {
            return res.status(401).json({ error: 'Utilisateur inconnu !' })
        }
    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
}