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
      } = req.query;

      const resultado = await LojaService.buscarLivros({
        page: Number(page),
        limit: Number(limit),
        busca,
        filtro,
        ordem,
        categoria,
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

      const venda = await LojaService.consultarVenda(vendaId);

      return res.status(201).json({ venda });
    } catch (err) {
      next(err);
    }
  }

  static async realizarVenda(req, res, next) {
    try {
      const { metodo_pagamento, endereco_entrega, total, itensVenda } =
        req.body;

      const usuarioId = req.user?.id;

      const venda = await LojaService.realizarVenda(
        usuarioId,
        metodo_pagamento,
        endereco_entrega,
        total,
        itensVenda,
      );

      return res.status(201).json({ venda });
    } catch (err) {
      next(err);
    }
  }

  static async buscarHistoricoVendasUsuario(req, res, next) {
    try {
      const usuarioId = req.user?.id;

      const vendaUsuario =
        await LojaService.buscarHistoricoVendasUsuario(usuarioId);

      return res.status(201).json({ vendaUsuario });
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
      const { cepDestino, itensVenda } = req.query;

      console.log(cepDestino);
      console.log(itensVenda);

      /*

      const frete = await LojaService.calcularFretePrazo(
        cepDestino,
        itensVenda,
      );

      */

      return res.status(201).json({ teste:1 });
    } catch (err) {
      next(err);
    }
  }

  static async mudarStatusPagamento(req, res, next) {
    try {
      const vendaId = req.params.id;
      const usuarioEmail = req.body.email;

      const email = await LojaService.mudarStatusPagamento(
        vendaId,
        usuarioEmail,
      );

      return res.status(201).json({ email });
    } catch (err) {
      next(err);
    }
  }
}
