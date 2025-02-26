import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { appConfig } from './config/app.config';
import { logger, stream } from './config/logger';
import { requestLogger } from './middleware/request-logger.middleware';

// Import routes
import designRoutes from './routes/v1/design.routes';

// Create Express app
const app = express();

// Connect to MongoDB
mongoose
    .connect(appConfig.database.url)
    .then(() => {
        logger.info('Connected to MongoDB', {
            url: appConfig.database.url.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'), // Hide credentials in logs
        });
    })
    .catch((error) => {
        logger.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Enable CORS for all routes
app.use(cors(appConfig.cors));

// Handle CORS errors
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
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
    next(err);
});

// Other middleware
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
        crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    })
);
app.use(compression());

// Setup request logging
app.use(morgan('combined', { stream }));
app.use(requestLogger);

// Parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Pre-flight requests
app.options('*', cors(appConfig.cors));

// Log API version and environment on startup
logger.info('API Configuration', {
    version: 'v1',
    environment: appConfig.env,
    cors: {
        origins: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()),
        methods: appConfig.cors.methods,
    },
});

// API Routes
app.use(`${appConfig.apiPrefix}/designs`, designRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Error:', { error: err.message, stack: err.stack });
    res.status(500).json({
        message: 'Internal Server Error',
        ...(appConfig.env === 'development' && { error: err.message }),
    });
});

// 404 handler
app.use((req: express.Request, res: express.Response) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    res.status(404).json({ message: 'Not Found' });
});

export default app;
