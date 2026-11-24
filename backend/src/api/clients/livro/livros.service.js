import { LivroModel } from "../../common/models/livro.model.js";

export class LivrosService {
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

    const totalItems = count || data.length;

    return {
      data,
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

    return data;
  }
}
