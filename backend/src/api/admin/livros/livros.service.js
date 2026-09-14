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
    try {
      const livros = await LivroModel.buscarLivrosAdmin({
        page,
        limit,
        busca,
        filtro,
        ordem,
        ativo,
        estado,
        }
      );

      return livros;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  static async BuscarLivroById(livroId) {
    if (!livroId) {
      const erroLivroId = new Error("Id do livro não informado.");
      erroLivroId.statusCode = 400;
      throw erroLivroId;
    }

    try {
      const livro = await LivroModel.buscarLivroByIdAdmin(livroId);
      return livro;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 400;
      throw error;
    }
  }
}
