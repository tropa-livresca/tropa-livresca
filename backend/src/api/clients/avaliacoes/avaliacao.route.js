import express from "express";
import { AvaliacaoController } from "./avaliacao.controller.js";

const router = express.Router();

router.get("/", AvaliacaoController.buscarAvaliacoesLivro);
router.post("/", AvaliacaoController.criarAvaliacao);
router.patch("/:id", AvaliacaoController.alterarAvaliacao);

export default router;
