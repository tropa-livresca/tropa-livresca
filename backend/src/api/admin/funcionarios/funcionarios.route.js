import express from "express";
import { FuncionariosController } from "./funcionarios.controller.js";

const router = express.Router();

router.get("/", FuncionariosController.buscarFuncionarios);
router.get("/:id", FuncionariosController.buscarFuncionarioById);
router.patch("/funcao", FuncionariosController.alterarFuncao);
router.patch("/isadmin", FuncionariosController.alterarIsAdminFuncionario);

export default router;
