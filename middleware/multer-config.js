//on importe multer qui est un package qui permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require('multer');

//on crée un dictionnaire des types MIME pour définire le format des images
//donc la creation d'un objet pour ajouter une extention en fonction du type mime du ficher
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif'
};

//on crée un objet de configuration pour préciser à multer où enregistrer les fichiers images et les renommer
const storage = multer.diskStorage({
    //on met la destination d'enregistrement des images
    destination: (req, file, callback) => {
        //on passe le dossier images qu'on a créé dans le backend
        callback(null, 'images');
    },
    //on dit à multer quel nom de fichier on utilise pour éviter les doublons
    filename: (req, file, callback) => {
        //on génère un nouveau nom avec le nom d'origine, on supprime les espaces (white space avec split) et on insère des underscores à la place
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        mimeTypeIsValid(extension,req);
        const finalFilename = name +"_"+Date.now()+"."+extension;
        req.body.finalFileName = finalFilename;
        //on appelle le callback, on passe null pour dire qu'il n'y a pas d'erreur
        //et on crée le filename en entier, on ajoute un timestamp, un point et enfin l'extension du fichier
        callback(null, name + Date.now() + '.' + extension); //genère le nom complet du fichier- Nom d'origine + numero unique + . + extension
    }
});

//on exporte le module, on lui passe l'objet storage, la méthode single pour dire que c'est un fichier unique et on précise que c'est une image
module.exports = multer({ storage }).single('image');

const mimeTypeIsValid = (ext,req) => {
    if(ext!="jpg"&&ext!="jpeg"&&ext!="png"&&ext!="webp"&&ext!="gif") {
        req.body.errorMessage = "Le format de l'image n'est pas valide!";
    }
}