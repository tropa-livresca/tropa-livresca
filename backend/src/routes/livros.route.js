
import express from "express";
import { GetLivros, GetLivrosDeAutor } from "../controllers/livros.controller.js";

const router = express.Router();

router.get("/livros/", GetLivros);
router.get("/livros/:autor", GetLivrosDeAutor );


export default router;
