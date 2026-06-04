import express from "express";
import {signup, signin, signout, refreshSession, setSession} from "../controllers/auth.controller.js";
import {checkAuth} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refresh", refreshSession);
router.post("/session", setSession);

router.get("/session", checkAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

router.get("/perfil", checkAuth, (req, res) => {
  return res.status(200).json({ user: req.user });
});

export default router;
