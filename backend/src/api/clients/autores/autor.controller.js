import { supabaseAdmin } from "../../common/config/supabase.js";

import {AutorModel} from "../../common/models/autor.model.js";
import {LivroModel} from "../../common/models/livro.model.js";

export const GetAutores = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const busca = req.query.busca || "";

    const autor = await AutorModel.buscarComFiltros(page, limit, busca);

    if (data.length === 0) {
      const erro404 = new Error("Nenhum autor foi encontrado no catálogo.");
      erro404.statusCode = 404;
      throw erro404;
    }

    return res.json({
      data,
      meta: {
        page,
        limit,
        totalItems: count,
        totalPage: Math.ceil(count / limit),
      },
    });

  } catch (err) {
    next(err);
  }
};

export const GetAutorById = async (req, res, next) => {
  const { id } = req.params;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  try {
    const autor = await AutorModel.buscarPorId(id);

    const livro = await buscarPorPerfilUsuario(id);

    return res.status(200).json({
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
    });
  } catch (err) {
    next(err);
  }
};
