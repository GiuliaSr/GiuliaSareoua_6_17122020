const Sauce = require("../models/sauce");
const fs = require("fs");

exports.getSauces = (req, res, next) => {
    console.log("getSauces ok");
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};

exports.getSauce = (req, res, next) => {
    console.log("getSauce ok");
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({ error: error });
        });
};

exports.createSauce = (req, res, next) => {
    console.log("createSauce ok");
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
        }`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce
        .save()
        .then(() => {
            res.status(201).json({
                message: "Sauce enregistrée",
            });
        })
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};

exports.modifySauce = (req, res, next) => {
    console.log("sauce modifiée");
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch((error) => {
            res.status(400).json({ error: error });
        });
};

exports.deleteSauce = (req, res, next) => {
    console.log("sauce supprimée");
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({
                        message: "Sauce supprimée!",
                    });
                })
                .catch((error) => {
                    res.status(400).json({ error: error });
                });
        });
    });
};
exports.toogleLike = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;

    switch (like) {
        case 0:
            Sauce.findOne({ _id: req.params.id }).then((foundSauce) => {
                const indexOfUserId = foundSauce.usersLiked.indexOf(userId);
                if (indexOfUserId > -1) {
                    foundSauce.usersLiked.splice(indexOfUserId, 1);
                    foundSauce.likes -= 1;
                } else {
                    foundSauce.usersDisliked.splice(indexOfUserId, 1);
                    foundSauce.dislikes -= 1;
                }

                return foundSauce.save().then(() => {
                    return res.status(201).json({
                        message: "Like enregistré",
                    });
                });
            });
            break;
        case 1:
            Sauce.findOne({ _id: req.params.id }).then((foundSauce) => {
                const indexOfUserId = foundSauce.usersLiked.indexOf(userId);
                if (indexOfUserId < 0) {
                    foundSauce.usersLiked.push(userId);
                    foundSauce.likes += 1;
                    return foundSauce.save().then(() => {
                        return res.status(201).json({
                            message: "Like enregistré",
                        });
                    });
                }
                return res.status(201).json({
                    message: "Déjà liké",
                });
            });
            break;
        case -1:
            Sauce.findOne({ _id: req.params.id }).then((foundSauce) => {
                console.log(foundSauce.usersDisliked);
                const indexOfUserId = foundSauce.usersDisliked.indexOf(userId);
                if (indexOfUserId < 0) {
                    foundSauce.usersDisliked.push(userId);
                    foundSauce.dislikes += 1;
                    return foundSauce.save().then(() => {
                        return res.status(201).json({
                            message: "Dislike enregistré",
                        });
                    });
                }
                return res.status(201).json({
                    message: "Déjà disliké",
                });
            });
            break;
        default:
    }
};
