import express from "express";
import { SuporteController} from "./suporte.controller.js";

const router = express.Router();

router.post('/enviarEmail', SuporteController.enviarEmail);

export default router;