import { GoogleBooksModel } from "../models/google.model.js";
import { GoogleBooksCache } from "./googleCache.service.js";

export class GoogleBooksService {
  static async buscarLivros({ busca = "", page = 1, limit = 6 }) {
    const buscaNormalizada = busca.trim().toLowerCase();

    const chave = [
      "google-books",
      buscaNormalizada || "sem-busca",
      page,
      limit,
    ].join(":");

    const cache = GoogleBooksCache.get(chave);

    if (cache) {
      return cache;
    }

    const resultado = await GoogleBooksModel.buscarLivros({
      busca: buscaNormalizada,
      page,
      limit,
    });

    const livros = (resultado.items || []).map((livro) =>
      this.normalizarLivro(livro),
    );

    const resposta = {
      data: livros,
      count: resultado.totalItems || 0,
    };

    GoogleBooksCache.set(chave, resposta);

    return resposta;
  }

  static async buscarLivroById(id) {
    const chave = `google-book:${id}`;

    const cache = GoogleBooksCache.get(chave);

    if (cache) {
      return cache;
    }

    const livro = await GoogleBooksModel.buscarLivroById(id);

    const livroNormalizado = this.normalizarLivro(livro);

    GoogleBooksCache.set(chave, livroNormalizado);

    return livroNormalizado;
  }

  static normalizarLivro(livro) {
    const info = livro.volumeInfo || {};
    const precos = this.gerarPrecosFicticios(livro);

    return {
      id: `google-${livro.id}`,

      titulo: info.title || "Título não informado",

      subtitulo: info.subtitle || null,

      autor: info.authors?.join(", ") || "Autor desconhecido",

      autores: info.authors || [],

      ISBN:
        info.industryIdentifiers?.find((item) => item.type === "ISBN_13")
          ?.identifier ||
        info.industryIdentifiers?.find((item) => item.type === "ISBN_10")
          ?.identifier ||
        null,

      descricao: info.description || null,

      capa: {
        frente:
          info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || null,

        verso: null,

        orelhas: null,
      },

      idioma: info.language || null,

      data_de_publicacao: info.publishedDate || null,

      editora: info.publisher || null,

      paginas: info.pageCount || null,

      categorias: info.categories || [],

      avaliacao: info.averageRating || null,

      quantidade_avaliacoes: info.ratingsCount || 0,

      precoDigital: precos.precoDigital,

      precoFisico: precos.precoFisico,

      precoFicticio: true,
      vendaSimulada: true,

      origem: "externa",
      fonte: "google_books",
      vendaInterna: true,

      urlExterna: livro.accessInfo?.infoLink || null,
    };
  }

  static gerarPrecosFicticios(livro) {
    const paginas = livro.volumeInfo?.pageCount || 200;

    let precoDigital;
    let precoFisico;

    if (paginas < 150) {
      precoDigital = 14.9;
      precoFisico = 29.9;
    } else if (paginas < 300) {
      precoDigital = 19.9;
      precoFisico = 39.9;
    } else if (paginas < 500) {
      precoDigital = 24.9;
      precoFisico = 49.9;
    } else {
      precoDigital = 29.9;
      precoFisico = 59.9;
    }

    return {
      precoDigital,
      precoFisico,
    };
  }
}
