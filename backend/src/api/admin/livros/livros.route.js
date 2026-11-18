import express from "express";
import { LivroController } from "./livros.controller.js";

const router = express.Router();

router.get("/", LivroController.BuscarLivros);
router.get("/user/:id", LivroController.BuscarLivroByUserId);
router.get("/:id", LivroController.BuscarLivroById);
router.patch("/:id/ativo", LivroController.AlterarAtivoLivro);

export default router;
