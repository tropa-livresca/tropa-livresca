import express from "express";
import { enviarEmail } from "../controllers/clients/suporte.controller.js";

const router = express.Router();

router.post('/enviarEmail', enviarEmail);

export default router;