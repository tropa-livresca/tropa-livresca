import { LojaModel } from "../../common/models/loja.model.js";

import { GoogleBooksService } from "../../common/services/google.service.js";

export class LojaService {
  static async buscarLivros({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
  }) {
    const livrosTropa = await LojaModel.buscarComFiltros({
      page,
      limit,
      busca,
      filtro,
      ordem,
    });

    let livrosExternos = {
      data: [],
      count: 0,
    };

    try {
      livrosExternos = await GoogleBooksService.buscarLivros({
        busca,
        page,
        limit: 6,
      });
    } catch (error) {
      if (error.statusCode === 429) {
        console.warn(
          "Google Books indisponível: limite de requisições atingido.",
        );
      } else {
        console.error("Erro ao consultar Google Books:", error);
      }
    }

    const livrosTropaNormalizados = livrosTropa.data.map((livro) =>
      this.normalizarLivroTropa(livro),
    );

    return {
      data: [...livrosTropaNormalizados, ...livrosExternos.data],

      meta: {
        pagina: page,
        limite: limit,

        totalTropa: livrosTropa.count,

        totalExterno: livrosExternos.count,

        googleBooksDisponivel: livrosExternos.data.lenght > 0,
      },
    };
  }

  static normalizarLivroTropa(livro) {
    return {
      id: `tropa-${livro.id}`,

      titulo: livro.titulo,

      subtitulo: livro.subtitulo,

      autor: [livro.autor_nome, livro.autor_sobrenome]
        .filter(Boolean)
        .join(" "),

      ISBN: livro.ISBN,

      descricao: livro.descricao,

      capa: {
        frente: livro.capa?.frente || null,
        verso: livro.capa?.verso || null,
        orelhas: livro.capa?.orelhas || null,
      },

      idioma: livro.idioma,

      data_de_publicacao: livro.data_de_publicacao,

      precoDigital: livro.preco_digital,

      precoFisico: livro.preco_fisico,

      numero_edicao: livro.numero_edicao,

      precoFicticio: false,
      vendaSimulada: false,

      origem: "tropa",
      fonte: "tropa_livresca",
      vendaInterna: true,

      urlExterna: null,
    };
  }

  static async buscarLivroById(id) {
    if (id.startsWith("tropa-")) {
      const livroId = id.replace("tropa-", "");

      const livro = await LojaModel.buscarLivroLojaById(livroId);

      return this.normalizarLivroTropa(livro);
    }

    if (id.startsWith("google-")) {
      const googleId = id.replace("google-", "");

      return await GoogleBooksService.buscarLivroById(googleId);
    }

    const error = new Error("Livro não encontrado.");

    error.statusCode = 404;

    throw error;
  }
}
