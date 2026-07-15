import express from "express";
import { enviarEmail } from "./suporte.controller.js";

const router = express.Router();

router.post('/enviarEmail', enviarEmail);

export default router;