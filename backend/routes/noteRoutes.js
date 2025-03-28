const express = require("express");
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/export", noteController.exportNotes);

router
  .route("/:id")
  .get(noteController.getNoteById)
  .patch(noteController.updateNote)
  .delete(noteController.deleteNote);

router.route("/").get(noteController.getNotes).post(noteController.createNote);

module.exports = router;
