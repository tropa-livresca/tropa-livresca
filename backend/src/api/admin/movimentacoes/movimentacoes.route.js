import { MovimentacoesController } from "./movimentacoes.controller.js";
import express from "express";

const router = express.Router();

router.get("/", MovimentacoesController.buscarDadosMovimentacoesEditora);
router.get(
  "/:usuarioid",
  MovimentacoesController.buscarDadosMovimentacoesAutor,
);
router.patch("/:vendaid", MovimentacoesController.autorizarDepositoContaAutor);

export default router;
