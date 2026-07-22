import { supabaseAdmin } from "../../common/config/supabase.js";
import { LivroModel } from "../../common/models/livro.model.js";
import { ColaboradorModel } from "../../common/models/colaborador.model.js";

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

  static async getLivrosService ({ page, limit, busca }) {
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
  }

  static async getLivrosByAutorService (id) {
    const livro = await LivroModel.buscarDetalhesPorId(id, false);

    if (!livro) {
      const erro404 = new Error("O livro solicitado não existe ou está indisponível.");
      erro404.statusCode = 404;
      throw erro404;
    }

    const { data: colaboradores } = await ColaboradorModel.buscarPorLivroId(id);
    const livroComCapa = this._parseCapaUrls(livro);

    return {
      data: {
        ...livroComCapa,
        colaboradores: colaboradores || [],
      },
    };
  }
}
