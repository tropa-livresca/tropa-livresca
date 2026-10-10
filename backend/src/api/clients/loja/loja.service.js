import { LojaModel } from "../../common/models/loja.model.js";
import { EnderecoModel } from "../../common/models/endereco.model.js";
import { error, errorUsuarioId } from "../../common/utils/error.js";

const METODO_PAGAMENTO_SIMULADO = 1;
const MAX_QTD_POR_ITEM = 99;

const arredondar = (valor) => Math.round(valor * 100) / 100;
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
    idioma = "",
  }) {
    const livrosTropa = await LojaModel.buscarComFiltros({
      page,
      limit,
      busca,
      filtro,
      ordem,
      categoria,
      idioma,
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

  static async consultarVenda(vendaId, usuarioId) {
    if (!usuarioId) errorUsuarioId();
    if (!vendaId) error(400, "Id da venda não informado.");

    const venda = await LojaModel.consultarVenda(vendaId);

    if (venda.fk_user_profile_id !== usuarioId)
      error(404, "Venda não encontrada.");

    return venda;
  }

  static async realizarVenda(usuarioId, { itens, enderecoId }) {
    if (!usuarioId) errorUsuarioId();

    if (!Array.isArray(itens) || itens.length === 0)
      error(400, "Não há como realizar compra sem itens da venda.");

    const itensNormalizados = itens.map((item) => {
      const livroId = Number(item.livroId);
      const fisico = item.fisico === true;
      const qtd = fisico ? Number(item.qtd) : 1;

      if (!Number.isInteger(livroId) || livroId <= 0)
        error(400, "Livro inválido no carrinho.");
      if (!Number.isInteger(qtd) || qtd < 1 || qtd > MAX_QTD_POR_ITEM)
        error(400, "Quantidade inválida no carrinho.");

      return { livroId, fisico, qtd };
    });

    const livroIds = [...new Set(itensNormalizados.map((i) => i.livroId))];
    const livros = await LojaModel.buscarLivrosParaVenda(livroIds);
    const livrosPorId = new Map(livros.map((livro) => [livro.id, livro]));

    const itensVenda = itensNormalizados.map(({ livroId, fisico, qtd }) => {
      const livro = livrosPorId.get(livroId);
      if (!livro) error(400, "Um dos livros do carrinho não está disponível.");

      const precoUnitario = Number(
        fisico ? livro.preco_fisico : livro.preco_digital,
      );
      if (!(precoUnitario > 0))
        error(400, `"${livro.titulo}" não está à venda neste formato.`);

      return {
        fk_livros_itens_id: livroId,
        fisico,
        qtd,
        preco_unitario: precoUnitario,
        subtotal: arredondar(precoUnitario * qtd),
      };
    });

    const itensFisicos = itensVenda.filter((item) => item.fisico);
    let enderecoEntrega = null;
    let frete = 0;

    if (itensFisicos.length > 0) {
      if (!enderecoId) error(400, "Informe o endereço de entrega.");

      const endereco = await LojaService._buscarEnderecoDoUsuario(
        enderecoId,
        usuarioId,
      );

      enderecoEntrega = {
        rua: endereco.rua,
        num: endereco.num,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep,
        pais: endereco.pais,
      };

      const opcoesFrete = await LojaModel.calcularFretePrazo(
        usuarioId,
        itensFisicos.map((item) => ({ tipo: "fisico", quantidade: item.qtd })),
      );
      frete = Math.min(...opcoesFrete.map((opcao) => opcao.preco));
    }

    const totalItens = itensVenda.reduce((acc, item) => acc + item.subtotal, 0);
    const total = arredondar(totalItens + frete);

    console.log(usuarioId);

    const dadosVenda = {
      fk_user_profile_id: usuarioId,
      metodo_pagamento: METODO_PAGAMENTO_SIMULADO,
      endereco_entrega: enderecoEntrega,
      total,
      data: new Date().toISOString(),
      status_pagamento: "pendente",
      status_entrega: itensFisicos.length > 0 ? "Pendente" : "Não se aplica",
    };

    const venda = await LojaModel.realizarVenda(dadosVenda, itensVenda);

    return { id: venda.id, total, frete };
  }

  static async _buscarEnderecoDoUsuario(enderecoId, usuarioId) {
    try {
      const { data } = await EnderecoModel.BuscarEnderecoById(
        enderecoId,
        usuarioId,
      );
      if (data) return data;
    } catch {
      // .single() falha quando o endereço não existe ou é de outro usuário.
    }
    error(400, "Endereço de entrega inválido.");
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

  static async calcularFretePrazo(userId, itensVenda) {
    if (!userId) error(400, "id do usuario de envio não informado.");

    if (!itensVenda)
      error(400, "Itens da Venda não informados para o cálculo do frete.");

    const frete = await LojaModel.calcularFretePrazo(userId, itensVenda);

    if (frete.error) throw frete.error;

    return frete;
  }

  static async mudarStatusPagamento(vendaId, usuario) {
    if (!vendaId) error(400, "Id da venda não informado.");

    const venda = await LojaService.consultarVenda(vendaId, usuario?.id);

    if (venda.status_pagamento === "pago")
      error(409, "Esta venda já foi paga.");

    return LojaModel.mudarStatusPagamento(vendaId, usuario.email);
  }
}
