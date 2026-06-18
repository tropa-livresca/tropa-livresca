import express from "express";
import { enviarEmail } from "../controllers/suporte.controller";

const router = Router();

router.post('/send', enviarEmail);

