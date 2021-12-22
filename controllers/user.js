//on retrouve ici la logique métier en lien avec nos utilisateurs, appliqué aux routes POST pour les opérations d'inscription et de connexion

const bcrypt = require('bcrypt');       //on utilise l'algorithme bcrypt pour hasher le mot de passe des utilisateurs
const jwt = require('jsonwebtoken');    //on utilise le package jsonwebtoken pour attribuer un token à un utilisateur au moment ou il se connecte
const User = require('../models/User'); //on récupère notre model User, créée avec le schéma mongoose
const CryptoJS = require('crypto-js');  //on utilise le package cryptojs pour hash l'email
const passwordVerification = require('../middleware/passwordVerification');
require('dotenv').config();

//Regex
const regexEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,63}$/;

//CryptoJS cryptage email
const key = CryptoJS.enc.Utf8.parse(process.env.emailSecretKey);
const iv = CryptoJS.enc.Utf8.parse(process.env.otherEmailSecretKey);

function encryptEmail(string) {
    const enc = CryptoJS.AES.encrypt(string, key, { iv: iv });
    return enc;
}

//création d'un nouvel utilisateur
exports.signup = (req, res, next) => {  //on sauvegarde un nouvel utilisateur et crypte son mot de passe avec un hash généré par bcrypt
    let lastName = req.body.lastName;
    let firstName = req.body.firstName;
    let email = req.body.email;
    let password = req.body.password;

    //vérification si tous les champs sont bien complets
    if(lastName == null || lastName == '' || firstName == null || firstName == '' || email == null || email == '' || password == null || password == '') {
        return res.status(400).json({ error: 'Fields are incomplete! All fields must be completed !' });
    }
    //contrôle de la longueur du nom
    if(lastName.length <= 3 || lastName.length >= 50) {
        return res.status(400).json({ error: 'The last name must contain between 3 and 50 characters !' });
    }
    //contrôle de la longueur du prénom
    if(firstName.length <= 3 || firstName.length >= 50) {
        return res.status(400).json({ error: 'The first name must contain between 3 and 50 characters !' });
    }
    //contrôle de la validité du mail
    if(!regexEmail.test(email)) {
        return res.status(400).json({ error: 'Invalid email !' });
    }
    //contrôle de la validité du mot de passe
    if (!passwordVerification.test(password)) {
        return res.status(400).json({ error: 'The password must be between 8 and 30 characters long, including at least one uppercase letter, one lowercase letter, two digits, and one symbol !' });
    }
    //vérification que l'utilisation n'existe pas encore
    db.User.findOne({
        attributes: ['lastName' || 'firstName' || 'email'],
        where : {
            lastName: lastName,
            firstName: firstName,
            email: email
        }
    })
    .then(userExist => {
        if(!userExist) {
            bcrypt.hash(req.body.password, 10)  //on appelle la méthode hash de bcrypt et on lui passe le mdp de l'utilisateur, le salte (10) ce sera le nombre de tours qu'on fait faire à l'algorithme
            .then(hash => {                     //on récupère le hash de mdp qu'on va enregister en tant que nouvel utilisateur dans la BBD MongoDB
                const user = db.User.build({         //on crée le nouvel utilisateur avec notre modèle mongoose
                    lastName: req.body.lastName,
                    firstName: req.body.firstName,
                    email: encryptEmail(req.body.email),               //le mail crypté
                    password : hash,            //on récupère le mdp hashé de bcrypt
                    admin :0
                });
                console.log("user.email :");
                console.log(user.email);
                user.save()                     //on utilise la méthode save de notre user pour l'enregistrer dans la bdd
                .then(() => res.status(201).json({ message: 'Your account has been registered !' }))
                .catch(error => res.status(400).json({ error }));    //s'il existe déjà un utilisateur avec cette adresse email
            })
            .catch(error => res.status(500).json({ error }));
        } else {
            return res.status(404).json({ error : 'This user already exists !' })
        }
    })
    .catch(error => res.status(500).json({ error }));
};

//connection d'un utilisateur
exports.login = (req, res, next) => {       //permet aux utilisateurs de se connecter avec des utilisateurs existants
    const encryptEmailTest = encryptEmail(req.body.email);
    const decryptEmail = CryptoJS.AES.decrypt(encryptEmailTest, key, { iv: iv });
    console.log("encryptEmailTest :");
    console.log(encryptEmailTest.toString());
    console.log("decryptEmail :");
    console.log(decryptEmail.toString(CryptoJS.enc.Utf8));
    db.User.findOne({
        where: { email: encryptEmail(req.body.email).toString() }   //user.findOne pour trouver un seul utilisateur de la bdd, puisque mail unique, on veut que se soit l'utilisateur pour qui le mail
    })
    .then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password)    //on utilise bcrypt pour comparer les hashs et savoir si ils ont la même string d'origine
            .then(valid => {
                if (!valid) {   //si la comparaison n'est pas valable
                    return res.status(401).json({ error: 'Incorrect password !' }); //on retourne un 401 non autorisé, avec une erreur mdp incorrect
                }
                res.status(200).json({  //si la comparaison est valable, on renvoie un statut, 200 pour une requête ok, on renvoie un objet JSON avec un userID + un token
                    userId: user.id,
                    admin: user.admin,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    imageProfile: user.imageProfile,
                    //permet de vérifier si la requête est authentifiée
                    //on va pouvoir obtenir un token encodé pour cette authentification grâce à jsonwebtoken, on va créer des tokens et les vérifier
                    token: jwt.sign(                //encode un nouveau token avec une chaine de développement temporaire
                        { userId: user._id },       //encodage de l'userdID nécéssaire dans le cas où une requête transmettrait un userId (ex: modification d'un stuff)
                        process.env.tokenSecretKey, //clé d'encodage du token
                        { expiresIn: '24h' }        //argument de configuration avec une expiration au bout de 24h
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));  
        } else {
            return res.status(404).json({ error : 'This user does not exist, please create an account !' })
        }

    })
    .catch(error => res.status(500).json({ error }));
};

//Avoir les informations d'un compte
exports.getUserProfile = (req, res, next) => {
    const id = req.params.id;
    db.User.findOne({
        attributes: [ 'id', 'lastName', 'firstName', 'email', 'admin', 'imageProfile' ],
        where: { id: id }
    })
    .then(user => {
        if(user) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ error: 'User not found !' })
        }
    })
    .catch(error => res.status(500).json({ error }));
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
    imageProfile: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    db.User.findOne({
        where: { id: userId },
    })
    .then(userFound => {
        if(userFound) {
            db.User.update(userObject, {
                where: { id: userId}
            })
            .then(user => res.status(200).json({ message: 'Your profile has been modified !' }))
            .catch(error => res.status(400).json({ error }))
        }
        else {
            res.status(401).json({ error: 'User not found !' });
        }
    })
    .catch(error => res.status(500).json({ error }));
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
            .then(() => res.status(200).json({ message: 'Your account has been deleted !' }))
            .catch(() => res.status(500).json({ error }));
        } else {
            return res.status(401).json({ error: 'User not found !' })
        }
    })
    .catch(error => res.status(500).json({ error }));
}