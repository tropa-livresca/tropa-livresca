import { LojaModel } from "../../common/models/loja.model.js";

export class LojaService {
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

    const totalItems = livrosTropa.count;

    const totalPagesTropa = Math.ceil(livrosTropa.count / limit);

    return {
      data: livrosTropa.data,
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

    return livro;
  }
}
