const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const { createLogger, format, transports } = require("winston");

// Ensure the logs directory exists
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

// Create a Winston logger instance
const logger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({ filename: path.join(logDirectory, "error.log"), level: "error" }),
        new transports.File({ filename: path.join(logDirectory, "access.log") }),
    ],
});

// Morgan middleware to log HTTP requests
const accessLogStream = fs.createWriteStream(path.join(logDirectory, "access.log"), { flags: "a" });

const requestLogger = morgan("combined", {
    stream: accessLogStream, // Write logs to access.log
});

module.exports = { logger, requestLogger };
