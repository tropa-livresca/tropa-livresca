import { supabaseAdmin } from "../../common/config/supabase.js";
import { AutopublicacaoModel } from "../../common/models/autopublicacao.model.js";
import {
  LIVRO_ESTADO,
  TRANSICOES_CLIENTE,
  transicaoPermitida,
} from "../../common/config/livro-estados.js";
import {
  STORAGE_BUCKET,
  criarPathUpload,
  criarUrlAssinada,
  normalizarCaminhoPersistido,
  obterRegraArquivo,
  removerArquivos,
  validarArquivoArmazenado,
  validarMetadadosUpload,
  validarPathDoUsuario,
} from "../../common/config/storage.js";

export class AutopublicacaoService {
  static _parseCapa(capa) {
    if (!capa) return {};
    if (typeof capa === "object") return capa;

    if (typeof capa === "string") {
      try {
        const capaParseada = JSON.parse(capa);
        return capaParseada && typeof capaParseada === "object"
          ? capaParseada
          : {};
      } catch {
        return {};
      }
    }

    return {};
  }

  static _capaPaths(capa) {
    const capaNormalizada = this._parseCapa(capa);

    return {
      frente: normalizarCaminhoPersistido(
        capaNormalizada.frente,
        STORAGE_BUCKET.CAPAS,
      ),
      verso: normalizarCaminhoPersistido(
        capaNormalizada.verso,
        STORAGE_BUCKET.CAPAS,
      ),
      orelhas: normalizarCaminhoPersistido(
        capaNormalizada.orelhas,
        STORAGE_BUCKET.CAPAS,
      ),
    };
  }

  static async _assinarLivro(livro) {
    if (!livro) return livro;

    const capaPaths = this._capaPaths(livro.capa);
    const capas = await Promise.all(
      Object.entries(capaPaths).map(async ([parte, path]) => [
        parte,
        path ? await criarUrlAssinada(STORAGE_BUCKET.CAPAS, path) : null,
      ]),
    );
    const manuscritoPath = normalizarCaminhoPersistido(
      livro.manuscrito,
      STORAGE_BUCKET.MANUSCRITOS,
    );

    return {
      ...livro,
      capa: Object.fromEntries(capas),
      capaPaths,
      manuscrito: manuscritoPath
        ? await criarUrlAssinada(STORAGE_BUCKET.MANUSCRITOS, manuscritoPath)
        : null,
      manuscritoPath,
    };
  }

  static async _assinarLivros(livros) {
    return Promise.all(livros.map((livro) => this._assinarLivro(livro)));
  }

  static _validarPath(path, userId, bucket) {
    if (path === null || path === undefined) return null;
    const pathNormalizado = normalizarCaminhoPersistido(path, bucket);
    return validarPathDoUsuario(pathNormalizado, userId, bucket);
  }

  static _pathsCapaParaPersistir({ capa, capaPaths, capaAtual, userId }) {
    const entradas = capaPaths ?? capa ?? {};
    const pathsAtuais = this._capaPaths(capaAtual);

    return Object.fromEntries(
      ["frente", "verso", "orelhas"].map((parte) => {
        const valor = Object.prototype.hasOwnProperty.call(entradas, parte)
          ? entradas[parte]
          : pathsAtuais[parte];
        return [
          parte,
          valor === null
            ? null
            : this._validarPath(valor, userId, STORAGE_BUCKET.CAPAS),
        ];
      }),
    );
  }

  static async _removerComAviso(bucket, paths) {
    if (!paths?.length) return;

    try {
      await removerArquivos(bucket, paths);
    } catch (error) {
      console.error("Não foi possível remover arquivos do Storage:", error);
    }
  }

  static async _validarArquivosNovos({ capa, manuscritoPath }) {
    await Promise.all(
      Object.entries(capa || {})
        .filter(([, path]) => path)
        .map(([, path]) =>
          validarArquivoArmazenado(STORAGE_BUCKET.CAPAS, path, "capa_frente"),
        ),
    );

    if (manuscritoPath) {
      await validarArquivoArmazenado(
        STORAGE_BUCKET.MANUSCRITOS,
        manuscritoPath,
        "manuscrito",
      );
    }
  }

  static async atualizarEstado(livroId, userId, novoEstado) {
    if (!livroId) {
      const erroDados = new Error(
        "Erro ao alterar livro. Dados não informados.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    if (!userId) {
      const erroUserId = new Error("Erro de autenticação do usuário.");
      erroUserId.statusCode = 401;
      throw erroUserId;
    }

    if (!novoEstado) {
      const erroEstado = new Error("Novo estado não informado.");
      erroEstado.statusCode = 400;
      throw erroEstado;
    }

    if (!Object.values(LIVRO_ESTADO).includes(novoEstado)) {
      const erroEstado = new Error("Estado de livro inválido.");
      erroEstado.statusCode = 400;
      throw erroEstado;
    }

    const estadoAtual = await AutopublicacaoModel.buscarDetalhesPorId(
      livroId,
      userId,
    );

    if (!estadoAtual) {
      const erroEstadoAtual = new Error("Livro não encontrado.");
      erroEstadoAtual.statusCode = 404;
      throw erroEstadoAtual;
    }

    if (
      !transicaoPermitida(estadoAtual.estado, novoEstado, TRANSICOES_CLIENTE)
    ) {
      const erroAtualizacao = new Error(
        "A transição de estado solicitada não é permitida para o cliente.",
      );
      erroAtualizacao.statusCode = 409;
      throw erroAtualizacao;
    }

    const atualizado = await AutopublicacaoModel.atualizarEstado(
      livroId,
      novoEstado,
      userId,
      estadoAtual.estado,
    );

    return atualizado;
  }

  static async deletarLivroRascunho(livroId, userId) {
    const livroDeletado = await AutopublicacaoModel.deletarLivro(
      livroId,
      userId,
    );

    if (livroDeletado.error) throw livroDeletado.error;

    const livros = Array.isArray(livroDeletado)
      ? livroDeletado
      : [livroDeletado];
    const capas = livros.flatMap((livro) =>
      Object.values(this._capaPaths(livro?.capa)).filter(Boolean),
    );
    const manuscritos = livros
      .map((livro) =>
        normalizarCaminhoPersistido(
          livro?.manuscrito,
          STORAGE_BUCKET.MANUSCRITOS,
        ),
      )
      .filter(Boolean);

    await this._removerComAviso(STORAGE_BUCKET.CAPAS, capas);
    await this._removerComAviso(STORAGE_BUCKET.MANUSCRITOS, manuscritos);

    return livroDeletado;
  }

  static async buscarComFiltros({
    userId,
    page,
    limit,
    busca,
    filtro,
    ordem,
    estado,
  }) {
    const resultado = await AutopublicacaoModel.buscarComFiltros({
      userId,
      page,
      limit,
      busca,
      filtro,
      ordem,
      estado,
    });

    if (resultado.error) throw resultado.error;

    const listaLivros = resultado.data;
    const total = resultado.count;

    const livrosFormatados = await this._assinarLivros(listaLivros);

    return {
      data: livrosFormatados,
      meta: {
        totalItems: total,
        limit,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async buscarDetalhesPorId(livroId, userId) {
    if (!userId) {
      const erroUserId = new Error("Sessão expirada. Renovar login.");
      erroUserId.statusCode = 401;
      throw erroUserId;
    }

    if (!livroId) {
      const erroLivroId = new Error("O id do livro não foi informado.");
      erroLivroId.statusCode = 500;
      throw erroLivroId;
    }

    const resultado = await AutopublicacaoModel.buscarDetalhesPorId(
      livroId,
      userId,
    );

    if (resultado.error) throw resultado.error;

    return this._assinarLivro(resultado);
  }

  static async criarLivro({
    userId,
    dadosLivro = {},
    estadoInicial = LIVRO_ESTADO.RASCUNHO,
    capa = {},
    capaPaths = undefined,
    manuscritoPath = null,
  }) {
    if (!userId) {
      const error = new Error(
        "Sessão expirada. Autentique-se novamente para publicar.",
      );
      error.statusCode = 401;
      throw error;
    }

    console.log(estadoInicial);
    if (estadoInicial !== LIVRO_ESTADO.RASCUNHO && estadoInicial !== LIVRO_ESTADO.EM_REVISAO  ) {
      const error = new Error(
        "Livros só podem ser criados inicialmente como rascunho.",
      );
      error.statusCode = 400;
      throw error;
    }

    const capaParaPersistir = this._pathsCapaParaPersistir({
      capa,
      capaPaths,
      userId,
    });
    const manuscritoParaPersistir = manuscritoPath
      ? this._validarPath(manuscritoPath, userId, STORAGE_BUCKET.MANUSCRITOS)
      : null;
    const capasNovas = Object.values(capaParaPersistir).filter(Boolean);

    try {
      await this._validarArquivosNovos({
        capa: capaParaPersistir,
        manuscritoPath: manuscritoParaPersistir,
      });
    } catch (error) {
      await this._removerComAviso(STORAGE_BUCKET.CAPAS, capasNovas);
      await this._removerComAviso(
        STORAGE_BUCKET.MANUSCRITOS,
        manuscritoParaPersistir ? [manuscritoParaPersistir] : [],
      );
      throw error;
    }

    const dadosParaInserir = {
      ativo: true,
      fk_user_profile_id: userId,
      estado: estadoInicial,
      ISBN: dadosLivro.detalhes?.ISBN || null,
      titulo: dadosLivro.detalhes?.titulo || null,
      subtitulo: dadosLivro.detalhes?.subtitulo || null,
      descricao: dadosLivro.detalhes?.descricao || null,
      numero_edicao: dadosLivro.detalhes?.numeroEdicao
        ? parseInt(dadosLivro.detalhes.numeroEdicao, 10)
        : null,
      numero_paginas: dadosLivro.orcamento?.numeroPaginas
        ? parseInt(dadosLivro.orcamento.numeroPaginas, 10)
        : null,
      idioma: dadosLivro.detalhes.idioma,
      categoria: dadosLivro.detalhes.categoria,
      autor_nome: dadosLivro.detalhes?.autor?.nome || null,
      autor_sobrenome: dadosLivro.detalhes?.autor?.sobrenome || null,
      colaboradores: dadosLivro.detalhes?.colaboradores || [],
      direitos_de_publicacao:
        dadosLivro.detalhes?.direitoPublicacao === "sim" ||
        dadosLivro.detalhes?.direitoPublicacao === true,
      imagens_explicitas: dadosLivro.detalhes?.imagensExplicitas === true,
      data_de_publicacao: new Date().toISOString().split("T")[0],
      preco_digital: dadosLivro.orcamento?.valorLivroDigital
        ? parseFloat(dadosLivro.orcamento.valorLivroDigital)
        : 0.0,
      preco_fisico: dadosLivro.orcamento?.valorLivroFisico
        ? parseFloat(dadosLivro.orcamento.valorLivroFisico)
        : 0.0,
      capa: capaParaPersistir,
      manuscrito: manuscritoParaPersistir,
    };

    let novoLivro;
    try {
      novoLivro = await AutopublicacaoModel.criarLivro(dadosParaInserir);
    } catch (error) {
      await this._removerComAviso(STORAGE_BUCKET.CAPAS, capasNovas);
      await this._removerComAviso(
        STORAGE_BUCKET.MANUSCRITOS,
        manuscritoParaPersistir ? [manuscritoParaPersistir] : [],
      );
      throw error;
    }

    if (novoLivro.error) throw novoLivro.error;

    const livroFormatado = await this._assinarLivro(novoLivro);

    return {
      data: livroFormatado,
      manuscritoUrl: livroFormatado.manuscrito,
    };
  }

  static async atualizarLivro({
    userId,
    livroId,
    dadosLivro = {},
    capa = {},
    capaPaths = undefined,
    manuscritoPath = undefined,
  }) {
    if (!userId) {
      const error = new Error(
        "Sessão expirada. Autentique-se novamente para atualizar.",
      );
      error.statusCode = 401;
      throw error;
    }

    if (!livroId) {
      const error = new Error("ID do livro é obrigatório para atualização.");
      error.statusCode = 400;
      throw error;
    }

    const livroAtual = await AutopublicacaoModel.buscarDetalhesPorId(
      livroId,
      userId,
    );

    if (!livroAtual) {
      const error = new Error(
        "Livro não encontrado ou não pertence ao usuário.",
      );
      error.statusCode = 404;
      throw error;
    }

    if (
      ![
        LIVRO_ESTADO.RASCUNHO,
        LIVRO_ESTADO.NEGADO,
        LIVRO_ESTADO.RECALL,
      ].includes(livroAtual.estado)
    ) {
      const error = new Error(
        "Este livro está travado para alterações no momento.",
      );
      error.statusCode = 403;
      throw error;
    }

    const capaAtual = this._capaPaths(livroAtual.capa);
    const capaParaPersistir = this._pathsCapaParaPersistir({
      capa,
      capaPaths,
      capaAtual: livroAtual.capa,
      userId,
    });
    const manuscritoAtual = normalizarCaminhoPersistido(
      livroAtual.manuscrito,
      STORAGE_BUCKET.MANUSCRITOS,
    );
    const manuscritoParaPersistir =
      manuscritoPath === undefined
        ? manuscritoAtual
        : manuscritoPath === null
          ? null
          : this._validarPath(
              manuscritoPath,
              userId,
              STORAGE_BUCKET.MANUSCRITOS,
            );
    const capasSubstitutas = Object.fromEntries(
      Object.entries(capaParaPersistir).filter(
        ([parte, path]) => path && path !== capaAtual[parte],
      ),
    );
    const manuscritoSubstituto =
      manuscritoParaPersistir && manuscritoParaPersistir !== manuscritoAtual
        ? manuscritoParaPersistir
        : null;
    try {
      await this._validarArquivosNovos({
        capa: capasSubstitutas,
        manuscritoPath: manuscritoSubstituto,
      });
    } catch (error) {
      await this._removerComAviso(
        STORAGE_BUCKET.CAPAS,
        Object.values(capasSubstitutas),
      );
      await this._removerComAviso(
        STORAGE_BUCKET.MANUSCRITOS,
        manuscritoSubstituto ? [manuscritoSubstituto] : [],
      );
      throw error;
    }

    const dadosParaAtualizar = {
      ISBN: dadosLivro.detalhes?.ISBN || livroAtual.ISBN,
      titulo: dadosLivro.detalhes?.titulo || livroAtual.titulo,
      subtitulo: dadosLivro.detalhes?.subtitulo || livroAtual.subtitulo,
      descricao: dadosLivro.detalhes?.descricao || livroAtual.descricao,
      idioma: dadosLivro.detalhes?.idioma || livroAtual.idioma,
      categoria: dadosLivro.detalhes?.categoria || livroAtual.categoria,
      numero_edicao: dadosLivro.detalhes?.numeroEdicao
        ? parseInt(dadosLivro.detalhes.numeroEdicao, 10)
        : livroAtual.numero_edicao,
      autor_nome: dadosLivro.detalhes?.autor?.nome || livroAtual.autor_nome,
      autor_sobrenome:
        dadosLivro.detalhes?.autor?.sobrenome || livroAtual.autor_sobrenome,
      numero_paginas: dadosLivro.orcamento?.numeroPaginas
        ? parseInt(dadosLivro.orcamento.numeroPaginas, 10)
        : livroAtual.numero_paginas,
      colaboradores:
        dadosLivro.detalhes?.colaboradores || livroAtual.colaboradores,
      direitos_de_publicacao:
        dadosLivro.detalhes?.direitoPublicacao === "sim" ||
        dadosLivro.detalhes?.direitoPublicacao === true ||
        livroAtual.direitos_de_publicacao,
      imagens_explicitas:
        dadosLivro.detalhes?.imagensExplicitas === true ||
        livroAtual.imagens_explicitas,
      preco_digital: dadosLivro.orcamento?.valorLivroDigital
        ? parseFloat(dadosLivro.orcamento.valorLivroDigital)
        : livroAtual.preco_digital,
      preco_fisico: dadosLivro.orcamento?.valorLivroFisico
        ? parseFloat(dadosLivro.orcamento.valorLivroFisico)
        : livroAtual.preco_fisico,
      capa: capaParaPersistir,
      manuscrito: manuscritoParaPersistir,
    };

    let atualizado;
    try {
      atualizado = await AutopublicacaoModel.atualizarLivro(
        livroId,
        userId,
        livroAtual.estado,
        dadosParaAtualizar,
      );
    } catch (error) {
      await this._removerComAviso(
        STORAGE_BUCKET.CAPAS,
        Object.values(capasSubstitutas),
      );
      await this._removerComAviso(
        STORAGE_BUCKET.MANUSCRITOS,
        manuscritoSubstituto ? [manuscritoSubstituto] : [],
      );
      throw error;
    }

    if (atualizado.error) throw atualizado.error;

    const capasAntigas = Object.entries(capaAtual)
      .filter(([parte, path]) => path && path !== capaParaPersistir[parte])
      .map(([, path]) => path);
    await this._removerComAviso(STORAGE_BUCKET.CAPAS, capasAntigas);
    if (manuscritoAtual && manuscritoAtual !== manuscritoParaPersistir) {
      await this._removerComAviso(STORAGE_BUCKET.MANUSCRITOS, [
        manuscritoAtual,
      ]);
    }

    const livroFormatado = await this._assinarLivro(atualizado);

    return { data: livroFormatado, manuscritoUrl: livroFormatado.manuscrito };
  }

  static async criarUploadLivro({ userId, tipo, extensao, mimeType, tamanho }) {
    if (!userId) {
      const error = new Error("Usuário não autenticado.");
      error.statusCode = 401;
      throw error;
    }

    const { extensao: extensaoNormalizada } = validarMetadadosUpload({
      tipo,
      extensao,
      mimeType,
      tamanho,
    });
    const { bucket, path } = criarPathUpload(userId, tipo, extensaoNormalizada);

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      bucket,
      path,
      token: data.token,
    };
  }

  static async limparUploads({ userId, arquivos = [] }) {
    if (!userId) {
      const error = new Error("Usuário não autenticado.");
      error.statusCode = 401;
      throw error;
    }

    const porBucket = new Map();

    for (const arquivo of arquivos) {
      const regra = obterRegraArquivo(arquivo?.tipo);
      const path = validarPathDoUsuario(arquivo?.path, userId, regra.bucket);
      const paths = porBucket.get(regra.bucket) || [];
      paths.push(path);
      porBucket.set(regra.bucket, paths);
    }

    for (const [bucket, paths] of porBucket) {
      await removerArquivos(bucket, paths);
    }
  }
}
