import express from "express";
import { verificarAutenticacaoAdm } from "../../common/middlewares/auth.middleware.js";
import { FuncionariosController } from "./funcionarios.controller.js";

const router = express.Router();

router.patch("/", FuncionariosController.alterarFuncao);
router.patch("/funcao", FuncionariosController.atualizarFuncao);
router.delete("/", FuncionariosController.deletarFuncionario);

export default router;