const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
    try {
        //On extrait notre token de notre requête
        const token = req.headers.authorization.split(" ")[1];
        //On décode notre token
        const decodedToken = jwt.verify(token, process.env.PRIVATETOKEN);
        //On extrait l'ID associé au token
        const userId = decodedToken.userId;
        //On compare l'ID associé au token à celui du corps de la requête
        if (req.body.userId && req.body.userId !== userId) {
            throw "L'ID utilisateur est invalide !";
        } else {
            next();
        }
    } catch {res.status(403).json({ error: "Requête invalide !"})};
};