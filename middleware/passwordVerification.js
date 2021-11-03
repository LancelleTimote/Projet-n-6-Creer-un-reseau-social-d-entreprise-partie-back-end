const passwordSchema = require('../models/Password');

//vérifie que le mot de passe valide le schéma décrit
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, 'The password must be between 8 and 20 characters long, including at least one uppercase letter, one lowercase letter, two digits, and one symbol.', {
            'content-type': 'application/json'
        });
        res.end('Incorrect password format.');
    } else {
        next();
    }
};