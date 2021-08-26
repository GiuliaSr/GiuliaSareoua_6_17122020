const user = require("../models/user");
const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");

exports.signup = (req, res, next) => {
    // hâcher le mdp en first car asynchrone et prend du temps
    // puis enregeistrer le user dans la BD
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new user({
                email: req.body.email, // adresse fournie dans le corps de la requête
                password: hash,
            });
            user.save()
                .then(() =>
                    res.status(201).json({ message: "utilisateur créé" })
                )
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    console.log("login ok");
    // trouver le user dans la bd qui correspond à l'adresse mail rentrée par l'utilisateur de l'application.
    // s'il existe pas, renvoyer erreur
    user.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res
                    .status(401)
                    .json({ error: "utilisateur non trouvé" });
            }
            bcrypt
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
                            "RANDOM_TOKEN_SERCRET",
                            { epiresIn: "24h" }
                        ),
                    });
                })
                .catch((error) => res.status(501).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};
