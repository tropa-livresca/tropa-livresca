import express from "express";
import { upload } from "../../common/middlewares/upload.middleware.js";
import { verificarAutenticacaoAdm } from "../../common/middlewares/auth.middleware.js";
import { RevisaoController } from "./revisao.controller.js";

const router = express.Router();

router.get("/", RevisaoController.BuscarRevisoes);
router.get("/livro", RevisaoController.BuscarLivroRevisao);
router.get("/livro/:id", RevisaoController.BuscarRevisaoByLivroId);
router.get("/:id", RevisaoController.BuscarRevisaoById);
router.get("/user/:id", RevisaoController.BuscarRevisaoByUserId);
router.get(
  "/verificarRevisor/:livroId",
  verificarAutenticacaoAdm,
  RevisaoController.VerificarRevisor,
);
router.post(
  "/",
  upload.single("manuscritoRevisto"),
  RevisaoController.CriarRevisao,
);
router.put(
  "/:id",
  upload.single("manuscritoRevisto"),
  RevisaoController.AtualizarRevisao,
);
router.patch("/:id/completado", RevisaoController.CompletarRevisao);
router.patch("/estado-publicado", RevisaoController.PublicarLivro);
router.patch("/estado-recall", RevisaoController.SolicitarRecallLivro);
router.patch("/estado-negado", RevisaoController.NegarPublicacaoLivro);

export default router;
