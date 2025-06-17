import express from "express";
import * as flightController from "../controllers/searchFlights.controller.js";

const router = express.Router();

router.post("/express-search", flightController.expressSearchFlights);

export default router;
