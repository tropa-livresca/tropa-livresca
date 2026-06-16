
import express from "express";
import { GetLivros, GetLivrosById, GetLivrosByAutor, UpdateStatusAtivo, InsertLivro, UpdateTipoDePublicacao } from "../controllers/livros.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/livros/", GetLivros);
router.post("/livros/insertLivro", checkAuth, InsertLivro);
router.post("/livros/update/TDP/id/:tdp", UpdateTipoDePublicacao);
router.get("/livros/:id", GetLivrosByAutor);
router.post("/meuslivros/updateA/:id/", UpdateStatusAtivo);
router.get("/meuslivros/", checkAuth, GetLivrosById );

export default router;
