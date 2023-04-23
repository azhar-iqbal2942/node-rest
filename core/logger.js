const winston = require("winston");
/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
require("winston-mongodb");

/**
 * Log Levels
 * error
 * warn
 * info
 * verbose
 * debug
 * silly
 * Note: if set to warn
 * - Error
 * - Waring logs will be added
 */
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.metadata(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    // based on requirements change database
    new winston.transports.MongoDB({
      db: "mongodb://0.0.0.0:27017/vidly",
      level: "error",
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "logs/exceptions.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "logs/rejections.log" }),
  ],
});

module.exports = logger;
