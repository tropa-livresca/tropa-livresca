import express from "express";
import {UpdateEstado, InsertLivro, CriarUploadLivro, GetLivrosById} from "./autopublicacao.controller.js";
import {checkAuth } from "../../common/middlewares/auth.middleware.js";
import {upload} from "../../common/middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", checkAuth, GetLivrosById);

router.post(
  "/upload-url",
  checkAuth,
  CriarUploadLivro,
);

router.post(
  "/insertLivro",
  checkAuth,
  InsertLivro,
);

router.patch(
    "/updateEstado/:id/", 
    checkAuth, 
    UpdateEstado,
);

export default router;