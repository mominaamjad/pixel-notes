const express = require("express");
const cors = require("cors");
const { httpLogger, logger } = require("./config/logger.js");
const userRoutes = require("./routes/userRoutes");

const app = express();

// HTTP request logging middleware
app.use(httpLogger);

// Standard middleware
app.use(cors());
app.use(express.json());

// mounting of routes
app.use("/api/users", userRoutes);

// global error handler
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    status: "error",
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred"
        : err.message,
  });
});

module.exports = app;
