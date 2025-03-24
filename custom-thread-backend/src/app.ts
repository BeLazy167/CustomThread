import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { appConfig } from './config/app.config';
import { logger } from './config/logger';
import { requestLogger } from './middleware/request-logger.middleware';
import { errorHandler } from './middleware/error.middleware';
import { stripeWebhookHandler } from './controllers/order.controller';
import { v2 as cloudinary } from 'cloudinary';

// Import routes
import designRoutes from './routes/v1/design.routes';
import orderRoutes from './routes/v1/order.routes';

// Create Express app
const app = express();
const API_PREFIX = '/api/v1';

/**
 * CORS Configuration
 * - origin: '*' allows requests from any domain (all websites and UIs)
 * - credentials: true enables cookies and authentication headers
 * - methods: specifies allowed HTTP methods
 * - allowedHeaders: specifies which headers can be included in requests
 */
const corsOptions = {
    origin: appConfig.cors.origin,
    methods: [...appConfig.cors.methods], // Convert readonly array to mutable
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600,
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
    if (req.originalUrl === `${API_PREFIX}/orders/webhook`) {
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
    environment: appConfig.environment,
    cors: {
        origin: appConfig.cors.origin,
        methods: appConfig.cors.methods,
    },
});

// Register API Routes with their respective prefixes
app.use(`${API_PREFIX}/designs`, designRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);

// Stripe webhook needs raw body
app.post(
    `${API_PREFIX}/orders/webhook`,
    express.raw({ type: 'application/json' }),
    stripeWebhookHandler
);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        environment: appConfig.environment,
        timestamp: new Date().toISOString(),
    });
});

// Error handling
app.use(errorHandler);

/**
 * 404 handler for unmatched routes
 * Logs the attempted route and returns a standardized 404 response
 */
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 'error',
        message: 'Not Found',
        path: req.path,
    });
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: appConfig.cloudinary.cloudName,
    api_key: appConfig.cloudinary.apiKey,
    api_secret: appConfig.cloudinary.apiSecret,
});

export default app;
