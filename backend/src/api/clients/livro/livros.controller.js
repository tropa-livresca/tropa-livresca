import * as livroService from "./livros.service.js";

export const GetLivros = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const busca = req.query.busca || "";

    const resultado = await livroService.getLivrosService({ page, limit, busca });

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

export const GetLivrosByAutor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const livroDetalhes = await livroService.getLivrosByAutorService(id);

    return res.status(200).json(livroDetalhes);
  } catch (err) {
    next(err);
  }
};