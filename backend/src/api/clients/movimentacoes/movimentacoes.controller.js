import { MovimentacoesService } from "./movimentacoes.service.js";

export class MovimentacoesController {
  static async criarConta(req, res, next) {
    try {
      const { CPF, nomeCompleto, numeroBanco, numeroAgencia, tipoConta } =
        req.body;

      const usuarioId = req.user?.id;

      const conta = await MovimentacoesService.criarConta(
        usuarioId,
        CPF,
        nomeCompleto,
        numeroBanco,
        numeroAgencia,
        tipoConta,
      );

      return res.status(201).json({ conta });
    } catch (err) {
      next(err);
    }
  }

  static async alterarDadosConta(req, res, next) {
    try {
      const { CPF, nomeCompleto, numeroBanco, numeroAgencia, tipoConta } =
        req.body;

      const usuarioId = req.user?.id;

      const contaAlterada = await MovimentacoesService.alterarDadosConta(
        usuarioId,
        CPF,
        nomeCompleto,
        numeroBanco,
        numeroAgencia,
        tipoConta,
      );

      return res.status(201).json({ contaAlterada });
    } catch (err) {
      next(err);
    }
  }

  static async solicitarSaque(req, res, next) {
    try {
      const usuarioId = req.user?.id;
      const { valorSaque } = req.body;

      const saque = await MovimentacoesService.solicitarSaque(
        usuarioId,
        valorSaque,
      );

      return res.status(201).json({ saque });
    } catch (err) {
      next(err);
    }
  }

  static async buscarDadosMovimentacoesAutor(req, res, next) {
    try {
      const usuarioId = req.user?.id;

      const dados =
        await MovimentacoesService.buscarDadosMovimentacoesAutor(usuarioId);

      return res.status(201).json({ dados });
    } catch (err) {
      next(err);
    }
  }
}
