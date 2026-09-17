import { Router } from "express";
import { verificarAutenticacaoAdm } from "../common/middlewares/auth.middleware.js";
import { verificarAutenticacaoAdmMaster } from "../common/middlewares/auth.middleware.js";
import livrosRoutes from "./livros/livros.route.js";
import funcionarioRoutes from "./funcionarios/funcionarios.route.js";
import revisaoRoutes from "./revisao/revisao.route.js";
import usuariosRoutes from "./usuarios/usuarios.route.js";

const router = Router();

router.use("/livros", verificarAutenticacaoAdm, livrosRoutes);
<<<<<<< HEAD
router.use("/funcionarios", verificarAutenticacaoAdm, funcionarioRoutes);
router.use("/categorias", verificarAutenticacaoAdm, categoriasRoutes);
=======
router.use("/funcionarios", verificarAutenticacaoAdmMaster, funcionarioRoutes);
>>>>>>> 0f4e28e6ed5fea4f341e4bf88a810accd0361802
router.use("/revisao", verificarAutenticacaoAdm, revisaoRoutes);
router.use("/usuarios", verificarAutenticacaoAdm, usuariosRoutes);

export default router;
