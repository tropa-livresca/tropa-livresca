import express from "express";
import { CategoriasController } from "./categorias.controller.js";
import { checkAuth } from "../../common/middlewares/auth.middleware.js"; 

const router = express.Router();

router.get("/", CategoriasController.BuscarCategorias);
router.get("/:id", CategoriasController.BuscarCategoriaById);

router.post("/", checkAuth, CategoriasController.CriarCategoria);
router.put("/:id", checkAuth, CategoriasController.AtualizarCategoria);
router.patch("/:id/ativo", checkAuth, CategoriasController.InativarCategoria);

export default router;
