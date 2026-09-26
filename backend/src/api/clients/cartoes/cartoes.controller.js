import { CartoesService } from "./cartoes.service.js";

export class CartoesController {
  static async adicionarCartao(req, res, next) {
    try {
      const {
        token_pagamento,
        final_cartao,
        bandeira_varchar,
        nome_no_cartao,
        data_expiracao,
      } = req.body;

      const usuarioId = req.user?.id;

      const cartaoAdicionado = await CartoesService.adicionarCartao(
        token_pagamento,
        final_cartao,
        bandeira_varchar,
        nome_no_cartao,
        data_expiracao,
        usuarioId,
      );

      return res.status(201).json({ cartaoAdicionado });
    } catch (err) {
      next(err);
    }
  }

  static async alterarCartao(req, res, next) {
    try {
      const {
        token_pagamento,
        final_cartao,
        bandeira_varchar,
        nome_no_cartao,
        data_expiracao,
      } = req.body;

      const cartaoId = req.params.id;

      const cartaoAlterado = await CartoesService.adicionarCartao(
        cartaoId,
        token_pagamento,
        final_cartao,
        bandeira_varchar,
        nome_no_cartao,
        data_expiracao,
      );

      return res.status(201).json({ cartaoAlterado });
    } catch (err) {
      next(err);
    }
  }

  static async deletarCartao(req, res, next) {
    try {
      const cartaoId = req.params.id;
      const usuarioId = req.user?.id;

      const cartaoDeletado = await CartoesService.deletarCartao(
        cartaoId,
        usuarioId,
      );

      return res.status(201).json({ cartaoDeletado });
    } catch (err) {
      next(err);
    }
  }

  static async buscarCartao(req, res, next) {
    try {
      const cartaoId = req.params.id;

      const cartao = await CartoesService.buscarCartao(cartaoId);

      return res.status(201).json({ cartao });
    } catch (err) {
      next(err);
    }
  }

  static async buscarCartoes(req, res, next) {
    try {
      const usuarioId = req.user?.id;

      const cartoes = await CartoesService.buscarCartoes(usuarioId);

      return res.status(201).json({ cartoes });
    } catch (err) {
      next(err);
    }
  }
}
