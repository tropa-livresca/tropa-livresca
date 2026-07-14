import express from "express";
import {
  GetLivros,
  GetLivrosById,
  GetLivrosByAutor,
  UpdateStatusAtivo,
  InsertLivro,
  CriarUploadLivro,
} from "../controllers/clients/livros.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/livros/", GetLivros);
router.post(
  "/livros/upload-url",
  checkAuth,
  CriarUploadLivro,
);
router.post(
  "/livros/insertLivro",
  checkAuth,
  InsertLivro,
);
router.get("/livros/:id", GetLivrosByAutor);
router.post("/meuslivros/updateA/:id/", UpdateStatusAtivo);
router.get("/meuslivros/", checkAuth, GetLivrosById);

export default router;
