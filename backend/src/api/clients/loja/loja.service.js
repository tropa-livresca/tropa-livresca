import { LojaModel } from "../../common/models/loja.model.js";

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
}
