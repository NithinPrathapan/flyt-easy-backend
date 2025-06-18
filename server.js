import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/index.routes.js";
import cors from "cors";
dotenv.config();
connectDB();

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/api", indexRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Flyteasy Backend",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
