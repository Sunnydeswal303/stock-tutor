import express from "express";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);

export default app;
