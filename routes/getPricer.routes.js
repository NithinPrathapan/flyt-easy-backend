import express from "express";
import { getPricer } from "../controllers/getPricer.controller.js";

const router = express.Router();

router.post("/getpricer", getPricer);

export default router;
