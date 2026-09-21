import { EnderecoService } from "./endereco.service.js";

export class EnderecoController {
  static async BuscarEnderecos(req, res, next) {
    try {
      const { id } = req.params;

      const endereco = await EnderecoService.BuscarEnderecos(id);

      return res.status(200).json(endereco);
    } catch (err) {
      next(err);
    }
  }
}
