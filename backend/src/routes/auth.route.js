import express from "express";
import {signup, signin, signout, refreshSession, setSession} from "../controllers/auth.controller.js";
import {checkAuth} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refresh", refreshSession);
router.post("/session", setSession);

router.get("/perfil", checkAuth, (req, res) => {
  res.json({message: "Rota privada",  user: req.user });
});

export default router;