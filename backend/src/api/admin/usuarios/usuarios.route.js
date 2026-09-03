import express from "express";
import { verificarAutenticacaoAdm } from "../../common/middlewares/auth.middleware.js";
import { UsuariosController } from "./usuarios.controller.js";

const router = express.Router();

router.get("/", UsuariosController.BuscarUsuarios);

export default router;