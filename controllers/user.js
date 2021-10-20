const bcrypt = require('bcrypt'); //importation de bcrypt après installation (npm install --save bcrypt)
const jwt = require('jsonwebtoken'); //importation de token après installation (npm install --save jsonwebtoken)
const User = require('../models/User'); //importation du modèle User

exports.signup = (req, res, next) => {  //pour l'enregistrement / création de nouveau utilisateur
    bcrypt.hash(req.body.password, 10)  //fonction pour hasher / crypter le mdp, fonction asynchrone qui prend du temps qui renvoie une Promise et dans laquelle nous recevons le hash
                                        //généré. On passe en argmuent le mdp du corps de la req qui sera passer par le frontend. 10 (salt) pour le nombre de fois qu'on exécute l'algorithme
                                        // de hashage (plus le nombre est grand, plus ça prend du temps, mais plus le hashage est sécurisé)
    .then(hash => { //on récupère le hash du mdp
       const user = new User({  //on crée le nouvel utilisateur avec notre modèle mongoose
           email: req.body.email,   //pour le mail, on passe celui dans le corps de la requête
           password : hash  //pour le mdp on va enregistrer le hash crée dans then, afin de ne pas stocker le mdp à blanc
       }); 
       user.save()  //on utilise la méthode save de notre user pour l'enregistrer dans la bdd
       .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) //on renvoie 201 pour une création de ressource, avec un message
       .catch(error => res.status(400).json({ error }));    //400 pour différencier du 500 en dessous
    })
    .catch(error => res.status(500).json({ error }));   //500 parce que c'est une erreur serveur
};

exports.login = (req, res, next) => {   //permet aux utilisateurs de se connecter avec des utilisateurs existants
    User.findOne({ email: req.body.email }) //user.findOne pour trouver un seul utilisateur de la bdd, puisque mail unique, on veut que se soit l'utilisateur pour qui le mail
                                            //corresponde au mail envoyé dans la req
    .then(user => {
      if (!user) {  //on vérifie ici si on a récupéré un user ou non, si pas de user
        return res.status(401).json({ error: 'Utilisateur non trouvé !' }); //on renvoie un 401 non autorisé, avec comme erreur Utilisateur non trouvé
      }
      bcrypt.compare(req.body.password, user.password)  //on utilise le package bcrypt pour comparer le mdp qui est envoyé par l'utilisateur qui essaye de se connecter (avec la req),
                                                        //avec le hash qui est enregistré du user reçu dans then
        .then(valid => {    //on reçoit un boolean pour savoir si la comparaison est valable ou non
          if (!valid) { //si la comparaison n'est pas valable
            return res.status(401).json({ error: 'Mot de passe incorrect !' }); //on retourne un 401 non autorisé, avec une erreur mdp incorrect
          }
          res.status(200).json({    //si la comparaison est valable, on renvoie un statut, 200 pour une requête ok, on renvoie un objet json qui contient :
            userId: user._id,       //l'id utilisateur dans la BDD
            token: jwt.sign(        //on appel la fonction sign de json web token pour encoder un nouveau token (les tokens d'authentification permettent aux utilisateurs de ne se
                                    //connecter qu'une seule fois à leur compte)
                { userId: user._id },   //la fonction prend en premier argument les données que l'on veut encoder (le payload), ici l'user id qui est l'identifiant de l'utilisateur
                                        //on encode le user id pour la création de nouveau objet, pour ne pas pouvoir modifier ceux des autres utilisateurs
                'RANDOM_TOKEN_SECRET',  //le deuxième argument c'est la clé secréte pour l'encodage (pour l'instant clé très simple, en production utiliser une chaîne de caractère + longue et aléatoire)
                { expiresIn: '24h' }    //le troisième argument, une expiration pour le token qui durera 24h, passé se délai il ne sera plus valable et l'utilisateur devrai se reconnecter
                                        //vérifier dans le DevTools, dans l'onglet réseau, qu'il y a un en-tête Authorization avec le mot-clé Bearer et une longue chaîne encodée
            )
          });
        })
        .catch(error => res.status(500).json({ error }));   //également une histoire d'erreur serveur
    })
    .catch(error => res.status(500).json({ error }));   //erreur seulement s'il y a un problème de connexion lié à mongoDB, donc 500 parce que c'est une erreur serveur
};