const mongoose = require("mongoose");

//mongoose-unique-validator nous permet de vérifier qu'une adresse mail est unique
const uniqueValidator = require("mongoose-unique-validator");

//On définit notre schéma avec la méthode mongoose.Schema()
const userSchema = mongoose.Schema({
    //"Unique" fait appel à mongoose-unique-validator pour vérifier que l'adresse n'est pas déjà utilisée
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//On applique le plugin mongoose-unique-validator sur notre schéma User
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);