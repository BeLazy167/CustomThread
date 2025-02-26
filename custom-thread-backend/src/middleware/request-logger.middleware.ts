import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    // Log request start
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);

    // Create context object for logging
    const logContext = {
        requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        userId: (req as any).auth?.userId,
        body: req.method !== 'GET' ? req.body : undefined,
        query: Object.keys(req.query).length > 0 ? req.query : undefined,
        params: Object.keys(req.params).length > 0 ? req.params : undefined,
    };

    // Log request start
    logger.info(`Incoming ${req.method} request to ${req.originalUrl}`, logContext);

    // Log response
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const responseContext = {
            ...logContext,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        };

        if (res.statusCode >= 400) {
            logger.warn(`Request failed with status ${res.statusCode}`, responseContext);
        } else {
            logger.info(`Request completed with status ${res.statusCode}`, responseContext);
        }
    });

    next();
};
