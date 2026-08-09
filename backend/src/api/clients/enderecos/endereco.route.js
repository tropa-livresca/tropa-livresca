import express from "express";
const router = express.Router();

import {checkAuth} from "../../common/middlewares/auth.middleware.js";
import {EnderecoController} from "./endereco.controller.js";
 
router.get("/", checkAuth, EnderecoController.BuscarEnderecos);
router.get("/:id", checkAuth,EnderecoController.BuscarEnderecoById);
router.post("/", checkAuth, EnderecoController.CriarEndereco);
router.put("/:id", checkAuth, EnderecoController.AtualizarEnderecoById);
router.patch("/:id/ativo", checkAuth, EnderecoController.InativarEndereco);

export default router;

