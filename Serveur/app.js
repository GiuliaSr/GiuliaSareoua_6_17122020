const express = require("express");
const app = express();
const saucesRouter = require("./routes/sauce");
const userRouter = require("./routes/user");
const mongoose = require("mongoose");
// const { error } = require("console");

app.use(express.json());
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
