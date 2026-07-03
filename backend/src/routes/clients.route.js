import express from "express";
const router = express.Router();

import livrosRoutes from "./livros.route.js";
import autorRoutes from "./autor.route.js";
import suporteRoutes from "./suporte.route.js";
import perfilRoutes from "./perfil.route.js";

router.use("/", livrosRoutes);
router.use("/", autorRoutes);
router.use("/", suporteRoutes);
router.use("/", perfilRoutes);

export default router;
