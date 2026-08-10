import express from "express";
import { AutopublicacaoController } from "./autopublicacao.controller.js";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", checkAuth, AutopublicacaoController.GetLivrosById);

router.get("/buscar", checkAuth, AutopublicacaoController.BuscarComFiltros);

router.post(
  "/upload-url",
  checkAuth,
  AutopublicacaoController.CriarUploadLivro,
);

router.post("/insertLivro", checkAuth, AutopublicacaoController.InsertLivro);

router.put("/updateLivro/:id", checkAuth, AutopublicacaoController.UpdateLivro);

router.patch(
  "/updateEstado/:id",
  checkAuth,
  AutopublicacaoController.UpdateEstado,
);

router.patch("/ativo/:id", checkAuth, AutopublicacaoController.InativarLivro);

router.delete(
  "/rascunho/:id",
  checkAuth,
  AutopublicacaoController.DeletarLivroRascunho,
);

export default router;
