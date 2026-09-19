import { LivroModel } from "../../common/models/livro.model.js";

export class LivrosService {
  static async BuscarLivros(
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    ativo = "",
    estado = "",
  ) {
    const livros = await LivroModel.buscarLivrosAdmin({
      page,
      limit,
      busca,
      filtro,
      ordem,
      ativo,
      estado,
    });

    if (livros.error) throw livros.error;

    return {
      data: livros.data,
      meta: {
        page,
        limit,
        totalItems: livros.count,
        totalPages: Math.ceil(livros.count / limit),
      },
    };
  }

  static async BuscarLivroById(livroId) {
    if (!livroId) {
      const erroLivroId = new Error("Id do livro não informado.");
      erroLivroId.statusCode = 400;
      throw erroLivroId;
    }

    const livro = await LivroModel.buscarLivroByIdAdmin(livroId);

    if (livro.error) throw livro.error;

    return livro;
  }
}
