const app = require("./index");
const { logger } = require("./config/logger");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

process.on("uncaughtException", (error) => {
  logger.fatal({
    message: "Uncaught Exception",
    error,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.fatal({
    message: "Unhandled Rejection",
    reason,
    promise,
  });
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    // on start
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });

    // shutdown
    process.on("SIGTERM", () => {
      logger.info("SIGTERM received. Shutting down gracefully");
      server.close(() => {
        logger.info("Process terminated");
        process.exit(0);
      });
    });
  } catch (error) {
    logger.fatal({
      message: "Failed to start server",
      error,
    });
    process.exit(1);
  }
};

startServer();
