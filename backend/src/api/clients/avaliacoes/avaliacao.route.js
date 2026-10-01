import express from "express";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { AvaliacaoController } from "./avaliacao.controller.js";

const router = express.Router();

router.get("/", AvaliacaoController.buscarAvaliacoesLivro);
router.get("/:id", checkAuth, AvaliacaoController.buscarAvaliacaoLivro);
router.post("/:id", checkAuth, AvaliacaoController.criarAvaliacao);
router.patch("/:id", checkAuth, AvaliacaoController.alterarAvaliacao);

export default router;
