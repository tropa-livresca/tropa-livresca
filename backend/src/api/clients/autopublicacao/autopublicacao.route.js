import express from "express";

import { AutopublicacaoController } from "./autopublicacao.controller.js";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", checkAuth, AutopublicacaoController.buscarComFiltros);

router.get("/:id", checkAuth, AutopublicacaoController.buscarLivroById);

router.post(
  "/upload-url",
  checkAuth,
  AutopublicacaoController.criarUploadLivro,
);

router.post("/", checkAuth, AutopublicacaoController.criarLivro);

router.patch(
  "/estado/:id",
  checkAuth,
  AutopublicacaoController.atualizarEstado,
);

router.patch("/:id", checkAuth, AutopublicacaoController.atualizarLivro);

router.delete("/:id", checkAuth, AutopublicacaoController.deletarLivroRascunho);

export default router;
