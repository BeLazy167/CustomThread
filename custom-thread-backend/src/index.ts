import express from "express";
import designRoutes from "./routes/designRoute";
import { errorMiddleware } from "./middlewares/error.middleware";
import connectDb from "./config/database";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3001;
connectDb();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
// Routes
app.use("/api/v1/designs", designRoutes);

// Error handling
app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
