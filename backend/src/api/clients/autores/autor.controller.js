import * as autorService from "./autor.service.js";

export const GetAutores = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const busca = req.query.busca || "";

    const resultado = await autorService.getAutoresService({ page, limit, busca });

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

export const GetAutorById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;

    const resultado = await autorService.getAutorByIdService({ id, page, limit });

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};
