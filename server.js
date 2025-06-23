import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/index.routes.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
dotenv.config();
connectDB();
const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
app.use(express.static("public"));

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api", indexRoutes);

// const PORT = process.env.PORT || 5000;
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
