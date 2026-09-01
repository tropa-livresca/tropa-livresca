import express from "express";
import {upload} from "../../common/middlewares/upload.middleware.js";
import { RevisaoController } from "./revisao.controller.js";

const router = express.Router();

router.get("/", RevisaoController.BuscarRevisoes);
router.get("/:id" , RevisaoController.BuscarRevisaoById);
router.post("/", upload.single("manuscritoRevisto"), RevisaoController.CriarRevisao); 
router.put("/:id",  RevisaoController.AtualizarRevisao);
router.patch("/:id/ativo",  RevisaoController.InativarRevisao);
router.patch("/:id/estadoLivro",  RevisaoController.AlterarEstadoLivro);

export default router;
