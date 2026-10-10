import express from "express";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { AvaliacaoController } from "./avaliacao.controller.js";

const router = express.Router();

router.get("/livro/:id", AvaliacaoController.buscarResumoLivro);

router.get("/:id", checkAuth, AvaliacaoController.buscarAvaliacao);

router.post("/:id", checkAuth, AvaliacaoController.salvarAvaliacao);

export default router;
