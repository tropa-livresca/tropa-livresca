import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { verificarAutenticacaoAdm } from "../../common/middlewares/auth.middleware.js";

const router = Router();

router.post("/signin", AuthController.signin);
router.patch("/senha", verificarAutenticacaoAdm, AuthController.atualizarSenha);

export default router;
