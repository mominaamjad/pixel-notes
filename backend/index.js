const express = require("express");
const cors = require("cors");
const { httpLogger, logger } = require("./config/logger.js");
const userRoutes = require("./routes/userRoutes");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// HTTP request logging middleware
app.use(httpLogger);

// Standard middleware
app.use(cors());
app.use(express.json());

// mounting of routes
app.use("/api/users", userRoutes);

app.all("*", (req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
  });
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
