import express from "express";
import {GetPerfil} from "../controllers/perfil.controller.js";
import {UpdatePerfil} from "../controllers/perfil.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get('/', checkAuth, GetPerfil);
router.put('/putPerfil', checkAuth, UpdatePerfil);

export default router;
