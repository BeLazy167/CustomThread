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

/**
 * CORS Configuration
 * - origin: '*' allows requests from any domain (all websites and UIs)
 * - credentials: true enables cookies and authentication headers
 * - methods: specifies allowed HTTP methods
 * - allowedHeaders: specifies which headers can be included in requests
 */
const corsOptions = {
    origin: appConfig.cors.origin || '*', // Use configured origin from env or fallback to all origins
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
app.use(cors(corsOptions)); // Apply CORS middleware first to handle preflight requests
app.use(express.json());
app.use(
    helmet({
        // Configure helmet for cross-origin resource sharing
        crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow resources to be shared across origins
        crossOriginOpenerPolicy: { policy: 'unsafe-none' }, // Allow cross-origin window.opener access
    })
);
app.use(morgan('dev')); // HTTP request logger
app.use(compression()); // Compress responses to improve performance

// Setup request logging middleware
app.use(requestLogger);

/**
 * Custom middleware to handle JSON parsing
 * - Skips JSON parsing for Stripe webhook endpoint (which needs raw body)
 * - Sets a higher limit (50mb) for JSON payloads to handle large requests
 */
app.use((req, res, next) => {
    if (req.originalUrl === `${appConfig.apiPrefix}/orders/webhook`) {
        next();
    } else {
        express.json({ limit: '50mb' })(req, res, next);
    }
});
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle preflight (OPTIONS) requests for all routes
app.options('*', cors(corsOptions));

/**
 * Custom middleware to explicitly set Access-Control-Allow-Origin header
 * This ensures all responses include this header, allowing any website to access the API
 * This is a belt-and-suspenders approach in addition to the CORS middleware
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // Allow all methods
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, X-Requested-With, Accept'
    ); // Allow common headers
    next();
});

// Log API version and environment on startup
logger.info('API Configuration', {
    version: 'v1',
    environment: appConfig.env,
    cors: {
        origins: '*', // Logging that we're allowing all origins
        methods: corsOptions.methods,
    },
});

// Register API Routes with their respective prefixes
app.use(`${appConfig.apiPrefix}/designs`, designRoutes);
app.use(`${appConfig.apiPrefix}/orders`, orderRoutes);

/**
 * Global error handling middleware
 * Catches any errors thrown in routes or middleware and returns a standardized response
 * In development mode, includes the error message for debugging
 */
app.use((err: Error, req: express.Request, res: express.Response) => {
    logger.error('Error:', { error: err.message, stack: err.stack });
    res.status(500).json({
        message: 'Internal Server Error',
        ...(appConfig.env === 'development' && { error: err.message }),
    });
});

/**
 * 404 handler for unmatched routes
 * Logs the attempted route and returns a standardized 404 response
 */
app.use((req: express.Request, res: express.Response) => {
    logger.warn(`Route not found: ${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });
    res.status(404).json({ message: 'Not Found' });
});

export default app;
