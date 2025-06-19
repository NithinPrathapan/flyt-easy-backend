import express from "express";
import * as flightController from "../controllers/searchFlights.controller.js";
import { authenticateToken } from "../middleware/authenticateToken.js";
const router = express.Router();

router.post(
  "/express-search",
  authenticateToken,
  flightController.expressSearchFlights
);

export default router;
