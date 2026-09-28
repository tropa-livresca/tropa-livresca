import express from "express";
const router = express.Router();

import { verificarAutenticacaoAdm } from "../../common/middlewares/auth.middleware.js";
import { EnderecoController } from "./endereco.controller.js";

router.get(
  "/:id",
  verificarAutenticacaoAdm,
  EnderecoController.BuscarEnderecos,
);

export default router;
