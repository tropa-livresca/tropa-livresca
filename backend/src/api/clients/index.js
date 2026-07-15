import express from "express";
const router = express.Router();

import livrosRoutes from "./livro/livros.route.js";
import autorRoutes from "./autores/autor.route.js";
import suporteRoutes from "./suporte/suporte.route.js";
import perfilRoutes from "./perfil/perfil.route.js";

router.use("/", livrosRoutes);
router.use("/", autorRoutes);
router.use("/", suporteRoutes);
router.use("/", perfilRoutes);

export default router;
