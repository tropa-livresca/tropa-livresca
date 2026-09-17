import express from "express";
import { UsuariosController } from "./usuarios.controller.js";

const router = express.Router();

router.get("/", UsuariosController.buscarUsuarios);
router.get("/:id", UsuariosController.BuscarUsuarioById);

export default router;
