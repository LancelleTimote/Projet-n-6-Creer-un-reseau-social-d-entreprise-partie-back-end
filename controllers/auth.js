//on retrouve ici la logique métier en lien avec les utilisateurs, appliqué aux routes POST pour les opérations d'inscription et de connexion
const bcrypt = require('bcrypt');       //on utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const jwt = require('jsonwebtoken');    //on utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const db = require('../models');
const emailValidator = require('email-validator');
const passwordValidator = require('../middleware/passwordValidator');
const CryptoJS = require('crypto-js');  //on utilise le package cryptojs pour hash l'email
require('dotenv').config();

//CryptoJS clés cryptage email
const key = CryptoJS.enc.Utf8.parse(process.env.emailSecretKey);
const iv = CryptoJS.enc.Utf8.parse(process.env.otherEmailSecretKey);

function encryptEmail(string) {
    const enc = CryptoJS.AES.encrypt(string, key, { iv: iv });
    return enc;
}

//création d'un nouvel utilisateur
exports.signup = (req, res, next) => {  //on sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const email = req.body.email;
    const password = req.body.password;
    const encryptedEmail = encryptEmail(email).toString();
    const decryptedEmail = CryptoJS.AES.decrypt(encryptedEmail, key, { iv: iv }).toString(CryptoJS.enc.Utf8);

    //vérification si tous les champs sont bien complets
    if(lastName == null || lastName == '' || firstName == null || firstName == '' || email == null || email == '' || password == null || password == '') {
        return res.status(400).json({ error: 'Un ou des champs sont incomplets ! Tous les champs doivent être remplis !' });
    }
    //contrôle de la longueur du nom
    if(lastName.length <= 2 || lastName.length >= 100) {
        return res.status(400).json({ error: 'Le nom doit contenir entre 3 et 100 caractères !' });
    }
    //contrôle de la longueur du prénom
    if(firstName.length <= 2 || firstName.length >= 100) {
        return res.status(400).json({ error: 'Le prénom doit contenir entre 3 et 100 caractères !' });
    }
    //contrôle de la validité du mail
    if(!emailValidator.validate(email)) {
        return res.status(400).json({ error: 'Email invalide !' });
    }
    //contrôle de la validité du mot de passe
    if (!passwordValidator.validate(password)) {
        return res.status(400).json({ error: 'Le mot de passe doit comporter entre 8 et 30 caractères, dont au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial !' });
    }
    //vérification que l'utilisation n'existe pas encore
    db.User.findOne({
        attributes: ['lastName' || 'firstName' || 'email'],
        where : {
            lastName: lastName,
            firstName: firstName,
            email: decryptedEmail,
        }
    })
    .then(userExist => {
        if(!userExist) {
            bcrypt.hash(req.body.password, 10)  //on appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
            .then(hash => {                     //on récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD MongoDB
                const user = db.User.build({         //on crée le nouvel utilisateur avec notre modèle mongoose
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    email: encryptedEmail,
                    password : hash,            //on récupère le mdp hashé de bcrypt
                    admin: 0
                });
                user.save()                     //on utilise la méthode save de notre user pour l'enregistrer dans la bdd
                .then(() => res.status(201).json({ message: 'Votre compte a été créé avec succès !' }))
                .catch(error => res.status(400).json({ error: 'Une erreur s\'est produite pendant la création du compte, veuillez recommencer ultérieurement.' }));
            })
            .catch(error => res.status(500).json({ error: 'Une erreur s\'est produite lors de la création de votre compte, veuillez recommencer ultérieurement.' }));
        } else {
            return res.status(404).json({ error : 'Cet utilisateur existe déjà !' })
        }
    })
    .catch(error => res.status(500).json({ error: 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
};

//connection d'un utilisateur
exports.login = (req, res, next) => {       //permet aux utilisateurs de se connecter avec des utilisateurs existants
    db.User.findOne({
        where: { email: encryptEmail(req.body.email).toString() }   //user.findOne pour trouver un seul utilisateur de la bdd, puisque mail unique, on veut que se soit l'utilisateur pour qui le mail
    })
    .then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password)    //on utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
            .then(valid => {
                if (!valid) {   //si la comparaison n'est pas valable
                    return res.status(401).json({ error: 'Mot de passe incorrect !' }); //on retourne un 401 non autorisé, avec une erreur mdp incorrect
                }
                res.status(200).json({  //si la comparaison est valable, on renvoie un statut, 200 pour une requête ok, on renvoie un objet JSON avec un userID + un token
                    userId: user.id,
                    admin: user.admin,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    profileAvatar: user.profileAvatar,
                    //permet de vérifier si la requête est authentifiée
                    //on va pouvoir obtenir un token encodé pour cette authentification grâce à jsonwebtoken, on va créer des tokens et les vérifier
                    token: jwt.sign(                //encode un nouveau token avec une chaine de développement temporaire
                        { userId: user.id },       //encodage de l'userdID nécéssaire dans le cas où une requête transmettrait un userId (ex: modification d'un stuff)
                        process.env.tokenSecretKey, //clé d'encodage du token
                        { expiresIn: '24h' }        //argument de configuration avec une expiration au bout de 24h
                    )
                });
            })
            .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite pendant la connexion, veuillez recommencer ultérieurement.' }));  
        } else {
            return res.status(404).json({ error : 'Cet utilisateur n\'existe pas, veuillez créer un compte !' })
        }

    })
    .catch(error => res.status(500).json({ error : 'Une erreur s\'est produite, veuillez recommencer ultérieurement.' }));
};