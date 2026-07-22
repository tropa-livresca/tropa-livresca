import {AutorService} from "./autor.service.js";

export class AutorController {
  static async GetAutores (req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const busca = req.query.busca || "";

    const resultado = await AutorService.getAutoresService({ page, limit, busca });

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};

static async GetAutorById (req, res, next) {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;

    const resultado = await AutorService.getAutorByIdService({ id, page, limit });

    return res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
};
}