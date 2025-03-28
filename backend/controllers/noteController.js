const Note = require("../models/notes");
const { logger } = require("../config/logger");

// exports.getNote

exports.createNote = async (req, res, next) => {
  try {
    const newNote = new Note({
      title: req.body.title || "",
      content: req.body.content,
      color: req.body.color || "#FFFFFF",
      user: req.user.id,
      tags: req.body.tags || [],
      isFavorite: false,
    });

    const note = await newNote.save();

    logger.info(`Note created by user ${req.user.id}: ${note._id}`);

    res.status(201).json({
      status: "success",
      data: {
        note,
      },
    });
  } catch (error) {
    logger.error(`Error creating note: ${error.message}`);
    res.status(400).json({
      message: "Failed to create note",
      error: error.message,
    });
  }
  // save note
  // send response
};

// exports.editNote

// exports.deleteNote

// exports.toggleFavorite
