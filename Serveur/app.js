const express = require("express");
const saucesRouter = require("./routes/sauce");
const userRouter = require("./routes/user");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
        "Access-Control-Allow-Origin",
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
    ],
    credentials: true,
};

const app = express(); // create the express app

app.options("*", cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

// gestion des fichiers images
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces/", saucesRouter);
app.use("/api/auth/", userRouter);

mongoose
    .connect(
        "mongodb+srv://user1:Hornets1218@cluster0.tguhf.mongodb.net/p6_BD?retryWrites=true&w=majority"
    )
    .then((result) => {
        app.listen(3000);
    })
    .catch((error) => {
        console.log("error", error);
    });
