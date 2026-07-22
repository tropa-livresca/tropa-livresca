import express from "express";
import {PerfilController} from "./perfil.controller.js";

import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import {upload} from "../../common/middlewares/upload.middleware.js";

const router = express.Router();

router.get('/', checkAuth, PerfilController.GetPerfil);
router.put('/', checkAuth, upload.single('imagem'), PerfilController.UpdatePerfil);

export default router;
