import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// PostgreSQL Configuration
if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not defined");
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

// MongoDB Configuration
if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
}

const mongoClient = new MongoClient(process.env.MONGODB_URI);

export const connectMongo = async () => {
    try {
        await mongoClient.connect();
        console.log("Connected to MongoDB");
        return mongoClient.db(process.env.MONGODB_DB_NAME || "custom-thread");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

export const getMongoClient = () => mongoClient;
