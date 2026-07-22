import {Router} from "express";
import {AuthController} from "./auth.controller.js";

const router = Router();

router.post("/signin", AuthController.signin);
router.post("/alterar-senha", AuthController.atualizarSenhaPrimeiroAcesso);

export default router;