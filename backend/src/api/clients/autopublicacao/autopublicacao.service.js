import { AutopublicacaoModel } from "../../common/models/autopublicacao.model.js";
import {
  criarClienteModel,
  mapearCampoArquivo,
  primeiraUrlArquivo,
} from "../../common/models/pocketbase.helpers.js";

import {
  LIVRO_ESTADO,
  TRANSICOES_CLIENTE,
  transicaoPermitida,
} from "../../common/config/livro-estados.js";
import { validarMetadadosUpload } from "../../common/config/storage.js";

export class AutopublicacaoService {
  static _removerArquivo(formData, campo, nomeArquivo) {
    if (!nomeArquivo) return;

    for (const nome of Array.isArray(nomeArquivo)
      ? nomeArquivo
      : [nomeArquivo]) {
      formData.append(`${campo}-`, nome);
    }
  }
  static _converterPreco(valor, nomeCampo) {
    if (valor === null || valor === undefined || valor === "") return 0;

    const texto = String(valor).trim();
    if (!texto) return 0;

    const normalizado = texto.includes(",")
      ? texto.replace(/\./g, "").replace(",", ".")
      : texto;
    const preco = Number(normalizado);

    if (!Number.isFinite(preco) || preco < 0) {
      const error = new Error(`Preço inválido para ${nomeCampo}.`);
      error.statusCode = 400;
      throw error;
    }

    return preco;
  }

  static _obterArquivo(arquivos, campo) {
    const arquivo = arquivos?.[campo];

    if (Array.isArray(arquivo)) {
      return arquivo[0] || null;
    }

    return arquivo || null;
  }

  static _adicionarArquivo(formData, campo, arquivo) {
    if (!arquivo) return;

    if (!arquivo.buffer || !arquivo.originalname) {
      const error = new Error(`Arquivo inválido: ${campo}.`);
      error.statusCode = 400;
      throw error;
    }

    validarMetadadosUpload({
      tipo: campo,
      extensao: arquivo.originalname.split(".").pop(),
      mimeType: arquivo.mimetype,
      tamanho: arquivo.size ?? arquivo.buffer.length,
    });

    const blob = new Blob([arquivo.buffer], {
      type: arquivo.mimetype,
    });

    formData.append(campo, blob, arquivo.originalname);
  }

  static _adicionarCampo(formData, campo, valor) {
    if (valor === undefined || valor === null) return;

    if (typeof valor === "object") {
      formData.append(campo, JSON.stringify(valor));
      return;
    }

    formData.append(campo, String(valor));
  }

  static _criarFormData(dados, arquivos = {}) {
    const formData = new FormData();

    Object.entries(dados).forEach(([campo, valor]) => {
      this._adicionarCampo(formData, campo, valor);
    });

    ["manuscrito", "capa_frente", "capa_verso"].forEach((campo) => {
      this._adicionarArquivo(
        formData,
        campo,
        this._obterArquivo(arquivos, campo),
      );
    });

    return formData;
  }

  static _assinarLivro(livro) {
    if (!livro) return livro;

    const pb = criarClienteModel();
    const arquivos = {
      ...mapearCampoArquivo(pb, livro, "manuscrito"),
      ...mapearCampoArquivo(pb, livro, "capa_frente"),
      ...mapearCampoArquivo(pb, livro, "capa_verso"),
    };

    return {
      ...livro,
      ...arquivos,
      manuscritoUrl: primeiraUrlArquivo(arquivos.manuscritoUrl),
      manuscritoPath: arquivos.manuscritoNome,
      capa: {
        frente: primeiraUrlArquivo(arquivos.capa_frenteUrl),
        verso: primeiraUrlArquivo(arquivos.capa_versoUrl),
      },
      capaPaths: {
        frente: arquivos.capa_frenteNome,
        verso: arquivos.capa_versoNome,
      },
    };
  }

  static async _assinarLivros(livros) {
    return livros.map((livro) => this._assinarLivro(livro));
  }

  static _validarArquivosObrigatorios(arquivos = {}) {
    const manuscrito = this._obterArquivo(arquivos, "manuscrito");
    const capaFrente = this._obterArquivo(arquivos, "capa_frente");

    if (!manuscrito) {
      const error = new Error("O manuscrito do livro é obrigatório.");
      error.statusCode = 400;
      throw error;
    }

    if (!capaFrente) {
      const error = new Error("A capa do livro é obrigatória.");
      error.statusCode = 400;
      throw error;
    }

    if (!this._obterArquivo(arquivos, "capa_verso")) {
      const error = new Error("A capa do verso do livro é obrigatória.");
      error.statusCode = 400;
      throw error;
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

    if (!novoEstado) {
      const erroEstado = new Error("Novo estado não informado.");
      erroEstado.statusCode = 400;
      throw erroEstado;
    }

    if (!userId) {
      const erroUserId = new Error("Erro de autenticação do usuário.");
      erroUserId.statusCode = 401;
      throw erroUserId;
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
    return await AutopublicacaoModel.deletarLivro(livroId, userId);
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
    arquivos = {},
  }) {
    if (!userId) {
      const error = new Error(
        "Sessão expirada. Autentique-se novamente para publicar.",
      );
      error.statusCode = 401;
      throw error;
    }

    this._validarArquivosObrigatorios(arquivos);

    if (
      estadoInicial !== LIVRO_ESTADO.RASCUNHO &&
      estadoInicial !== LIVRO_ESTADO.EM_REVISAO
    ) {
      const error = new Error(
        "Livros só podem ser criados inicialmente como rascunho.",
      );
      error.statusCode = 400;
      throw error;
    }

    const detalhes = dadosLivro.detalhes || {};
    const orcamento = dadosLivro.orcamento || {};

    const dadosParaInserir = {
      ativo: true,
      fk_user_profile_id: userId,
      estado: estadoInicial,

      ISBN: detalhes.ISBN || null,
      titulo: detalhes.titulo || null,
      subtitulo: detalhes.subtitulo || null,
      descricao: detalhes.descricao || null,

      numero_paginas: orcamento.numeroPaginas
        ? parseInt(orcamento.numeroPaginas, 10)
        : null,

      idioma: detalhes.idioma,
      categoria: detalhes.categoria,
      colaboradores: detalhes.colaboradores || [],

      direitos_de_publicacao:
        detalhes.direitoPublicacao === "sim" ||
        detalhes.direitoPublicacao === true,

      data_de_publicacao: new Date().toISOString().split("T")[0],

      preco_digital: this._converterPreco(
        orcamento.valorLivroDigital,
        "livro digital",
      ),

      preco_fisico: this._converterPreco(
        orcamento.valorLivroFisico,
        "livro físico",
      ),
    };

    const formData = this._criarFormData(dadosParaInserir, arquivos);

    const novoLivro = await AutopublicacaoModel.criarLivro(formData);
    const livroFormatado = this._assinarLivro(novoLivro);

    return {
      data: livroFormatado,
      manuscritoUrl: livroFormatado.manuscritoUrl,
    };
  }

  static async atualizarLivro({
    userId,
    livroId,
    dadosLivro = {},
    arquivos = {},
    removerArquivos = {},
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

    const detalhes = dadosLivro.detalhes || {};
    const orcamento = dadosLivro.orcamento || {};

    const dadosParaAtualizar = {
      ISBN: detalhes.ISBN ?? livroAtual.ISBN,
      titulo: detalhes.titulo ?? livroAtual.titulo,
      subtitulo: detalhes.subtitulo ?? livroAtual.subtitulo,
      descricao: detalhes.descricao ?? livroAtual.descricao,
      idioma: detalhes.idioma ?? livroAtual.idioma,
      categoria: detalhes.categoria ?? livroAtual.categoria,

      colaboradores: detalhes.colaboradores ?? livroAtual.colaboradores,

      direitos_de_publicacao:
        detalhes.direitoPublicacao !== undefined
          ? detalhes.direitoPublicacao === "sim" ||
            detalhes.direitoPublicacao === true
          : livroAtual.direitos_de_publicacao,

      preco_digital:
        orcamento.valorLivroDigital !== undefined &&
        orcamento.valorLivroDigital !== ""
          ? this._converterPreco(orcamento.valorLivroDigital, "livro digital")
          : livroAtual.preco_digital,

      preco_fisico:
        orcamento.valorLivroFisico !== undefined &&
        orcamento.valorLivroFisico !== ""
          ? this._converterPreco(orcamento.valorLivroFisico, "livro físico")
          : livroAtual.preco_fisico,
    };

    if (
      orcamento.numeroPaginas !== undefined &&
      orcamento.numeroPaginas !== ""
    ) {
      const numeroPaginas = Number.parseInt(orcamento.numeroPaginas, 10);

      if (!Number.isInteger(numeroPaginas) || numeroPaginas < 1) {
        const error = new Error("Número de páginas inválido.");
        error.statusCode = 400;
        throw error;
      }

      dadosParaAtualizar.numero_paginas = numeroPaginas;
    }

    const formData = this._criarFormData(dadosParaAtualizar, arquivos);

    for (const campo of ["manuscrito", "capa_frente", "capa_verso"]) {
      const arquivoNovo = this._obterArquivo(arquivos, campo);
      const deveRemover = removerArquivos?.[campo] === true;

      if (deveRemover && !arquivoNovo) {
        const error = new Error(
          `O arquivo ${campo} é obrigatório e precisa ser substituído.`,
        );
        error.statusCode = 400;
        throw error;
      }

      if (arquivoNovo) {
        this._removerArquivo(formData, campo, livroAtual[campo]);
      }
    }

    const atualizado = await AutopublicacaoModel.atualizarLivro(
      livroId,
      userId,
      livroAtual.estado,
      formData,
    );

    const livroFormatado = this._assinarLivro(atualizado);

    return {
      data: livroFormatado,
      manuscritoUrl: livroFormatado.manuscritoUrl,
    };
  }
}
