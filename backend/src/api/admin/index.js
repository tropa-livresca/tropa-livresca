import { Router } from "express";
import { verificarAutenticacaoAdm } from "../common/middlewares/auth.middleware.js";
import { verificarAutenticacaoAdmMaster } from "../common/middlewares/auth.middleware.js";
import livrosRoutes from "./livros/livros.route.js";
import revisaoRoutes from "./revisao/revisao.route.js";
import usuariosRoutes from "./usuarios/usuarios.route.js";

const router = Router();

router.use("/livros", verificarAutenticacaoAdm, livrosRoutes);
router.use("/revisao", verificarAutenticacaoAdm, revisaoRoutes);
router.use("/usuarios", verificarAutenticacaoAdmMaster, usuariosRoutes);

export default router;
