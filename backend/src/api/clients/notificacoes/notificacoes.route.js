import express from "express";
import { NotificacoesController } from "./notificacoes.controller.js";
import checkAuth from "../../common/middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", checkAuth, NotificacoesController.buscarFeedUsuario);
router.get("/geral", NotificacoesController.buscarNotificacoesGerais);
router.get(
  "/particular",
  checkAuth,
  NotificacoesController.buscarNotificacoesParticulares,
);

router.post("/", checkAuth, NotificacoesController.enviarNotificacao);

router.patch("/:id", checkAuth, NotificacoesController.alterarNotificacao);
router.patch("/status", checkAuth, NotificacoesController.alterarStatusLido);

router.delete("/", checkAuth, NotificacoesController.limparNotificacoesAntigas);
router.delete("/:id", checkAuth, NotificacoesController.deletarNotificacao);

export default router;
