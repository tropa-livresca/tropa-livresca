import { LojaModel } from "../../common/models/loja.model.js";
import { error, errorUsuarioId } from "../../common/utils/error.js";

export class LojaService {
  static _parseCapaUrls(livro) {
    if (!livro) return livro;

    const livroClonado = { ...livro };

    try {
      if (typeof livroClonado.capa === "string") {
        livroClonado.capa = JSON.parse(livroClonado.capa);
      }
    } catch (e) {
      console.warn("Erro ao parsear capa JSON", e);
    }
    return livroClonado;
  }

  static _parseCapasArray(livros) {
    return livros.map((livro) => this._parseCapaUrls(livro));
  }

  static async buscarLivros({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    categoria = "",
  }) {
    const livrosTropa = await LojaModel.buscarComFiltros({
      page,
      limit,
      busca,
      filtro,
      ordem,
      categoria,
    });

    if (livrosTropa.error) {
      throw livrosTropa.error;
    }

    const livrosComCapas = this._parseCapasArray(livrosTropa.data);

    const totalItems = livrosTropa.count;

    const totalPagesTropa = Math.ceil(livrosTropa.count / limit);

    return {
      data: livrosComCapas,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: totalPagesTropa,
      },
    };
  }

  static async buscarLivroById(id) {
    if (!id) {
      const erroId = new Error("Id não informadao.");
      erroId.statusCode = 400;
      throw erroId;
    }

    const livro = await LojaModel.buscarLivroById(id);

    if (livro.error) {
      throw livro.error;
    }

    return this._parseCapaUrls(livro);
  }

  static async consultarVenda(vendaId) {
    if (!vendaId) error(400, "Id da venda não informado.");

    const venda = await LojaModel.consultarVenda(vendaId);

    if (venda.error) throw venda.error;

    return venda;
  }

  static async realizarVenda(
    usuarioId,
    metodo_pagamento,
    endereco_entrega,
    total,
    itensVenda,
  ) {
    if (!usuarioId) errorUsuarioId();

    if (!metodo_pagamento || !endereco_entrega || !total)
      error(400, "Dados da venda não informados.");

    if (!itensVenda)
      error(400, "Não há como realizar compra sem itens da venda.");

    const dadosVenda = {
      fk_user_profile_id: usuarioId,
      metodo_pagamento,
      endereco_entrega,
      total,
    };

    const venda = await LojaModel.realizarVenda(dadosVenda, itensVenda);

    if (venda.error) throw venda.error;

    return venda;
  }

  static async buscarHistoricoVendasUsuario(usuarioId) {
    if (!usuarioId) errorUsuarioId();

    const buscaVendas = await LojaModel.buscarHistoricoVendasUsuario(usuarioId);

    if (buscaVendas.error) throw buscaVendas.error;

    return buscaVendas;
  }

  static async buscarNumeroVendasLivro(livroId) {
    if (!livroId) error(400, "Id do livro não informado.");

    const numeroVendas = await LojaModel.buscarNumeroVendasLivro(livroId);

    if (numeroVendas.error) throw numeroVendas.error;

    return numeroVendas;
  }

  static async calcularFretePrazo(cepDestino, itensVenda) {
    if (!cepDestino) error(400, "Cep de envio não informado.");

    if (!itensVenda)
      error(400, "Itens da Venda não informados para o cálculo do frete.");

    const frete = await LojaModel.calcularFretePrazo(cepDestino, itensVenda);

    if (frete.error) throw frete.error;

    return frete;
  }

  static async mudarStatusPagamento(vendaId, usuarioEmail) {
    if (!vendaId) error(400, "Id da venda não informado.");

    if (!usuarioEmail)
      error(
        400,
        "E-mail do usuário a que enviar o pdf do livro não informado.",
      );

    const email = await LojaModel.mudarStatusPagamento(vendaId, usuarioEmail);

    if (email.error) throw email.error;

    return email;
  }
}
