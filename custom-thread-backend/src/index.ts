import express from "express";
import designRoutes from "./routes/design.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { connectMongo } from "./db/mongo";
import { uploadRouter } from "./uploadthing";
import { createRouteHandler } from "uploadthing/express";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Routes
app.use("/api/designs", designRoutes);

// Error handling
app.use(errorMiddleware);

// Initialize databases and start server
const initializeApp = async () => {
    try {
        await connectMongo();
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to initialize app:", error);
        process.exit(1);
    }
};

initializeApp();
