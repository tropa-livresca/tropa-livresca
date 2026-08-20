import { LivrosService } from "./livros.service.js";

export class LivroController{
    static async BuscarLivros(req, res, next){
        try{
                  const page = parseInt(req.query.page, 10) || 1;
                  const limit = parseInt(req.query.limit, 10) || 12;
                  const busca = req.query.busca || "";
                  const filtro = req.query.filtro || "";
                  const ordem = req.query.ordem || "";
            
                  const resultado = await LivrosService.BuscarLivros({
                    page,
                    limit,
                    busca,
                    filtro,
                    ordem,
                  });
            
                  return res.status(200).json(resultado);
            
        }catch(err){next(err);}
    }
}