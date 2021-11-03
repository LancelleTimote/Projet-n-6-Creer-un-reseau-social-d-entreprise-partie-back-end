//middleware qui protégera les routes sélectionnées et vérifier que l'utilisateur est authentifié avant d'autoriser l'envoi de ses requêtes.

const jwt = require('jsonwebtoken');    //importation du package pour vérifier les TOKEN
require('dotenv').config();

//ce middleware sera appliqué à toutes les routes afin de les sécuriser
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];  //on récupère le token dans le header de la requête autorisation, on récupère uniquement le deuxième élément du tableau (car split)
        const decodedToken = jwt.verify(token, process.env.tokenSecretKey); //on décode le token avec le package jwt, on vérifie le token et on met la clé secréte mis dans controllers user.js
        const userId = decodedToken.userId;                     //on récupére le userId dans le token décodé
        if (req.body.userId && req.body.userId !== userId) {    //on vérifie si l'userId avec la requête correspond bien à celui du token
        throw 'User ID non valable !';  //s'il est différent, on utilise throw pour renvoyer l'erreur 401
        } else {
        next();
        }
    } catch (error) {   //problème d'autentification si erreur dans les instructions
        res.status(401).json({error: error});
    }
};