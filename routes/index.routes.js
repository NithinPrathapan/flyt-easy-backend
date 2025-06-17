import express from "express";
import flightRoutes from "./flight.routes.js";
import signatureRoutes from "./signature.routes.js";

const router = express.Router();

router.use("/flight", flightRoutes);
router.use("/signature", signatureRoutes);
export default router;
