const Note = require("../models/notes");
const { logger } = require("../config/logger");

exports.getNotes = async (req, res, next) => {
  try {
    const { tag, favorite, search } = req.query;

    const query = { user: req.user.id };

    if (tag) {
      query.tags = { $in: tag.split(",") };
    }

    if (favorite === "true") {
      query.isFavorite = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const result = await Note.find(query);

    res.status(200).json({
      status: "success",
      length: result.length,
      data: {
        notes: result,
      },
    });
  } catch (error) {
    logger.error(`Error fetching notes: ${error.message}`);
    res.status(500).json({
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      logger.error("Note does not exist");
      res.status(404).json({
        status: "not_found",
        message: "Note does not exist",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        note,
      },
    });
  } catch (error) {
    logger.error(`Error fetching notes: ${error.message}`);
    res.status(500).json({
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

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

exports.updateNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        title: req.body.title,
        content: req.body.content,
        tags: req.body.tags,
        color: req.body.content,
        isFavorite: req.body.isFavorite,
      }
    );

    if (!note) {
      return res.status(404).json({
        status: "not_found",
        message: "Note not found",
      });
    }

    logger.info(`Note updated: ${note._id}`);
    res.status(200).json({
      status: "success",
      data: {
        note,
      },
    });
  } catch (error) {
    logger.error(`Error updating note: ${error.message}`);
    res.status(400).json({
      message: "Failed to update note",
      error: process.env.NODE_ENV === "development" ? error.message : "",
    });
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        status: "not_found",
        message: "Note not found",
      });
    }

    logger.info(`Note deleted: ${req.params.id}`);
    res.status(204).json({
      status: "deleted",
      message: "Note deleted successfully",
    });
  } catch (error) {
    logger.error(`Error updating note: ${error.message}`);
    res.status(400).json({
      message: "Failed to update note",
      error: process.env.NODE_ENV === "development" ? error.message : "",
    });
  }
};

// exports.toggleFavorite
