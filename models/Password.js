const passwordValidator = require('password-validator'); //on utilise le package pour imposer un certain type de mdp

//schéma pour le mdp
let passwordSchema = new passwordValidator();
passwordSchema
.is().min(6)                                    //longueur minimum 6
.is().max(20)                                   //longueur maximum 20
.has().uppercase()                              //contient une majuscule
.has().lowercase()                              //contient une minuscule
.has().digits(2)                                //contient deux chiffres
.has().symbols(1)                               //contient un symbole
.has().not().spaces()                           //ne contient pas d'espace
.is().not().oneOf(['Passw0rd', 'Password123']); //blacklist de mdp

module.exports = passwordSchema;