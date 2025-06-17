import express from "express";
import { generateToken } from "../controllers/signature.controller.js";

const router = express.Router();

router.post("/get-token", generateToken);

export default router;
