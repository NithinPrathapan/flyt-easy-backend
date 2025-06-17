import express from "express";
import * as flightController from "../controllers/searchFlights.controller.js";

const router = express.Router();

router.post("/search", flightController.searchFlights);

export default router;
