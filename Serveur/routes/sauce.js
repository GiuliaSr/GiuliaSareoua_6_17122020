const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const sauceController = require("../controllers/sauce");

router.get("/", auth, sauceController.getSauces);
router.get("/:id", auth, sauceController.getSauce);
router.post("/", auth, multer, sauceController.createSauce);
router.put("/:id", auth, multer, sauceController.modifySauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.toogleLike);

module.exports = router;
