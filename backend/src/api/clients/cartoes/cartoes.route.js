import express from "express";
import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { CartoesController } from "./cartoes.controller.js";

const router = express.Router();

router.get("/", checkAuth, CartoesController.buscarCartoes);
router.get("/:id", CartoesController.buscarCartao);
router.post("/", checkAuth, CartoesController.adicionarCartao);
router.patch("/", checkAuth, CartoesController.alterarCartao);
router.delete("/:id", checkAuth, CartoesController.deletarCartao);

export default router;
