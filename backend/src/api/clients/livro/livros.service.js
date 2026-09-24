import { LivroModel } from "../../common/models/livro.model.js";

export class LivrosService {
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

  static async buscarLivros({ page, limit, busca, filtro, ordem }) {
    const { data, error, count } = await LivroModel.buscarComFiltros({
      page,
      limit,
      busca,
      filtro,
      ordem,
    });

    if (!data || data.length === 0) {
      const erro404 = new Error("Nenhum livro foi encontrado na vitrine.");
      erro404.statusCode = 404;
      throw erro404;
    }

    if (error) throw error;

    const livrosComCapas = this._parseCapasArray(data);
    const totalItems = count || livrosComCapas.length;

    return {
      data: livrosComCapas,
      meta: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  static async buscarLivroById(id) {
    const data = await LivroModel.buscarDetalhesPorId(id);

    if (!data) {
      const erro404 = new Error(
        "O livro solicitado não existe ou está indisponível.",
      );
      erro404.statusCode = 404;
      throw erro404;
    }

    if (data.error) throw data.error;

    return this._parseCapaUrls(data);
  }
}
