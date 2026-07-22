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
    await AutopublicacaoService.updateEstadoService(id);

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};

static async InsertLivro (req, res, next) {
  try {
    const userId = req.user?.id;
    const { dadosLivro, publicar, capa, manuscritoPath } = req.body;

    console.time("Tempo do insert");
    
    const resultado = await AutopublicacaoService.insertLivroService({
      userId,
      dadosLivro,
      publicar,
      capa,
      manuscritoPath
    });

    console.timeEnd("Tempo do insert");

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
