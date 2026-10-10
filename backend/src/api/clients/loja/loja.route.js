import express from "express";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { LojaController } from "./loja.controller.js";

const router = express.Router();

router.get("/", LojaController.buscarLivros);

router.get("/frete", checkAuth, LojaController.calcularFretePrazo);
router.get(
  "/historico-vendas",
  checkAuth,
  LojaController.buscarHistoricoVendasUsuario,
);
router.get("/numero-vendas/:id", LojaController.buscarNumeroVendasLivro);
router.get("/venda/:id", checkAuth, LojaController.consultarVenda);

router.get("/:id", LojaController.buscarLivroById);

router.patch("/status/:id", checkAuth, LojaController.mudarStatusPagamento);

router.post("/venda", checkAuth, LojaController.realizarVenda);

router.post(
  "/:vendaId/reenviar-email",
  checkAuth,
  LojaController.reenviarEmailLivrosDigitais,
);

export default router;
