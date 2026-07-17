import * as autopublicacaoService from "./autopublicacao.service.js";

export const GetLivrosById = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const livrosComCapas = await autopublicacaoService.getLivrosByIdService(userId);
    
    return res.status(200).json(livrosComCapas);
  } catch (err) {
    next(err);
  }
};

export const UpdateEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    await autopublicacaoService.updateEstadoService(id);

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const InsertLivro = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { dadosLivro, publicar, capa, manuscritoPath } = req.body;

    console.time("Tempo do insert");
    
    const resultado = await autopublicacaoService.insertLivroService({
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

export const CriarUploadLivro = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { tipo, extensao } = req.body;

    const resultado = await autopublicacaoService.criarUploadLivroService({
      userId,
      tipo,
      extensao
    });

    return res.status(200).json(resultado);
  } catch (error) {
    next(error);
  }
};
