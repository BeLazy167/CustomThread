import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { appConfig } from '../config/app.config';

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    const statusCode = (err as AppError).statusCode || 500;
    const status = (err as AppError).status || 'error';

    logger.error('Error:', {
        message: err.message,
        stack: err.stack,
        statusCode,
        path: req.path,
    });

    const errorResponse = {
        status,
        message: err.message,
    };

    if (appConfig.environment === 'development') {
        Object.assign(errorResponse, { stack: err.stack });
    }

    res.status(statusCode).json(errorResponse);
};
