import { Router } from "express";

import livrosRoutes from "./livros/livros.route.js";
import categoriasRoutes from "./categorias/categorias.route.js";
import funcionarioRoutes from "./funcionarios/funcionarios.route.js";
import revisaoRoutes from "./funcionarios/funcionarios.route.js";

const router = Router();

router.use("/livros", livrosRoutes);
router.use("/funcionarios", funcionarioRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/revisao", revisaoRoutes);

export default router;
