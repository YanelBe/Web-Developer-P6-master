//Multer nous permet de gérer les fichiers entrants dans les requêtes HTTP
const multer = require("multer");

//On récupère les types de fichiers dans un objet
const MIME_TYPES = {
    "image/jpg": "jpg",
    "image/jpeg": "jpeg",
    "image/png": "png"
};

const storage = multer.diskStorage({
    //On enregistre notre image dans un dossier "images"
    destination: (req, file, callback) => {
      callback(null, "images");
    },
    //On remplace le nom d'origine du fichier par un nom qui inclut un timestamp afin qu'il soit unique 
    filename: (req, file, callback) => {
      const name = file.originalname.split(".")[0].split(" ").join("_");
      //L'extension de type MIME résoud l'extension de fichier appropriée
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
});

//On exporte l'élément multer configuré avec la constante storage, on précise qu'on ne gère que les images
module.exports = multer({storage: storage}).single("image");