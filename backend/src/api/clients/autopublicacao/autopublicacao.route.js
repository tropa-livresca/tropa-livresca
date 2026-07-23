import express from "express";
import {AutopublicacaoController} from "./autopublicacao.controller.js";
import {checkAuth } from "../../common/middlewares/auth.middleware.js";
import {upload} from "../../common/middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", checkAuth, AutopublicacaoController.GetLivrosById);

router.post(
  "/upload-url",
  checkAuth,
  AutopublicacaoController.CriarUploadLivro,
);

router.post(
  "/insertLivro",
  checkAuth,
  AutopublicacaoController.InsertLivro,
);

router.patch(
    "/updateEstado/:id/", 
    checkAuth, 
    AutopublicacaoController.UpdateEstado,
);

router.patch(
  "/ativo/:id/", 
  checkAuth, AutopublicacaoController.InativarLivro,
);

export default router;