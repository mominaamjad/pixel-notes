const pino = require("pino");
const pinoHttp = require("pino-http");

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname",
    },
  },
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
});

const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    const statusCode = res.statusCode; // ✅ Get actual status code
    console.log(`🔥 Checking status: ${statusCode}`);

    if (statusCode === 401) return "warn";
    if (statusCode >= 400 && statusCode < 500) return "warn";
    if (statusCode >= 500 || err) return "error";
    return "info";
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req, err) => {
    return `${req.method} ${req.url} ${err.message}`;
  },
});

module.exports = { logger, httpLogger };
