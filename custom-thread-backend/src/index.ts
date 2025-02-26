import express from "express";
import designRoutes from "./routes/designRoute";
import { errorMiddleware } from "./middlewares/error.middleware";
import connectDb from "./config/database";



const app = express();
const port = process.env.PORT || 3001;
connectDb();

app.use(express.json());


// Routes
app.use("/api/v1/designs", designRoutes);

// Error handling
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
