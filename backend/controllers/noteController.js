const json2csv = require("json2csv");
const { logger } = require("../config/logger");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const Note = require("../models/notes");

const validateFormat = (format) => {
  format = format.toLowerCase();
  const validFormats = ["json", "csv", "txt"];

  if (!validFormats.includes(format)) {
    logger.error(`Invalid format requested: ${format}`);
    return next(
      new AppError(
        `Invalid format '${format}'. Supported formats are: ${validFormats.join(
          ", "
        )}`,
        400
      )
    );
  }
};

exports.createNote = catchAsync(async (req, res, next) => {
  const newNote = new Note({
    title: req.body.title || "",
    content: req.body.content,
    color: req.body.color || "#FFFFFF",
    user: req.user._id,
    tags: req.body.tags || [],
    isFavorite: false,
  });

  const note = await newNote.save();

  if (!note) {
    logger.error(`Failed to create note`);
    return next(new AppError("Error creating new note", 500));
  }

  logger.info(`Note created by user ${req.user._id}: ${note._id}`);

  res.status(201).json({
    status: "success",
    data: {
      note,
    },
  });
});

exports.getNotes = catchAsync(async (req, res, next) => {
  const { tag, favorite, color } = req.query;

  const query = { user: req.user._id };

  if (tag) {
    query.tags = { $in: tag.split(",") };
  }

  if (favorite === "true") {
    query.isFavorite = true;
  }

  if (color) {
    query.color = color;
  }

  const result = await Note.find(query);

  if (!result || result.length === 0) {
    logger.error(`No notes found for user ${req.user._id}`);
    return next(new AppError("No notes found!", 404));
  }

  logger.info(
    `Number of notes found for user "${req.user._id}": ${result.length}`
  );

  res.status(200).json({
    status: "success",
    length: result.length,
    data: {
      notes: result,
    },
  });
});

exports.getNoteById = catchAsync(async (req, res, next) => {
  const note = await Note.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    logger.error("Note does not exist");
    return next(new AppError("Note does not exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

exports.updateNoteById = catchAsync(async (req, res, next) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    {
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags,
      color: req.body.color,
      isFavorite: req.body.isFavorite,
      isArchived: req.body.isArchived,
    },
    { new: true }
  );

  if (!note) {
    logger.error(`Note not found or unauthorized access: ${req.params.id}`);
    return next(new AppError(`No note found for id ${req.params.id}`, 404));
  }

  logger.info(`Note updated: ${note._id}`);
  res.status(200).json({
    status: "success",
    data: {
      note,
    },
  });
});

exports.deleteNoteById = catchAsync(async (req, res, next) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!note) {
    logger.error(
      `Failed to delete note: ${req.params.id} - not found or unauthorized`
    );
    return next(new AppError(`No note found for id ${req.params.id}`, 404));
  }

  logger.info(`Note deleted: ${req.params.id}`);
  res.status(204).json({
    status: "deleted",
    message: "Note deleted successfully",
  });
});

exports.downloadNoteById = catchAsync(async (req, res, next) => {
  const noteId = req.params.id;
  const { format = "json" } = req.query;

  validateFormat(format);

  const note = await Note.findOne({
    _id: noteId,
    user: req.user._id,
  }).lean();

  if (!note) {
    return next(new AppError(`No note found for id ${noteId}`, 404));
  }

  if (format.toLowerCase() === "csv") {
    try {
      const fields = [
        "_id",
        "title",
        "content",
        "color",
        "isFavorite",
        "isArchived",
        "createdAt",
        "updatedAt",
      ];

      const csvData = {
        ...note,
        _id: note._id.toString(),
        tags: Array.isArray(note.tags) ? note.tags.join(", ") : "",
      };

      const json2csvParser = new json2csv.Parser({ fields });
      const csv = json2csvParser.parse([csvData]);

      // headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=note-${noteId}.csv`
      );
      return res.status(200).send(csv);
    } catch (error) {
      logger.error(`CSV conversion error for note ${noteId}: ${err.message}`);
      return next(new AppError("Error converting note to CSV format", 500));
    }
  } else if (format.toLowerCase() === "txt") {
    const content = `Title: ${note.title || "Untitled"}\n\n${note.content}`;

    res.setHeader("Content-Type", "text/plain");

    const fileName = (note.title || "note")
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}-${noteId}.txt`
    );
    return res.status(200).send(content);
  } else {
    // default to JSON
    return res.status(200).json({
      status: "success",
      data: { note },
    });
  }
});

exports.exportNotes = catchAsync(async (req, res, next) => {
  const { format = "json", tags } = req.query;

  validateFormat(format);

  const query = { user: req.user._id };

  if (tags) {
    query.tags = { $in: tags.split(",") };
  }

  const notes = await Note.find(query).lean();

  if (!notes || notes.length === 0) {
    logger.error(`No notes found to export for user ${req.user._id}`);
    return next(new AppError(`No notes found to export`, 404));
  }

  if (format.toLowerCase() === "csv") {
    try {
      const fields = ["title", "content", "tags", "createdAt", "updatedAt"];
      const json2csvParser = new json2csv.Parser({ fields });
      const csv = json2csvParser.parse(notes);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=notes-export.csv"
      );
      res.status(200).send(csv);
    } catch (error) {
      logger.error(`CSV conversion error: ${err.message}`);
      return next(new AppError("Error converting notes to CSV format", 500));
    }
  } else if (format.toLowerCase() === "txt") {
    const fileContent = notes
      .map((note) => {
        const title = note.title || "Untitled Note";
        const content = note.content || "No content available.";
        const tags =
          note.tags && note.tags.length > 0
            ? `Tags: ${note.tags.join(", ")}`
            : "No tags.";

        return `Title: ${title}\nContent:\n${content}\n${tags}\n\n---\n`;
      })
      .join("\n");

    res.setHeader("Content-Type", "text/plain");

    const fileName = `notes-export-${new Date().toISOString()}.txt`;
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    return res.status(200).send(fileContent);
  } else {
    res.status(200).json({
      status: "success",
      length: notes.length,
      data: { notes },
    });
  }
});
