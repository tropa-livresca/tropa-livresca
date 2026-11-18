import express from "express";
import { LivrosController } from "./livros.controller.js";

const router = express.Router();

router.get("/", LivrosController.buscarLivros);
router.get("/:id", LivrosController.buscarLivroById);

export default router;
