import winston from 'winston';
import { env } from './env.config';

const { combine, timestamp, json, colorize, align, printf } = winston.format;

const customFormat = printf(({ level, message, timestamp, metadata }) => {
    return `${timestamp} [${level}]: ${message}${
        metadata && Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : ''
    }`;
});

const developmentFormat = combine(colorize(), timestamp(), align(), customFormat);

const productionFormat = combine(timestamp(), json());

const logger = winston.createLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: env.NODE_ENV === 'development' ? developmentFormat : productionFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
        }),
    ],
});

// Create a stream object with a write function that will be used by morgan
const stream = {
    write: (message: string) => {
        logger.http(message.trim());
    },
};

export { logger, stream };
