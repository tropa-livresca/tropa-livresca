import { Router } from "express";
import { verificarAutenticacaoAdm } from "../common/middlewares/auth.middleware.js";
import { verificarAutenticacaoAdmMaster } from "../common/middlewares/auth.middleware.js";
import livrosRoutes from "./livros/livros.route.js";
import revisaoRoutes from "./revisao/revisao.route.js";
import usuariosRoutes from "./usuarios/usuarios.route.js";
import enderecosRoutes from "./enderecos/endereco.route.js";

const router = Router();

router.use("/livros", verificarAutenticacaoAdm, livrosRoutes);
<<<<<<< HEAD
router.use("/revisao", verificarAutenticacaoAdm, revisaoRoutes);
router.use("/usuarios", verificarAutenticacaoAdmMaster, usuariosRoutes);
=======
router.use("/funcionarios", verificarAutenticacaoAdm, funcionarioRoutes);
router.use("/revisao", verificarAutenticacaoAdm, revisaoRoutes);
router.use("/usuarios", verificarAutenticacaoAdm, usuariosRoutes);
router.use("/enderecos", verificarAutenticacaoAdm, enderecosRoutes);
>>>>>>> 59fa0bcf720b4b1d1dda4f9f8cc96a5ccf4c709e

export default router;
