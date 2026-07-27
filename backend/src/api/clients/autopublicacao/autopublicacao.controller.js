import {AutopublicacaoService} from "./autopublicacao.service.js";

export class AutopublicacaoController{
static async GetLivrosById (req, res, next) {
  try {
    const userId = req.user?.id;
    const livrosComCapas = await AutopublicacaoService.getLivrosByIdService(userId);
    
    return res.status(200).json(livrosComCapas);
  } catch (err) {
    next(err);
  }
}

static async UpdateEstado (req, res, next) {
  try {
    const { id } = req.params;
    const { rascunho } = req.body; 
    
    const isRascunho = String(rascunho) === "true" || rascunho === true;

    await AutopublicacaoService.updateEstadoService(id, isRascunho);

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};

static async InativarLivro(req, res, next){
  try{
    const { id } = req.params;
    await AutopublicacaoService.inativarLivro(id);

    return res.status(200).end();
  }catch(err){
    next(err);
  }
};

static async InsertLivro (req, res, next) {
  try {
    const userId = req.user?.id;
    const { dadosLivro, publicar, capa, manuscritoPath } = req.body;
    
    const resultado = await AutopublicacaoService.insertLivroService({
      userId,
      dadosLivro,
      publicar,
      capa,
      manuscritoPath
    });

    return res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
};

static async CriarUploadLivro (req, res, next) {
  try {
    const userId = req.user?.id;
    const { tipo, extensao } = req.body;

    const resultado = await AutopublicacaoService.criarUploadLivroService({
      userId,
      tipo,
      extensao
    });

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};

}
