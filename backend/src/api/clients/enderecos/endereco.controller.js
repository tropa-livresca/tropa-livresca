import { EnderecoService } from "./endereco.service.js";

export class EnderecoController {
  static async BuscarEnderecos(req, res, next) {
    try {
      const userId = req.user?.id;
      const enderecos = await EnderecoService.BuscarEnderecos(userId);

      return res.status(200).json(enderecos);
    } catch (err) {
      next(err);
    }
  }

  static async BuscarEnderecoById(req, res, next) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      const endereco = await EnderecoService.BuscarEnderecoById(id, userId);

      return res.status(200).json(endereco);
    } catch (err) {
      next(err);
    }
  }

  static async InativarEndereco(req, res, next) {
    try {
      const { id } = req.params;
      const endereco = await EnderecoService.InativarEndereco(id);

      return res.status(200).json(endereco);
    } catch (err) {
      next(err);
    }
  }

  static async CriarEndereco(req, res, next) {
    try {
      const userId = req.user?.id;
      const dadosEndereco = req.body;

      const endereco = await EnderecoService.CriarEndereco({
        userId,
        dadosEndereco,
      });

      return res.status(201).json(endereco);
    } catch (err) {
      next(err);
    }
  }

  static async AtualizarEnderecoById(req, res, next) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const endereco = await EnderecoService.AtualizarEnderecoById(
        id,
        dadosAtualizados,
      );

      return res.status(200).json(endereco);
    } catch (err) {
      next(err);
    }
  }

}
