const express = require("express");
const noteController = require("../controllers/noteController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.get("/export", noteController.exportNotes);

router.get("/download/:id", noteController.downloadNoteById);

router.get("/tags", noteController.getAllTagsForUser);

router.patch("/:id/favorite", protect, noteController.toggleFavorite);

router
  .route("/:id")
  .get(noteController.getNoteById)
  .patch(noteController.updateNoteById)
  .delete(noteController.deleteNoteById);

router.route("/").get(noteController.getNotes).post(noteController.createNote);

module.exports = router;
