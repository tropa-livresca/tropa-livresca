import express from "express";
import { FuncionariosController } from "./funcionarios.controller.js";

const router = express.Router();

router.get("/", FuncionariosController.buscarFuncionarios);

router.patch("/:id", FuncionariosController.inativarFuncionario);

router.patch(
  "/:id/is_master",
  FuncionariosController.alterarIsMasterFuncionario,
);
router.patch("/:id/is_admin", FuncionariosController.promoverUsuario);

export default router;
