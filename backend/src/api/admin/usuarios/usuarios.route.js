import express from "express";
import { UsuariosController } from "./usuarios.controller.js";

const router = express.Router();

router.get("/", UsuariosController.buscarUsuarios);
router.get("/:id", UsuariosController.BuscarUsuarioById);

router.patch("/:id/inativar", UsuariosController.inativarFuncionario);

router.patch("/:id/master", UsuariosController.alterarIsMasterFuncionario);

router.patch("/:id/promover", UsuariosController.promoverUsuario);

export default router;
