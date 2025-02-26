import { ErrorRequestHandler } from 'express';
import { errorMiddleware } from './middleware/error.middleware';
import connectDb from './config/database';
import expressApp from './app';
import { appConfig } from './config/app.config';
import { logger } from './config/logger';
import mongoose from 'mongoose';

const port = process.env.PORT || 3001;
connectDb();

const app = expressApp;

// Error handling
app.use(errorMiddleware as ErrorRequestHandler);

const server = app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    logger.info(`Environment: ${appConfig.env}`);
    logger.info(`API Base URL: ${appConfig.apiPrefix}`);
});

// Handle graceful shutdown
const gracefulShutdown = (signal: string) => {
    logger.info(`${signal} signal received. Starting graceful shutdown...`);
    server.close(() => {
        logger.info('HTTP server closed');
        mongoose.connection
            .close(false)
            .then(() => {
                logger.info('MongoDB connection closed');
                process.exit(0);
            })
            .catch((err) => {
                logger.error('Error during MongoDB connection closure:', err);
                process.exit(1);
            });
    });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
