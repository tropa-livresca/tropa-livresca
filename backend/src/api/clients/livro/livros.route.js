import express from "express";
import { LivrosController } from "./livros.controller.js";

const router = express.Router();

router.get("/", LivrosController.GetLivros);
router.get("/detalhes/:id", LivrosController.GetLivrosById);

export default router;
