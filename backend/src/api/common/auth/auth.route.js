import express from "express";
import { AuthController } from "./auth.controller.js";
import {
  checkAuth,
  verificarAutenticacaoAdm,
  verificarAutenticacaoAdmMaster,
} from "../../common/middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signin-adm", AuthController.signinAdm);

router.post("/signout-adm", AuthController.signoutAdm);
router.patch(
  "/senhaadm",
  verificarAutenticacaoAdm,
  AuthController.alterarSenhaAdm,
);

router.get(
  "/session-adm",
  verificarAutenticacaoAdm,
  AuthController.getSessionAdm,
);

router.get(
  "/session-adm-master",
  verificarAutenticacaoAdmMaster,
  AuthController.getSessionAdm,
);

router.patch(
  "/senhaantiga",
  verificarAutenticacaoAdm,
  AuthController.alterarSenhaAntiga,
);

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.post("/signout", AuthController.signout);
router.post("/refresh", AuthController.refreshSession);
router.post("/session", AuthController.setSession);
router.post("/redefinir-senha", AuthController.redefinirSenha);
router.post("/esquecer-senha", AuthController.esqueciSenha);
router.get("/callback-redefinir-senha/", AuthController.callbackRedefinirSenha);
router.patch("/senha", checkAuth, AuthController.atualizarSenhaAntiga);

router.get("/session", checkAuth, AuthController.getSession);
router.get("/perfil", checkAuth, AuthController.getSession);

export default router;
