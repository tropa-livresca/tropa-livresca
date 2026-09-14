import express from "express";
import { LivroController } from "./livros.controller.js";

const router = express.Router();

router.get("/", LivroController.BuscarLivros);
router.get("/:id", LivroController.BuscarLivroById);

export default router;