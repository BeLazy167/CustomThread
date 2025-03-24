import mongoose from 'mongoose';
import { logger } from './logger';
import { appConfig } from './app.config';

const connectDb = async () => {
    try {
        const mongoUri = appConfig.database.url;
        logger.info(`Attempting MongoDB connection to: ${mongoUri}`);

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
        });

        mongoose.connection.on('connected', () => {
            logger.info('MongoDB connection established successfully');
        });

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB connection disconnected');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                logger.info('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                logger.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });
    } catch (error) {
        logger.error('MongoDB connection error:', error);
        // Retry connection after 5 seconds
        setTimeout(connectDb, 5000);
    }
};

export default connectDb;
