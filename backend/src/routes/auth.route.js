import express from "express";
import {signup, signin, signout, refreshSession, setSession} from "../controllers/auth.controller.js";
import {checkAuth} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/signin", signin);
router.post("/auth/signout", signout);
router.post("/auth/refresh", refreshSession);
router.post("/auth/session", setSession);

router.get("/auth/session", checkAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.get("/auth/perfil", checkAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

export default router;
