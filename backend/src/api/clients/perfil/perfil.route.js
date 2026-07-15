import express from "express";
import {UpdatePerfil, GetPerfil} from "./perfil.controller.js";

import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import {upload} from "../../common/middlewares/upload.middleware.js";

const router = express.Router();

router.get('/perfil/', checkAuth, GetPerfil);
router.put('/perfil/', checkAuth, upload.single('imagem'), UpdatePerfil);

export default router;
