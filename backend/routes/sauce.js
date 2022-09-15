const express = require("express");
//On importe le middleware d'authentification, nécessaire pour ajouter des sauces
const auth = require("../middleware/auth");
//On déclare la route des sauces en définissant un router grâce à la classe fournie par express
const router = express.Router();
//On importe multer pour les images
const multer = require("../middleware/multer-config");
//On importe le controller des sauces
const sauceCtrl = require("../controllers/sauce");


router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;