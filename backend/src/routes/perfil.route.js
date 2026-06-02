import express from "express";
import {GetPerfil} from "../controllers/perfil.controller.js";
import {UpdatePerfil} from "../controllers/perfil.controller.js";

const router = express.Router();

router.get('/', GetPerfil);
router.put('/', UpdatePerfil);

export default router;