import express from 'express';
import { generateSignature } from '../controllers/signature.controller.js';
const router = express.Router();

router.post('/signature', generateSignature);

export default router;
