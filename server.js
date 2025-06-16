import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.routes.js";

dotenv.config();
// connectDB();

const app = express();
app.use(express.json());

app.use(routes);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Flyteasy Backend",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
