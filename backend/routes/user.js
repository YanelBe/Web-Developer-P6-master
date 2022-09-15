const express = require("express");
//On déclare la route de l'utilisateur en définissant un router grâce à la classe fournie par express
const router = express.Router();
//On importe le controller de l'utilisateur
const userCtrl = require("../controllers/user");

//On poste nos routes signup et login
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;