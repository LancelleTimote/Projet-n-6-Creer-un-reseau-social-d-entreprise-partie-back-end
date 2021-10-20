const jwt = require('jsonwebtoken');  //importation du package pour vérifier les TOKEN

module.exports = (req, res, next) => {  //exportation middleware classique
  try {
    const token = req.headers.authorization.split(' ')[1];  //on récupère le token dans le header autorisation, ça va nous retourner un tableau avec bearer en 1er et le token en 2ème
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  //on décode le token avec le package jwt, on vérifie le token et on met la clé secréte mis dans controllers user.js
    const userId = decodedToken.userId; //on récupére le userId dans le token décodé
    if (req.body.userId && req.body.userId !== userId) {  //on vérifie si l'userId avec la requête correspond bien à celui du token
      throw 'User ID non valable !';  //s'il est différent, on utilise throw pour renvoyer l'erreur 401
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error | 'Requête non authentifiée !' }); //ça permet de personnalisé le message d'erreur, s'il y a une erreur, soit le catch error qui sera affiché
                                                                          //si c'est une erreur du bloc try, ça affichera le message
  }
};