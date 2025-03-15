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
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        // Connect to MongoDB with options
        const conn = await mongoose.connect(appConfig.database.url, options);

        // Log successful connection details
        if (conn.connection.host) {
            console.log(`MongoDB Connected: ${conn.connection.host}`);
        } else {
            // Handle case when host is undefined but connection succeeded
            const connDetails = {
                readyState: conn.connection.readyState,
                name: conn.connection.name,
                port: conn.connection.port,
                // Additional details that might help debugging
                db: conn.connection.db ? conn.connection.db.databaseName : 'unknown',
            };
            console.log(`MongoDB Connected successfully, but host is undefined.`);
            console.log(`Connection details: ${JSON.stringify(connDetails)}`);
        }
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
