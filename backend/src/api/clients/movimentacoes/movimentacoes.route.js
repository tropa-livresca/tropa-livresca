import express from "express";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { MovimentacoesController } from "./movimentacoes.controller.js";

const router = express.Router();

router.post("/", checkAuth, MovimentacoesController.criarConta);
router.put("/", checkAuth, MovimentacoesController.alterarDadosConta);
router.get(
  "/",
  checkAuth,
  MovimentacoesController.buscarDadosMovimentacoesAutor,
);
router.patch("/", checkAuth, MovimentacoesController.solicitarSaque);

export default router;
