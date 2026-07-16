import { AutorModel } from "../../common/models/autor.model.js";
import { LivroModel } from "../../common/models/livro.model.js";

export const getAutoresService = async ({ page, limit, busca }) => {
  const { data, count } = await AutorModel.buscarComFiltros(page, limit, busca);

  if (!data || data.length === 0) {
    const erro404 = new Error("Nenhum autor foi encontrado no catálogo.");
    erro404.statusCode = 404;
    throw erro404;
  }

  return {
    data,
    meta: {
      page,
      limit,
      totalItems: count,
      totalPage: Math.ceil(count / limit),
    },
  };
};

export const getAutorByIdService = async ({ id, page, limit }) => {
  const autor = await AutorModel.buscarPorId(id);

  if (!autor) {
    const erro404 = new Error("Autor não encontrado no catálogo.");
    erro404.statusCode = 404;
    throw erro404;
  }

  const { data: livros, count } = await LivroModel.buscarPorPerfilUsuario(id);

  return {
    data: {
      ...autor,
      livros: livros || []
    },
    meta: {
      page,
      limit,
      totalItems: count,
      totalPage: Math.ceil(count / limit),
    },
  };
};
