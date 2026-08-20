import express from "express";
import {checkAuth} from "../../common/middlewares/auth.middleware.js";
import { RevisaoController } from "./revisao.controller.js";

const router = express.Router();

router.get("/", checkAuth, RevisaoController.BuscarRevisoes);
router.get("/:id", checkAuth, RevisaoController.BuscarRevisaoById);
router.post("/", checkAuth, RevisaoController.CriarRevisao);
router.put("/:id", checkAuth, RevisaoController.AtualizarRevisao);
router.patch("/:id/ativo", checkAuth, RevisaoController.InativarRevisao);
router.patch("/:id/estadoLivro", checkAuth, RevisaoController.AlterarEstadoLivro);

export default router;
