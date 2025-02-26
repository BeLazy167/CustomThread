import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { appConfig } from './app.config';

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

// Tell winston about our colors
winston.addColors(colors);

// Define the format for our logs
const format = winston.format.combine(
    // Add timestamp
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    // Add colors
    winston.format.colorize({ all: true }),
    // Add metadata
    winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
    // Define the format of the message showing the timestamp, the level and the message
    winston.format.printf(
        (info) =>
            `${info.timestamp} ${info.level}: ${info.message}${
                Object.keys(info.metadata).length ? ` ${JSON.stringify(info.metadata)}` : ''
            }`
    )
);

// Define which transports we want to use for our logger
const transports = [
    // Write all logs with level 'error' and below to error.log
    new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '10m',
        maxFiles: '14d',
        format: winston.format.combine(winston.format.uncolorize()),
    }),
    // Write all logs with level 'info' and below to combined.log
    new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '10m',
        maxFiles: '14d',
        format: winston.format.combine(winston.format.uncolorize()),
    }),
];

// If we're not in production, log to the console as well
if (appConfig.env !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        })
    );
}

// Create the logger
const logger = winston.createLogger({
    level: appConfig.env === 'development' ? 'debug' : 'info',
    levels,
    format,
    transports,
});

// Create a stream object with a write function that will be used by morgan
const stream = {
    write: (message: string) => {
        logger.http(message.trim());
    },
};

export { logger, stream };
