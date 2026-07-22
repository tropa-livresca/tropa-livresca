import express from "express";
import { AuthController } from "./auth.controller.js";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/signin", AuthController.signin);
router.post("/signout", AuthController.signout);
router.post("/refresh", AuthController.refreshSession);
router.post("/session", AuthController.setSession);

router.get("/session", checkAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.get("/perfil", checkAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

export default router;
