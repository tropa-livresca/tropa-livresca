import { AutorModel } from "../../common/models/autor.model.js";
import { LivroModel } from "../../common/models/livro.model.js";

export class AutorService {
  static async getAutoresService  ({ page, limit, busca })  {
  const { data, count } = await AutorModel.buscarComFiltros({ page, limit, busca });

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
      totalPages: Math.ceil(count / limit), 
    },
  };
};

static async getAutorByIdService  ({ id, page, limit })  {
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
      totalPages: Math.ceil(count / limit),
    },
  };
};

}