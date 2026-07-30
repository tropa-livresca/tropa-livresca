import {PerfilService} from "./perfil.service.js";

export class PerfilController{
  static async GetPerfil (req, res, next) {
  try {
    const userId = req.user?.id;
    const perfil = await PerfilService.getPerfilService(userId);

    return res.status(200).json(perfil);
  } catch (err) {
    next(err);
  }
};

static async UpdatePerfil (req, res, next) {
  try {
    const userId = req.user?.id;
    const { nome, telefone, descricao, redes_sociais } = req.body;
    const file = req.file;

    const perfilAtualizado = await PerfilService.updatePerfilService({
      userId,
      dadosPerfil: { nome, telefone, descricao },
      file,
      redes_sociais,
    });

    return res.status(200).json(perfilAtualizado);
  } catch (err) {
    next(err);
  }
};
}