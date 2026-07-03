import express from "express";
import {UpdatePerfil, GetPerfil} from "../controllers/clients/perfil.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get('/perfil/', checkAuth, GetPerfil);
router.put('/perfil/', checkAuth, upload.single('imagem'), UpdatePerfil);

export default router;
