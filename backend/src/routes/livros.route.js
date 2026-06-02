
import express from "express";
import { GetLivros, GetLivrosDeAutor } from "../controllers/livros.controller.js";

const router = express.Router();

router.get("/", GetLivros);
router.get("/:autor", GetLivrosDeAutor);

export default router;
