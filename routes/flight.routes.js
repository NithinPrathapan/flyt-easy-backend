import express from "express";
import * as flightController from "../controllers/flight.controller.js";

const router = express.Router();

router.post("/search", flightController.searchFlights);

export default router;
