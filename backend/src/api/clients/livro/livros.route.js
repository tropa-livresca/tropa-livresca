import express from "express";
 
import {
  GetLivros,
  GetLivrosByAutor,
} from "./livros.controller.js";

import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import {upload} from "../../common/middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", GetLivros);
router.get("/:id", GetLivrosByAutor);

export default router;
