import express from "express";
import { AuthController } from "./auth.controller.js";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.get("/signin/google", AuthController.signinComGoogle);
router.post("/signin/google", AuthController.signinComGoogle);
router.post("/signout", AuthController.signout);
router.post("/refresh", AuthController.refreshSession);
router.post("/session", AuthController.setSession);

router.patch("/senha", checkAuth, AuthController.atualizarSenhaAntiga);

router.post("/redefinir-senha", AuthController.redefinirSenha);
router.post("/esquecer-senha", AuthController.esqueciSenha);
router.get(/callback-redefinir-senha/, AuthController.callbackRedefinirSenha);

router.patch("/senha", checkAuth, AuthController.atualizarSenhaAntiga);

router.get("/session", checkAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.get("/perfil", checkAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

export default router;
