import mongoose from 'mongoose';
import { appConfig } from './app.config';

const connectDb = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(appConfig.database.url);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDb;
