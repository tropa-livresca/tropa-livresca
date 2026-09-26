import express from "express";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { AvaliacaoController } from "./avaliacao.controller.js";

const router = express.Router();

router.get("/", checkAuth, AvaliacaoController.buscarAvaliacoesLivro);
router.post("/", checkAuth, AvaliacaoController.criarAvaliacao);
router.patch("/:id", checkAuth, AvaliacaoController.alterarAvaliacao);

export default router;
