import pino from "pino";

const logger = pino({
  browser: {
    asObject: true, // Logs will be structured as objects instead of raw strings
  },
  level: import.meta.env.MODE === "development" ? "debug" : "info", // Debug in dev, Info in prod
});

export default logger;
