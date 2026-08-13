import express from "express";
import { RevisaoController } from "./revisao.controller";

const router = express.Router();

router.get("/", RevisaoController.BuscarRevisoes);
router.get("/:id", RevisaoController.BuscarRevisaoById);
router.post("/", RevisaoController.CriarRevisao);
router.put("/:id", RevisaoController.AtualizarRevisao);
router.patch("/:id/ativo", RevisaoController.InativarRevisao);

export default router;