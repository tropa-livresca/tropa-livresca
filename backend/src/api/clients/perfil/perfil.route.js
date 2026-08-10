import express from "express";
import { PerfilController } from "./perfil.controller.js";

import { checkAuth } from "../../common/middlewares/auth.middleware.js";
import { upload } from "../../common/middlewares/upload.middleware.js";

const router = express.Router();

router.patch(
  "/imagem",
  checkAuth,
  upload.single("imagem"),
  PerfilController.AtualizarImagem,
);
router.delete("/imagem", checkAuth, PerfilController.RemoverImagem);
router.get("/", checkAuth, PerfilController.GetPerfil);
router.put("/", checkAuth, upload.any(), PerfilController.UpdatePerfil);

export default router;
