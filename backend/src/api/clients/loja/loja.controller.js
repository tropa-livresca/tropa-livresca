import { LojaService } from "./loja.service.js";

export class LojaController {
  static async buscarLivros(req, res, next) {
    try {
      const {
        page = 1,
        limit = 12,
        busca = "",
        filtro = "",
        ordem = "",
        categoria = "",
        idioma = "",
      } = req.query;

      const resultado = await LojaService.buscarLivros({
        page: Number(page),
        limit: Number(limit),
        busca,
        filtro,
        ordem,
        categoria,
        idioma,
      });

      return res.status(200).json(resultado);
    } catch (err) {
      next(err);
    }
  }

  static async buscarLivroById(req, res, next) {
    try {
      const { id } = req.params;

      const livro = await LojaService.buscarLivroById(id);

      return res.status(200).json({
        livro,
      });
    } catch (err) {
      next(err);
    }
  }

  static async consultarVenda(req, res, next) {
    try {
      const vendaId = req.params.id;

      const venda = await LojaService.consultarVenda(vendaId, req.user?.id);

      return res.status(200).json({ venda });
    } catch (err) {
      next(err);
    }
  }

  static async realizarVenda(req, res, next) {
    try {
      const { itens, enderecoId } = req.body;

      const venda = await LojaService.realizarVenda(req.user?.id, {
        itens,
        enderecoId,
      });

      return res.status(201).json({ venda });
    } catch (err) {
      next(err);
    }
  }

  static async reenviarEmailLivrosDigitais(req, res, next) {
    try {
      const usuarioId = req.user?.id;
      const usuarioEmail = req.user?.email;

      const vendaId = Number(req.params.vendaId);

      if (!Number.isSafeInteger(vendaId) || vendaId <= 0) {
        return res.status(400).json({
          mensagem: "Identificador de pedido inválido.",
        });
      }

      const resultado = await LojaService.reenviarEmailLivrosDigitais(
        usuarioId,
        usuarioEmail,
        vendaId,
      );

      return res.status(200).json({ resultado });
    } catch (err) {
      next(err);
    }
  }

  static async buscarHistoricoVendasUsuario(req, res, next) {
    try {
      const usuarioId = req.user?.id;

      const vendaUsuario =
        await LojaService.buscarHistoricoVendasUsuario(usuarioId);

      return res.status(200).json({ vendaUsuario });
    } catch (err) {
      next(err);
    }
  }

  static async buscarNumeroVendasLivro(req, res, next) {
    try {
      const livroId = req.params.id;

      const numeroLivro = await LojaService.buscarNumeroVendasLivro(livroId);

      return res.status(200).json({ numeroLivro });
    } catch (err) {
      next(err);
    }
  }

  static async calcularFretePrazo(req, res, next) {
    try {
      const { itensVenda } = req.query;
      const produtos = JSON.parse(itensVenda);
      const userId = req.user?.id;

      const frete = await LojaService.calcularFretePrazo(userId, produtos);

      return res.status(201).json({ frete });
    } catch (err) {
      next(err);
    }
  }

  static async mudarStatusPagamento(req, res, next) {
    try {
      const vendaId = req.params.id;

      const venda = await LojaService.mudarStatusPagamento(vendaId, req.user);

      return res.status(200).json({ venda });
    } catch (err) {
      next(err);
    }
  }
}
