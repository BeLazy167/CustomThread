import mongoose from 'mongoose';
import { appConfig } from './app.config';

const connectDb = async (): Promise<void> => {
    try {
        // Log the MongoDB URI (with sensitive parts redacted) to help with debugging
        const maskedUri = appConfig.database.url
            ? appConfig.database.url.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@')
            : 'undefined';
        console.log(`Attempting MongoDB connection to: ${maskedUri}`);

        // Set mongoose connection options
        const options = {
            serverSelectionTimeoutMS: 10000, // Increased timeout to 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        // Connect to MongoDB with options
        await mongoose.connect(appConfig.database.url, options);

        // Wait a moment to ensure connection is fully established
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Verify connection state after connecting
        if (mongoose.connection.readyState !== 1) {
            throw new Error(
                `MongoDB connection not fully established. Current state: ${mongoose.connection.readyState}`
            );
        }

        // Log successful connection details
        const connDetails = {
            readyState: mongoose.connection.readyState,
            name: mongoose.connection.name,
            host: mongoose.connection.host || 'unknown',
            port: mongoose.connection.port,
            db: mongoose.connection.db ? mongoose.connection.db.databaseName : 'unknown',
        };

        console.log(`MongoDB Connected: ${connDetails.host}`);
        console.log(
            `Database: ${connDetails.db}, Connection state: ${connDetails.readyState === 1 ? 'connected' : 'not fully connected'}`
        );
    } catch (error: any) {
        console.error('MongoDB connection error:');
        if (error.name === 'MongoParseError') {
            console.error('Invalid MongoDB connection string format');
        } else if (error.name === 'MongoServerSelectionError') {
            console.error('Could not connect to any servers in the MongoDB cluster');
        }
        console.error(error);
        process.exit(1);
    }
};

export default connectDb;
