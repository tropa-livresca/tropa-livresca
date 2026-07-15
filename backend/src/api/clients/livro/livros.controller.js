import supabase, { supabaseAdmin } from "../../common/config/supabase.js";

import {LivroModel} from "../../common/models/livro.model.js";
import {ColaboradorModel} from "../../common/models/colaborador.model.js";

const parseCapaUrls = (livro) => {
  if (!livro) return livro;
  try {
    if (typeof livro.capa === "string") {
      livro.capa = JSON.parse(livro.capa);
    }
  } catch (e) {
    console.warn("Erro ao parsear capa JSON", e);
  }
  return livro;
};

const parseCapasArray = (livros) => {
  return livros.map(parseCapaUrls);
};

export const GetLivros = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const busca = req.query.busca || "";

  try {
    const {data, count} = await LivroModel.buscarComFiltros({
      page,
      limit,
      busca,
    });

    if (data.length === 0) {
      const erro404 = new Error("Nenhum livro foi encontrado na vitrine.");
      erro404.statusCode = 404;
    }

    const livrosComCapas = parseCapasArray(data);

    return res.status(200).json({
      data: livrosComCapas,
      meta: {
        page,
        limit,
        totalItems: count || livrosComCapas.length,
        totalPages: Math.ceil((count || livrosComCapas.length) / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const GetLivrosById = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      const erro401 = new Error("Usuário não autenticado ou token inválido.");
      erro401.statusCode = 401;
      throw erro401;
    }

    const livros = await LivroModel.buscarPorPerfilUsuario(req.user.id,);

    if (data.length === 0) {
      const erro404 = new Error("Nenhum rascunho de livro encontrado para este autor.");

      erro404.statusCode = 404;
      throw erro404;
    }

    const livrosComCapas = parseCapasArray(data);
    
    return res.status(200).json(livrosComCapas);
  } catch (err) {
    next(err);
  }
};

export const GetLivrosByAutor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const livro = await LivroModel.buscarDetalhesPorId(id, false);

    if (!livro) {
      const erro404 = new Error("O livro solicitado não existe ou está indisponível.");
      erro404.statusCode = 404;
      throw erro404;
    }

    const colaborador = await ColaboradorModel.buscarPorLivroId(id);

    const livroComCapa = parseCapaUrls(livro);

    return res.status(200).json({
      data: {
        ...livroComCapa,
        colaboradores: colaboradores || [],
      },
    });
  } catch (err) {
    next(err);
  }
};

export const UpdateStatusAtivo = async (req, res, next) => {
  try {
    await LivroModel.desativar(req.params.id);

    return res.status(200).end();
  } catch (err) {
    next(err);
  }
};

export const InsertLivro = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      const erro401 = new Error("Sessão expirada. Autentique-se novamente para publicar.");
      erro401.statusCode = 401;
      throw erro401;
    }

    const {
      dadosLivro = {},
      publicar = true,
      capa = {},
      manuscritoPath = null,
    } = req.body;

    const userId = req.user.id;
    let manuscritoUrl = null;

    if (manuscritoPath) {
      const caminhoEsperado = `${userId}/`;

      if (!manuscritoPath.startsWith(caminhoEsperado)) {
        const erro403 = new Error("Tentativa inválida de manipulação de arquivo de outro usuário.");
        erro403.statusCode = 403;
        throw erro403;
      }

      const { data: signedData, error: signedError } = await supabaseAdmin.storage
        .from("manuscrito-livro")
        .createSignedUrl(manuscritoPath, 31536000);

      if (signedError) {
        signedError.statusCode = 500;
        throw signedError;
      }

      manuscritoUrl = signedData.signedUrl;
    }

    const dadosParaInserir = {
      fk_user_profile_id: userId,
      estado: publicar ? "publicado" : "rascunho",
      titulo: dadosLivro.detalhes?.titulo || null,
      subtitulo: dadosLivro.detalhes?.subtitulo || null,
      descricao: dadosLivro.detalhes?.descricao || null,
      numero_edicao: dadosLivro.detalhes?.numeroEdicao ? parseInt(dadosLivro.detalhes.numeroEdicao, 10) : null,
      autor_nome: dadosLivro.detalhes?.autor?.nome || null,
      autor_sobrenome: dadosLivro.detalhes?.autor?.sobrenome || null,
      publico_alvo: dadosLivro.detalhes?.publicoPrincipal || null,
      colaboradores: dadosLivro.detalhes?.colaboradores || [],
      direitos_de_publicacao: dadosLivro.detalhes?.direitoPublicacao === "sim" || dadosLivro.detalhes?.direitoPublicacao === true,
      conteudo_por_IA: dadosLivro.detalhes?.conteudoPorIA === true,
      imagens_explicitas: dadosLivro.detalhes?.imagensExplicitas === true,
      data_de_publicacao: new Date().toISOString().split("T")[0],
      preco_digital: dadosLivro.orcamento?.valorLivroDigital ? parseFloat(dadosLivro.orcamento.valorLivroDigital) : 0.0,
      preco_fisico: dadosLivro.orcamento?.valorLivroFisico ? parseFloat(dadosLivro.orcamento.valorLivroFisico) : 0.0,
      capa: JSON.stringify({
        frente: capa.frente || null,
        verso: capa.verso || null,
        orelhas: capa.orelhas || null,
      }),
      manuscrito: manuscritoUrl,
    };

    console.time("Tempo do insert");
    
    const novoLivro = await LivroModel.criar(dadosParaInserir);

    return res.status(201).json({
      data: novoLivro,
      manuscritoUrl,
    });
  } catch (err) {
    next(err);
  }
};

export const CriarUploadLivro = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      const erro401 = new Error("Usuário não autenticado.");
      erro401.statusCode = 401;
      throw erro401;
    }

    const { tipo, extensao } = req.body;
    const userId = req.user.id;

    const buckets = {
      capa_frente: "capa-livros",
      capa_verso: "capa-livros",
      capa_orelhas: "capa-livros",
      manuscrito: "manuscrito-livro",
    };

    const bucket = buckets[tipo];

    if (!bucket) {
      const erro400 = new Error("Tipo de arquivo inválido para o sistema.");
      erro400.statusCode = 400;
      throw erro400;
    }

    const path = `${userId}/livro_${tipo}_${globalThis.crypto.randomUUID()}.${extensao}`;

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return res.status(200).json({
      bucket,
      path,
      token: data.token,
    });
  } catch (error) {
    next(error);
  }
};
