const multer = require('multer'); //importation de multer après installation, qui va nous permettre que les utilisateurs puissent télécharger des images d'articles à vendre

const MIME_TYPES = {    //les extensions d'images que l'on peut avoir
    'image/jpg': 'jpg', //image/jpg premier mime_type que l'on peut avoir, que se traduit par jpg
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
  
const storage = multer.diskStorage({  //objet de configuration pour multer, diskStorage fonction de multer pour dire qu'on va enregistrer sur le disque
    destination: (req, file, callback) => { //1er argument qui va expliquer à multer dans quel dossier enregistrer les fichiers
      callback(null, 'images'); //on appelle le callback, null pour dire qu'il n'y a pas eu d'erreur à ce niveau là, et le nom du dossier
    },
    filename: (req, file, callback) => {    //2ème argument qui va expliquer à multer quel nom de fichier utiliser(car on peut pas utiliser le nom de fichier d'origine sinon problème
                                            //quand 2 fichiers ont le même noms)
      const name = file.originalname.split(' ').join('_');  //le nouveau nom du fichier, le nom d'origine du fichier, split et join pour enlever les espaces, et mettre des underscores
      const extension = MIME_TYPES[file.mimetype];  //on crée l'extension du fichier, qui sera l'élément de notre dictionnaire, qui correpond au mimetype du fichier envoyer par frontend
      callback(null, name + Date.now() + '.' + extension);  //null car pas d'erreur, ensuite on crée le file name en entier, donc le name crée au dessus + timestamp pour le rendre unique
                                                            //à la milliseconde près, on ajoute un point, puis l'extension du fichier crée au dessus
    }
});
  
module.exports = multer({ storage }).single('image');   //on exporte notre middleware multer, on passe notre objet storage, single pour dire qu'il s'agit d'un fichier unique et
                                                        //d'une image