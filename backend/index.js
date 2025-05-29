const express = require("express");
const cors = require("cors");
const { httpLogger } = require("./config/logger.js");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// HTTP request logging middleware
app.use(httpLogger);

// Standard middleware
app.use(cors());
app.use(express.json());

// mounting of routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.all("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});
// global error handler
app.use(globalErrorHandler);

module.exports = app;
