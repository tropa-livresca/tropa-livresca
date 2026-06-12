
import express from "express";
import { GetLivros, GetLivrosById, GetLivrosByAutor } from "../controllers/livros.controller.js";
import { checkAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/livros/", GetLivros);
router.get("/livros/:id", GetLivrosByAutor);
router.get("/meuslivros/", checkAuth, GetLivrosById );

export default router;
