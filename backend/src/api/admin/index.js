import { Router } from "express";
import { verificarAutenticacaoAdm } from "../common/middlewares/auth.middleware.js";
import { verificarAutenticacaoAdmMaster } from "../common/middlewares/auth.middleware.js";
import livrosRoutes from "./livros/livros.route.js";
import categoriasRoutes from "./categorias/categorias.route.js";
import funcionarioRoutes from "./funcionarios/funcionarios.route.js";
import revisaoRoutes from "./revisao/revisao.route.js";

const router = Router();

router.use("/livros", verificarAutenticacaoAdm, livrosRoutes);
router.use("/funcionarios", verificarAutenticacaoAdmMaster, funcionarioRoutes);
router.use("/categorias", verificarAutenticacaoAdm, categoriasRoutes);
router.use("/revisao", verificarAutenticacaoAdm, revisaoRoutes);

export default router;
