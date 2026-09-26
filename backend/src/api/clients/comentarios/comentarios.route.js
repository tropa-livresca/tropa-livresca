import express from "express";
import checkAuth from "../../common/middlewares/auth.middleware.js";
import { ComentarioController } from "./comentarios.controller.js";

const router = express.Router();

router.get("/", ComentarioController.buscarComentarios);
router.post("/", checkAuth, ComentarioController.criarComentario);
router.patch("/:id", checkAuth, ComentarioController.atualizarComentario);
router.delete("/:id", checkAuth, ComentarioController.deletarComentario);

export default router;
