import { UsuariosService } from "./usuarios.service.js";

export class UsuariosController {
  static async BuscarUsuarios(req, res, next) {
      try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 12;
        const busca = req.query.busca || "";
        const ordem = req.query.ordem || "";
        
        const funcao = req.query.funcao || "";
  
        const resultado = await UsuariosService.BuscarLivros(
          page,
          limit,
          busca,
          ordem,
          funcao
        );
  
        return res.status(200).json(resultado);
      } catch (err) {
        next(err);
      }
    }
}
