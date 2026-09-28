import express from "express";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { LojaController } from "./loja.controller.js";

const router = express.Router();

router.get("/", LojaController.buscarLivros);
router.get("/:id", LojaController.buscarLivroById);

router.get("/venda/:id", checkAuth, LojaController.consultarVenda);
router.get(
  "/historico-vendas",
  checkAuth,
  LojaController.buscarHistoricoVendasUsuario,
);
router.get("/numero-vendas", LojaController.buscarNumeroVendasLivro);
router.get("/frete", LojaController.calcularFretePrazo);

router.patch("/status", checkAuth, LojaController.mudarStatusPagamento);

router.post("/venda", checkAuth, LojaController.realizarVenda);

export default router;
