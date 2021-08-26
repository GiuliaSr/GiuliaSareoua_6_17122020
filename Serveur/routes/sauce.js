const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const sauceController = require("../controllers/sauce");

router.get("/", auth, sauceController.getSauces);
router.get("/:id", auth, sauceController.getSauce);
router.post("/", auth, sauceController.createSauce);
router.put("/", auth, sauceController.modifySauce);
router.delete("/", auth, sauceController.deleteSauce);
router.post("/:id", auth, sauceController.like);

module.exports = router;
