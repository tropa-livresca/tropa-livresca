import {
  criarClienteModel,
  getListPocketBase,
  marcarErro,
} from "./pocketbase.helpers.js";

const COLECAO = "avaliacoes";

async function buscarAvaliacao(pb, usuarioId, livroId) {
  try {
    return await pb
      .collection(COLECAO)
      .getFirstListItem(
        pb.filter(
          "fk_livros_id = {:livroId} && fk_user_profile_id = {:usuarioId}",
          { livroId, usuarioId },
        ),
      );
  } catch (error) {
    if (error.status === 404) return null;
    marcarErro(error);
  }
}

export class AvaliacaoModel {
  static async buscarResumoLivro(livroId) {
    const pb = await criarClienteModel();

    try {
      const avaliacoes = await pb.collection(COLECAO).getFullList({
        filter: pb.filter("fk_livros_id = {:livroId}", { livroId }),
        fields: "qtd_estrelas",
      });

      const total = avaliacoes.length;

      if (total === 0) {
        return { media: 0, total: 0 };
      }

      const soma = avaliacoes.reduce(
        (acc, item) => acc + (item.qtd_estrelas || 0),
        0,
      );

      return {
        media: Math.round((soma / total) * 10) / 10,
        total,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarAvaliacaoUsuario(usuarioId, livroId) {
    const pb = await criarClienteModel();

    const avaliacao = await buscarAvaliacao(pb, usuarioId, livroId);

    return avaliacao
      ? {
          id: avaliacao.id,
          qtd_estrelas: avaliacao.qtd_estrelas,
        }
      : null;
  }

  static async usuarioComprouLivro(usuarioId, livroId) {
    const pb = await criarClienteModel();

    try {
      const vendas = await pb.collection("vendas").getFullList({
        filter: pb.filter(
          "fk_user_profile_id = {:usuarioId} && status_pagamento = 'pago'",
          { usuarioId },
        ),
        fields: "id",
      });

      if (vendas.length === 0) return false;

      const filtroVendas = vendas
        .map((_, index) => `fk_vendas_id = {:venda${index}}`)
        .join(" || ");

      const params = Object.fromEntries(
        vendas.map((venda, index) => [`venda${index}`, venda.id]),
      );

      const itens = await getListPocketBase(pb.collection("itens_venda"), {
        page: 1,
        limit: 1,
        filter: pb.filter(
          `fk_livros_itens_id = {:livroId} && (${filtroVendas})`,
          { ...params, livroId },
        ),
        fields: "id",
      });

      return itens.items.length > 0;
    } catch (error) {
      marcarErro(error);
    }
  }

  static async salvarAvaliacao(usuarioId, livroId, qtdEstrelas) {
    const pb = await criarClienteModel();

    const existente = await buscarAvaliacao(pb, usuarioId, livroId);

    try {
      const dados = {
        qtd_estrelas: qtdEstrelas,
      };

      const avaliacao = existente
        ? await pb.collection(COLECAO).update(existente.id, dados)
        : await pb.collection(COLECAO).create({
            ...dados,
            fk_livros_id: livroId,
            fk_user_profile_id: usuarioId,
          });

      return {
        id: avaliacao.id,
        qtd_estrelas: avaliacao.qtd_estrelas,
      };
    } catch (error) {
      marcarErro(error);
    }
  }
}
