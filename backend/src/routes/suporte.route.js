import express from "express";
import { enviarEmail } from "../controllers/suporte.controller.js";

const router = express.Router();

router.post('/enviarEmail', enviarEmail);

export default router;