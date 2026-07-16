import * as perfilService from "./perfil.service.js";

export const GetPerfil = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const perfil = await perfilService.getPerfilService(userId);

    return res.status(200).json(perfil);
  } catch (err) {
    next(err);
  }
};

export const UpdatePerfil = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { nome, telefone, descricao, redes } = req.body;
    const file = req.file;

    const perfilAtualizado = await perfilService.updatePerfilService({
      userId,
      dadosPerfil: { nome, telefone, descricao },
      file,
      redes,
    });

    return res.status(200).json(perfilAtualizado);
  } catch (err) {
    next(err);
  }
};
