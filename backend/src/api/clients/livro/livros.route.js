import express from "express";
 
import {
  LivrosController
} from "./livros.controller.js";

import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import {upload} from "../../common/middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", LivrosController.GetLivros);
router.get("/:id", LivrosController.GetLivrosByAutor);

export default router;
