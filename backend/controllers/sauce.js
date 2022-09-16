//On importe notre modèle de sauce
const Sauce = require("../models/Sauce");
//On importe file system ou fs, pour pouvoir supprimer nos images
const fs = require("fs");

//Controlleur pour créer une sauce en route POST
exports.createSauce = (req, res, next) => {
    //On récupère l'objet et on le parse l'objet pour qu'il soit utilisable
    const sauceObject = JSON.parse(req.body.sauce);
    //On supprime l'ID renvoyé
    delete sauceObject._id;
    //On créé notre nouvelle sauce
    const sauce = new Sauce({
        //On récupère notre variable en excluant les champs supprimés
        ...sauceObject,
        //On résout l'url complète de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce enregistrée avec succès !" }))
        .catch(error => res.status(400).json({ error }));
}

//Controller pour mettre à jour une sauce en route PUT
exports.modifySauce = (req, res, next) => {
    //On vérifie si une image est téléchargée lors de la requête de modification d'une sauce
    const sauceObject = req.file ? {
        //Si oui, on récupère l'objet et on le parse l'objet pour qu'il soit utilisable
        ...JSON.parse(req.body.sauce),
        //On résout l'url complète de l'image
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
        //S'il n'y a pas d'image, on continue et on modifie le reste du contenu
    } : { ...req.body };
    //On recherche la sauce à modifier
    Sauce.findOne({_id: req.params.id})
        .then(sauce => { 
            const filename = sauce.imageUrl.split('/images/')[1];
            //Si l'image est mise à jour, on supprime l'ancienne image de notre dossier "images"
            fs.unlink(`images/${filename}`, () => {
                Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                            .then(() => res.status(200).json({ message: "Sauce modifiée avec succès !" }))
                            .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
}
            
//Controller pour supprimer une sauce en route DELETE
exports.deleteSauce = (req, res, next) => {
    //On recherche al sauce à supprimer
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({message: "Sauce supprimée avec succès !" })})
                        .catch(error => res.status(401).json({ error }));
                });
            
        })
        .catch(error => res.status(500).json({ error }));  
}

//Controller pour récupérer une sauce en route GET
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

//Controller pour récupérer toutes les sauces en route GET
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

//Controller pour gérer les likes d'une sauce en route POST
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            //Si on souhaite liker une sauce
            if (like === 1) {
                if (!sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, 
                        { $inc: { likes: 1 },
                          $push: { usersLiked: userId }}
                    )
                    .then(() => res.status(201).json({ message: "Votre like a été reçu !" }))
                    .catch(error => res.status(400).json({ error }));
                }

            //Si on souhaite dislike une sauce
            } else if (like === -1) {
                if (!sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, 
                        { $inc: { dislikes: 1 },
                          $push: { usersDisliked: userId }}
                    )
                    .then(() => res.status(201).json({ message: "Votre dislike a été reçu !" }))
                    .catch(error => res.status(400).json({ error }));
                }

            //Si on souhaite annuler notre like ou dislike
            } else if (like === 0) {

                //Si la sauce avait reçu un like, on l'enlève et on enlève l'utilisateur de la liste
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, 
                        { $inc: { likes: -1 },
                          $pull: { usersLiked: userId }}
                    )
                    .then(() => res.status(201).json({ message: "Votre like a été retiré !" }))
                    .catch(error => res.status(400).json({ error }));

                //Si la sauce avait reçu un dislike, on l'enlève et on enlève l'utilisateur de la liste
                } else if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne(
                            { _id: sauceId }, 
                            { $inc: { dislikes: -1 },
                              $pull: { usersDisliked: userId }}
                        )
                        .then(() => res.status(201).json({ message: "Votre dislike a été retiré !" }))
                        .catch(error => res.status(400).json({ error }));
                    }
                }      
        })
        .catch((error) => res.status(400).json({ error }));


    /*
    //Si on souhaite liker une sauce
    if (like === 1) {
        Sauce.findOne({ id: sauceId })
            .then((sauce) => { 
                if(!sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, 
                        { $inc: { likes: 1 },
                          $push: { usersLiked: userId }}
                    )
                    .then(() => res.status(201).json({ message: "Votre like a été reçu !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
    };
    
    //Si on souhaite dislike une sauce
    if (like === -1) {
        Sauce.findOne ({ id: sauceId })
            .then((sauce) => {
                if(!sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, 
                        { $inc: { dislikes: 1 },
                          $push: { usersDisliked: userId }}
                    )
                    .then(() => res.status(201).json({ message: "Votre dislike a été reçu !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch(error => res.status(400).json({ error }));
    };
    
    //Si on souhaite annuler notre like ou dislike
    if (like === 0) {
        Sauce.findOne ({ id: sauceId })
            .then((sauce) => {
                //Si la sauce avait reçu un like, on enlève le like et l'utilisateur de la liste
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, 
                        { $inc: { likes: -1 },
                          $pull: { usersLiked: userId }}
                    )
                    .then(() => res.status(201).json({ message: "Votre like a été retiré !" }))
                    .catch(error => res.status(400).json({ error }));
                };
                //Si la sauce avait reçu un dislike, on l'enlève et on enlève l'utilisateur de la liste
                if (sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne(
                        { _id: sauceId }, 
                        { $inc: { dislikes: -1 },
                          $pull: { usersDisliked: userId }}
                    )
                    .then(() => res.status(201).json({ message: "Votre dislike a été retiré !" }))
                    .catch(error => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }

    */
}