//On importe bcrypt, qui va hasher le mot de passe pour augmenter la sécurité
const bcrypt = require("bcrypt");
/*On importe jsonwebtoken, qui va attribuer un token à chaque session utilisateur,
qui va expirer selon un temps donné. Cela permet de renforcer la sécurité*/
const jwt = require("jsonwebtoken");
//On importe notre modèle d'utilisateur
const User = require("../models/User");
//On importe dotenv
const dotenv = require("dotenv");

dotenv.config();


//Controller pour créer un compte
exports.signup = (req, res, next) => {
    /*On hash le corps de la requête du mot de passe, on ajoute "10", cela correspond
    au nombre de fois où l'algorithme de bcrypt va s'éxécuter*/
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            /*On créé un nouvel utilisateur depuis notre modèle avec l'email du 
            corps de la requête, et le mot de passe récupéré du hash*/
            const user = new User({
                email: req.body.email,
                password: hash
            });
            //Après l'avoir créé, on enregistre le nouvel utilisateur dans notre base de données
            user.save()
                //On renvoie un message avec le status 201 indiquant que la création de l'utilisateur a réussi
                .then(() => res.status(201).json({ message: "Un nouvel utilisateur a été créé !" }))
                //Sinon, on renvoie une erreur 400
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Controller pour se connecter à un compte
exports.login = (req, res, next) => {
    /*On utilise la fonction findOne() de Mongoose, qui nous permet de chercher si l'adresse email
    indiquée dans la requête de connexion se trouve dans notre base de données MongoDB */
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                /*Si l'utilisateur n'existe pas, on retourne ici une erreur 401 qui décrit un manque d'informations requises pour 
                l'authentification. Par mesure de sécurité, on précise ici que le nom d'utilisateur ou le mot de passe sont incorrects*/
                return res.status(401).json({ error: "Le nom d'utilisateur ou le mot de passe est incorrect !"});
            }
            //On compare le mot de passe entré par l'utilisateur avec celui présent dans notre base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    //S'ils ne correspondent pas, on retourne une erreur 401
                    if(!valid) {
                        return res.status(401).json({ error: "Mot de passe incorrect !" });
                    }
                    //S'ils correspondent, on peut se connecter grâce à ce qui suit
                    res.status(200).json({
                        userId: user._id,
                        //On définit un token pour la connexion avec jwt
                        token: jwt.sign(
                            { userId: user._id },
                            //On sécurise notre token avec dotenv, qui expire au bout de 24 heures
                            process.env.PRIVATETOKEN, 
                            { expiresIn: "24h" }
                            )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
}