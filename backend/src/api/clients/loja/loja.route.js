import express from "express";

import { LojaController } from "./loja.controller.js";

const router = express.Router();

router.get("/", LojaController.buscarLivros);
router.get("/:id", LojaController.buscarLivroById);

export default router;
