import { MovimentacoesService } from "./movimentacoes.service.js";

export class MovimentacoesController {
  static async buscarDadosMovimentacoesAutor(req, res, next) {
    try {
      const autorId = req.params.usuarioid;

      const dados =
        await MovimentacoesService.buscarDadosMovimentacoesAutor(autorId);

      return res.status(200).json({ dados });
    } catch (err) {
      next(err);
    }
  }

  static async buscarDadosMovimentacoesEditora(req, res, next) {
    try {
      const dados = await MovimentacoesService.buscarMovimentacoesEditora();

      return res.status(200).json({ dados });
    } catch (err) {
      next(err);
    }
  }

  static async autorizarDepositoContaAutor(req, res, next) {
    try {
      const vendaId = req.params.vendaid;

      const deposito =
        await MovimentacoesService.autorizarDepositoContaAutor(vendaId);

      return res.status(201).json({ deposito });
    } catch (err) {
      next(err);
    }
  }
}
