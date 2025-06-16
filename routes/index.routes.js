import express from "express";
import signatureRoutes from "./signature.routes.js";
import webSettingsRoutes from "./websetting.routes.js";

const router = express.Router();

router.use("/api/utils", signatureRoutes);
router.use("/api/utils", webSettingsRoutes);

export default router;
