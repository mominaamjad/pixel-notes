const express = require("express");
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.route("/").get(noteController.getNotes).post(noteController.createNote);
router.route("/:id").get(noteController.getNoteById);
module.exports = router;
