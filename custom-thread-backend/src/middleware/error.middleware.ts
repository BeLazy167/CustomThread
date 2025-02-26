import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { appConfig } from '../config/app.config';

export const errorMiddleware = (err: Error, req: Request, res: Response, _next: NextFunction) => {
    const errorContext = {
        error: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userId: (req as any).auth?.userId,
        body: req.body,
        query: req.query,
        params: req.params,
    };

    // Log the error with context
    logger.error('Request failed', errorContext);

    // If it's a CORS error, log it specifically
    if (err.message === 'Not allowed by CORS') {
        logger.warn('CORS error', {
            origin: req.headers.origin,
            method: req.method,
            url: req.originalUrl,
        });
        return res.status(403).json({
            message: 'CORS error: Origin not allowed',
            allowedOrigins: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()),
        });
    }

    // Send error response
    res.status(500).json({
        message: 'Internal Server Error',
        ...(appConfig.env === 'development' && { error: err.message, stack: err.stack }),
    });
};
