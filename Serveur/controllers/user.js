const User = require("../models/user");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    console.log("signup");
    // hâcher le mdp en first car asynchrone et prend du temps
    // puis enregeistrer le user dans la BD
    return bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: req.body.email, // adresse fournie dans le corps de la requête
                password: hash,
            });

            return user.save().then(() => {
                res.status(201).json({ message: "utilisateur créé" });
            });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};

exports.login = (req, res, next) => {
    console.log("login");
    // trouver le user dans la bd qui correspond à l'adresse mail rentrée par l'utilisateur de l'application.
    // s'il existe pas, renvoyer erreur
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ error: "utilisateur non trouvé" });
            }
            return bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        //mdp non valide
                        return res.status(401).json({ error: "mdp incorrect" });
                    }
                    res.status(200).json({
                        //bonne connection, on renvoie un objet json qui contient un user id (id de l'utilisateur dans la bd) + token (token cripté pour permettre la conncection de l'utilisateur)
                        userId: user._id,
                        token: jsonWebToken.sign(
                            { userId: user._id },
                            "RANDOM_TOKEN_SECRET",
                            { expiresIn: "24h" }
                        ),
                    });
                });
        })
        .catch((error) => {
            res.status(500).json({ error });
        });
};
