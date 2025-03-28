const express = require("express");
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.route("/").post(noteController.createNote);
module.exports = router;
