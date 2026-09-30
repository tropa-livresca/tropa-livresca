import express from "express";
import { LojaController } from "./loja.controller.js";

const router = express.Router();

router.get("/", LojaController.consultarVendas);
router.get("/:id", LojaController.consultarVenda);
router.patch("/autorizacao/:id", LojaController.autorizarEntrega);
router.post("/entregue/:id", LojaController.alterarStatusEntrega);

router.get("/:usuarioid", LojaController.buscarHistoricoVendasUsuario);
router.get("/:livroid", LojaController.buscarNumeroVendasLivro);
router.get(
  "/relatorio/:usuarioid",
  LojaController.buscarRelatorioFinanceiroAutor,
);

export default router;
