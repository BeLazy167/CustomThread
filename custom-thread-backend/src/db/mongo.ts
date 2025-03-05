import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
}

const client = new MongoClient(process.env.MONGODB_URI);

export const connectMongo = async () => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db(process.env.MONGODB_DB_NAME || 'custom-thread');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export const getMongoClient = () => client;
