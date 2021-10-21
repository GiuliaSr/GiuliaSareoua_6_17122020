const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validateLetters = (string) => {
    let regex = /^[a-zA-Z0-9]+$/i;
    if (string === "") {
        return console.log("merci de renseigner le champ par des caractères");
    } else {
        return regex.test(string);
    }
};

const sauceSchema = new Schema({
    userId: {
        type: String,
    },
    name: {
        type: String,
        require: true,
        validate: validateLetters,
    },
    manufacturer: {
        type: String,
        require: true,
        validate: validateLetters,
    },
    description: {
        type: String,
    },
    mainPepper: {
        type: String,
        require: true,
        validate: validateLetters,
    },
    imageUrl: {
        type: String,
    },
    heat: {
        type: Number,
        min: 1,
        max: 10,
    },
    likes: {
        type: Number,
    },
    dislikes: {
        type: Number,
    },
    usersLiked: {
        type: Array,
    },
    usersDisliked: {
        type: Array,
    },
});

module.exports = mongoose.model("sauce", sauceSchema);
