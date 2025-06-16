import express from "express";
import { getWebSettings } from "../controllers/websettings.controller.js";
const router = express.Router();

router.post("/websettings", getWebSettings);

export default router;
