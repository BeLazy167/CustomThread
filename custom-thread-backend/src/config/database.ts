import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDb = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        
        if (!mongoUri) {
            throw new Error("MongoDB URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB connected at host - ${conn.connection.host}`);
        
    } catch (error: any) {
        console.log("Error:",  error.message );
        process.exit(1);
    }
};

export default connectDb;