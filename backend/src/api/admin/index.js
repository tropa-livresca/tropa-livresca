import { Router } from "express";
import { verificarAutenticacaoAdm } from "../common/middlewares/auth.middleware.js";
import { verificarAutenticacaoAdmMaster } from "../common/middlewares/auth.middleware.js";

import lojaRoutes from "./loja/loja.route.js";
import livrosRoutes from "./livros/livros.route.js";
import revisaoRoutes from "./revisao/revisao.route.js";
import usuariosRoutes from "./usuarios/usuarios.route.js";
import notificacoesRoutes from "./notificacoes/notificacoes.route.js";
import movimentacoesRoutes from "./movimentacoes/movimentacoes.route.js";

const router = Router();

router.use("/loja", verificarAutenticacaoAdm, lojaRoutes);
router.use("/livros", verificarAutenticacaoAdm, livrosRoutes);
router.use("/revisao", verificarAutenticacaoAdm, revisaoRoutes);
router.use("/notificacoes", verificarAutenticacaoAdm, notificacoesRoutes);

router.use("/usuarios", verificarAutenticacaoAdmMaster, usuariosRoutes);
router.use(
  "/movimentacoes",
  verificarAutenticacaoAdmMaster,
  movimentacoesRoutes,
);

export default router;
