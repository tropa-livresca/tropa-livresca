import { LojaModel } from "../../common/models/loja.model.js";
import { error } from "../../common/utils/error.js";

export class LojaService {
  static async consultarVendas({ page = 1, limit = 12, ordem = "" }) {
    const { data, count } = await LojaModel.consultarVendas({
      page,
      limit,
      ordem,
    });

    const vendas = data.map(({ movimentacoes_financeiras, ...venda }) => ({
      ...venda,
      repassado: movimentacoes_financeiras.length > 0,
    }));

    return {
      data: vendas,
      meta: {
        page,
        limit,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  static async consultarVenda(vendaId) {
    if (!vendaId) error(400, "Id da venda não informado.");

    const venda = await LojaModel.consultarVenda(vendaId);

    if (venda.error) throw venda.error;
    return venda;
  }

  static async buscarHistoricoVendasUsuario(usuarioId) {
    if (!usuarioId) error(400, "Id do usuário não informado.");

    const historico = await LojaModel.buscarHistoricoVendasUsuario(usuarioId);

    if (historico.error) throw historico.error;

    return historico;
  }

  static async buscarNumeroVendasLivro(livroId) {
    if (!livroId) error(400, "Id do livro não informado.");

    const numeroLivro = await LojaModel.buscarNumeroVendasLivro(livroId);

    if (numeroLivro.error) throw numeroLivro.error;

    return numeroLivro;
  }

  static async buscarRelatorioFinanceiroAutor(autorId) {
    if (!autorId) error(400, "Id do autor não informado para consulta.");

    const relatorio = await LojaModel.buscarRelatorioFinanceiroAutor(autorId);

    if (relatorio.error) throw relatorio.error;

    return relatorio;
  }

  static async autorizarEntrega(vendaId) {
    if (!vendaId)
      error(400, "Id da venda não informada para alteração do status.");

    const venda = await LojaModel.consultarVenda(vendaId);

    if (venda.status_pagamento !== "pago")
      error(400, "Só é possível enviar vendas pagas.");
    if (venda.status_entrega !== "Pendente")
      error(409, "Esta venda não está aguardando envio.");

    return LojaModel.autorizarEntrega(vendaId);
  }

  static async alterarStatusEntrega(vendaId) {
    if (!vendaId)
      error(400, "Id da venda não informada para alteração do status.");

    const venda = await LojaModel.consultarVenda(vendaId);

    if (venda.status_entrega !== "A caminho")
      error(409, "Só é possível marcar como entregue uma venda a caminho.");

    return LojaModel.alterarStatusEntrega(vendaId);
  }
}
