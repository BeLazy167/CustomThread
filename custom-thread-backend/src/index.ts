import app from './app';
import { appConfig } from './config/app.config';
import { logger } from './config/logger';
import connectDb from './config/database';

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDb();

        // Start the server
        app.listen(appConfig.server.port, () => {
            logger.info(`Server is running on port ${appConfig.server.port}`);
            logger.info(`Environment: ${appConfig.environment}`);
            logger.info(`API Base URL: /api/v1`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
