import express from "express";
const router = express.Router();

import enderecoRoutes from "./enderecos/endereco.route.js";
import autopublicacaoRoutes from "./autopublicacao/autopublicacao.route.js";
import livrosRoutes from "./livro/livros.route.js";
import autorRoutes from "./autores/autor.route.js";
import suporteRoutes from "./suporte/suporte.route.js";
import perfilRoutes from "./perfil/perfil.route.js";
import lojaRoutes from "./loja/loja.route.js";
import notificacoesRoutes from "./notificacoes/notificacoes.route.js";
import avaliacoesRoutes from "./avaliacoes/avaliacao.route.js";
import comentariosRoutes from "./comentarios/comentarios.route.js";
import cartoesRoutes from "./cartoes/cartoes.route.js";

router.use("/autopublicacao", autopublicacaoRoutes);
router.use("/enderecos", enderecoRoutes);
router.use("/livros", livrosRoutes);
router.use("/autores", autorRoutes);
router.use("/suporte", suporteRoutes);
router.use("/perfil", perfilRoutes);
router.use("/loja", lojaRoutes);
router.use("/notificacoes", notificacoesRoutes);
router.use("/avaliacoes", avaliacoesRoutes);
router.use("/comentarios", comentariosRoutes);
router.use("/cartoes", cartoesRoutes);

export default router;
