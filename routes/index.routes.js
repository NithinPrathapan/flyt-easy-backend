import express from "express";
import flightRoutes from "./flight.routes.js";
import signatureRoutes from "./signature.routes.js";
import webSettingsRoutes from "./websetting.routes.js";
import airportRoutes from "./airport.routes.js";
const router = express.Router();

router.use("/flight", flightRoutes);
router.use("/signature", signatureRoutes);
router.use("/websetting", webSettingsRoutes);
router.use("/airport", airportRoutes);
export default router;
