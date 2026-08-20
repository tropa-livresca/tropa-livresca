import { LivroModel } from "../../common/models/livro.model";
export class LivrosService {
  static async BuscarLivros(
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
  ) {
    try {
      const livros = await LivroModel.BuscarTodosLivros(
        page,
        limit,
        busca,
        filtro,
        ordem,
        false,
      );

      return livros;
    } catch (error) {
      if (!error.statusCode) error.statusCode = 500;
      throw error;
    }
  }

  
}
