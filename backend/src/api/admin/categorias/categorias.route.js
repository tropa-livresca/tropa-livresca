import express from "express";
import { CategoriasController } from "./categorias.controller.js";

const router = express.Router();

router.get("/", CategoriasController.BuscarCategorias);
router.get("/:id", CategoriasController.BuscarCategoriaById);
router.post("/", CategoriasController.CriarCategoria);
router.put("/:id", CategoriasController.AtualizarCategoria);
router.patch("/:id/ativo", CategoriasController.InativarCategoria);

export default router;