import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { verificarAutenticacaoAdm } from "../../common/middlewares/auth.middleware.js";

const router = Router();

router.post("/signin", AuthController.signin);
router.patch("/senha", verificarAutenticacaoAdm, AuthController.atualizarSenha);
router.post("/signout", AuthController.signout);
router.post("/refresh", AuthController.refreshSession);
router.post("/session", AuthController.setSession);


export default router;
