//On importe express, qui est un framework pour NodeJS
const express = require("express");

//On importe Mongoose, qui va permettre de communiquer entre NodeJS et MongoDB
const mongoose = require("mongoose");

//On met en place le chemin d'accès à un fichier téléchargé par un utilisateur
const path = require("path");

/*On utilise dotenv pour utiliser des variables d'environnement,
qui vont nous permettre entre autres de masquer nos identifiants MongoDB lors de la connexion à Mongoose*/
const dotenv = require("dotenv");
dotenv.config();    

//On initialise express
const app = express();

//On déclare nos différentes routes, utilisateur
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

//On se connecte à MongoDB grâce à Mongoose, en utilisant dotenv pour masquer les identifiants, disponibles dans le fichier .env
mongoose.connect(`mongodb+srv://${process.env.HOST}:${process.env.PASS}@cluster0.0cynk0e.mongodb.net/?retryWrites=true&w=majority`,
{   useNewUrlParser: true,
    useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//On accède au corps de la requête (plus besoin de body-parser)
app.use(express.json());

//On rajoute ce middleware CORS pour autoriser l'accès à notre API depuis n'importe quelle origine
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

//Middleware qui charge les fichiers uploadés dans le dossier "images"
app.use("/images", express.static(path.join(__dirname, "images")));

//Middlewares qui transmettent les requêtes vers les routes correspondantes
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);





module.exports = app;