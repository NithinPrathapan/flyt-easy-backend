import express from "express";
import * as flightController from "../controllers/flight.controller.js";

const router = express.Router();

router.post("/", flightController.searchFlights);

export default router;
