import { PerfilService } from "./perfil.service.js";

export class PerfilController {
  static async GetPerfil(req, res, next) {
    try {
      const userId = req.user?.id;
      const perfil = await PerfilService.buscarPerfil(userId);

      return res.status(200).json(perfil);
    } catch (err) {
      next(err);
    }
  }

  static async RemoverImagem(req, res, next) {
    try {
      const userId = req.user?.id;
      const perfilAtualizado = await PerfilService.RemoverImagemPerfil(userId);

      return res.status(200).json(perfilAtualizado);
    } catch (err) {
      next(err);
    }
  }

  static async UpdatePerfil(req, res, next) {
    try {
      const userId = req.user?.id;
      const { nome, telefone, descricao, redes_sociais } = req.body;

      const perfilAtualizado = await PerfilService.atualizarPerfil({
        userId,
        dadosPerfil: { nome, telefone, descricao },
        redes_sociais,
      });

      return res.status(200).json(perfilAtualizado);
    } catch (err) {
      next(err);
    } 
  }

  static async AtualizarImagem(req, res, next) {
    try {
      const userId = req.user?.id;
      const file = req.file;

      if (!file) {
        const erroFile = new Error("Nenhum arquivo enviado.");
        erroFile.statusCode = 400;
        throw erroFile;
      }

      const perfilAtualizado = await PerfilService.AtualizarImagemPerfil({
        userId,
        file,
      });
      return res.status(200).json(perfilAtualizado);
    } catch (err) {
      next(err);
    }
  }
}
