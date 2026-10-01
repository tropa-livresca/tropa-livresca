import express from "express";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { AvaliacaoController } from "./avaliacao.controller.js";

const router = express.Router();

// Média e quantidade de avaliações de um livro (público).
router.get("/livro/:id", AvaliacaoController.buscarResumoLivro);

// Avaliação do usuário logado para o livro e se ele pode avaliar.
router.get("/:id", checkAuth, AvaliacaoController.buscarAvaliacao);

// Cria ou atualiza a avaliação do usuário logado (:id = livro).
router.post("/:id", checkAuth, AvaliacaoController.salvarAvaliacao);

export default router;
