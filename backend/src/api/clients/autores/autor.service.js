import { AutorModel } from "../../common/models/autor.model.js";
import { LivroModel } from "../../common/models/livro.model.js";

export class AutorService {
  static _parseCapaUrls (livro) {
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

  static _parseCapasArray (livros) {
    if (!livros) return [];
    return livros.map(livro => this._parseCapaUrls(livro));
  }

  static async getAutoresService({ page, limit, busca }) {
    try {
      const { data, count } = await AutorModel.buscarComFiltros({
        page,
        limit,
        busca,
      });

      if (!data || data.length === 0) {
        const erro404 = new Error("Nenhum autor foi encontrado no catálogo.");
        erro404.statusCode = 404;
        throw erro404;
      }

      const autoresComCapas = data.map(autor => ({
        ...autor,
        livros: this._parseCapasArray(autor.livros)
      }));

      return {
        data: autoresComCapas,
        meta: {
          page,
          limit,
          totalItems: count,
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao buscar autores no catálogo.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }

  static async getAutorByIdService({ id, page, limit }) {
    try {
      const autor = await AutorModel.buscarPorId(id);

      if (!autor) {
        const erro404 = new Error("Autor não encontrado no catálogo.");
        erro404.statusCode = 404;
        throw erro404;
      }

      const livros = await LivroModel.buscarPorPerfilUsuario(id);
      const totalLivros = livros ? livros.length : 0;
      const livrosComCapas = this._parseCapasArray(livros);

      return {
        data: {
          ...autor,
          livros: livrosComCapas,
        },
        meta: {
          page,
          limit,
          totalItems: totalLivros,
          totalPages: Math.ceil(totalLivros / limit) || 1,
        },
      };
    } catch (error) {
      if (error.statusCode) throw error;
      const erroBanco = new Error("Erro ao buscar detalhes do autor.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }
  }
}
