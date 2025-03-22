import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { appConfig } from './config/app.config';
import { logger } from './config/logger';
import { requestLogger } from './middleware/request-logger.middleware';

// Import routes
import designRoutes from './routes/v1/design.routes';
import orderRoutes from './routes/v1/order.routes';

// Create Express app
const app = express();

// CORS configuration - Apply first
const corsOptions = {
    origin: '*', // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
};

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

// Apply middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow cross-origin resource sharing
        crossOriginOpenerPolicy: { policy: 'unsafe-none' }, // Allow cross-origin window.opener access
    })
);
app.use(morgan('dev'));
app.use(compression());

// Setup request logging
app.use(requestLogger);

// Parse JSON bodies for all routes except the Stripe webhook
app.use((req, res, next) => {
    if (req.originalUrl === `${appConfig.apiPrefix}/orders/webhook`) {
        next();
    } else {
        express.json({ limit: '50mb' })(req, res, next);
    }
});
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Pre-flight requests
app.options('*', cors(corsOptions));

// Log API version and environment on startup
logger.info('API Configuration', {
    version: 'v1',
    environment: appConfig.env,
    cors: {
        origins: process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()),
        methods: corsOptions.methods,
    },
});

// API Routes
app.use(`${appConfig.apiPrefix}/designs`, designRoutes);
app.use(`${appConfig.apiPrefix}/orders`, orderRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
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
