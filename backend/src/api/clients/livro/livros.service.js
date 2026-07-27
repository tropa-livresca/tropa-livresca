import { LivroModel } from "../../common/models/livro.model.js";

export class LivrosService {
  static _parseCapaUrls (livro) {
    if (!livro) return livro;
    try {
      if (typeof livro.capa === "string") {
        livro.capa = JSON.parse(livro.capa);
      }
    } catch (e) {
      console.warn("Erro ao parsear capa JSON", e);
    }
    return livro;
  }

  static _parseCapasArray (livros) {
    return livros.map(livro => this._parseCapaUrls(livro));
  }

  static async getLivros ({ page, limit, busca }) {
    try {
      const { data, count } = await LivroModel.buscarComFiltros({ page, limit, busca });

      if (!data || data.length === 0) {
        const erro404 = new Error("Nenhum livro foi encontrado na vitrine.");
        erro404.statusCode = 404;
        throw erro404; 
      }

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
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao buscar livros na vitrine.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async getLivrosByAutor (id) {
    try {
      const livro = await LivroModel.buscarDetalhesPorId(id, false);

      if (!livro) {
        const erro404 = new Error("O livro solicitado não existe ou está indisponível.");
        erro404.statusCode = 404;
        throw erro404;
      }

      const livroComCapa = this._parseCapaUrls(livro);

      return {
        data: {
          ...livroComCapa,
        },
      };
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao buscar livros do autor.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async getLivrosById(id) {
    try {
      const data = await LivroModel.buscarDetalhesPorId(id);

      if (!data) {
        const erro404 = new Error("O livro solicitado não existe ou está indisponível.");
        erro404.statusCode = 404;
        throw erro404;
      }
      
      const livroComCapa = this._parseCapaUrls(data);
      return livroComCapa;
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao buscar detalhes do livro.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }
}
