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

  static async AlterarAtivoLivro(livroId, ativo) {
    if (!livroId) {
      const erroLivroId = new Error("Id do livro não informado.");
      erroLivroId.statusCode = 400;
      throw erroLivroId;
    }

    if (typeof ativo !== "boolean") {
      const erroAtivo = new Error("Informe se o livro deve ficar ativo.");
      erroAtivo.statusCode = 400;
      throw erroAtivo;
    }

    const livro = await LivroModel.alterarAtivoLivro(livroId, ativo);

    if (!livro) {
      const erroLivro = new Error("Livro não encontrado.");
      erroLivro.statusCode = 404;
      throw erroLivro;
    }

    return livro;
  }

  static async BuscarLivroByUserId(userId) {
    if (!userId) {
      const erroLivroId = new Error("Id do livro não informado.");
      erroLivroId.statusCode = 400;
      throw erroLivroId;
    }

    try {
      const livro = await LivroModel.buscarLivroByUserId(userId);
      return livro;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 400;
      throw error;
    }
  }
}
