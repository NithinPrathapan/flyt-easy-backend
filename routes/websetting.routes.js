import express from "express";
import { getWebSettings } from "../controllers/websettings.controller.js";
const router = express.Router();

router.post("/", getWebSettings);

export default router;
