import { supabaseAdmin } from "../../common/config/supabase.js";
import { RevisaoModel } from "../../common/models/revisao.model.js";
import { LIVRO_ESTADO } from "../../common/config/livro-estados.js";
import {
  STORAGE_BUCKET,
  criarUrlAssinada,
  normalizarCaminhoPersistido,
  removerArquivos,
  validarArquivoArmazenado,
  validarMetadadosUpload,
} from "../../common/config/storage.js";

export class RevisaoService {
  static _parseCapaUrls(livro) {
    if (!livro) return livro;

    const livroClonado = { ...livro };

    try {
      if (typeof livroClonado.capa === "string") {
        livroClonado.capa = JSON.parse(livroClonado.capa);
      }
    } catch (e) {
      console.warn("Erro ao parsear capa JSON", e);
    }
    return livroClonado;
  }

  static _parseCapasArray(livros) {
    return livros.map((livro) => this._parseCapaUrls(livro));
  }

  static async _formatarRevisao(revisao) {
    if (!revisao) return revisao;

    const arquivoPath = normalizarCaminhoPersistido(
      revisao.arquivo,
      STORAGE_BUCKET.MANUSCRITOS,
    );

    return {
      ...revisao,
      arquivo: arquivoPath
        ? await criarUrlAssinada(STORAGE_BUCKET.MANUSCRITOS, arquivoPath)
        : null,
      arquivoPath,
    };
  }

  static async _formatarRevisoes(revisoes) {
    return Promise.all(
      (revisoes || []).map((revisao) => this._formatarRevisao(revisao)),
    );
  }

  static _novoPathRevisao(userId) {
    return `${userId}/revisoes/${globalThis.crypto.randomUUID()}.pdf`;
  }

  static async _uploadRevisao(arquivo, userId) {
    const extensao = arquivo.originalname?.split(".").pop();
    const tamanho = arquivo.size ?? arquivo.buffer?.length;

    validarMetadadosUpload({
      tipo: "manuscrito",
      extensao,
      mimeType: arquivo.mimetype,
      tamanho,
    });

    const path = this._novoPathRevisao(userId);
    const { error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET.MANUSCRITOS)
      .upload(path, arquivo.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: arquivo.mimetype,
      });

    if (uploadError) {
      uploadError.statusCode = 500;
      throw uploadError;
    }

    try {
      await validarArquivoArmazenado(
        STORAGE_BUCKET.MANUSCRITOS,
        path,
        "manuscrito",
      );
    } catch (error) {
      await this._removerRevisaoUpload(path);
      throw error;
    }

    return path;
  }

  static async _removerRevisaoUpload(path) {
    if (!path) return;

    try {
      await removerArquivos(STORAGE_BUCKET.MANUSCRITOS, [path]);
    } catch (error) {
      console.error("Não foi possível remover manuscrito de revisão:", error);
    }
  }

  static async BuscarLivroRevisao(busca) {
    const livros = await RevisaoModel.BuscarLivraoRevisao(busca);

    if (livros.error) throw livros.error;

    return livros;
  }

  static async BuscarRevisoes({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    livro = "",
  }) {
    const revisoes = await RevisaoModel.BuscarRevisoes(
      page,
      limit,
      busca,
      filtro,
      ordem,
      livro,
    );

    if (revisoes.error) throw revisoes.error;

    const dadosFormatados = await this._formatarRevisoes(revisoes.data);

    const dadosComCapas = dadosFormatados.map((revisao) => ({
      ...revisao,
      livros: this._parseCapaUrls(revisao.livros),
    }));

    return {
      data: dadosComCapas,
      livros: this._parseCapasArray(revisoes.livros ?? []),
      meta: {
        page,
        limit,
        totalItems: revisoes.count,
        totalPages: Math.ceil(revisoes.count / limit),
      },
    };
  }

  static async BuscarRevisaoById(id) {
    if (!id) {
      const erroId = new Error("Id não especificado.");
      erroId.statusCode = 400;
      throw erroId;
    }

    const revisao = await RevisaoModel.BuscarRevisaoById(id);

    if (revisao.error) throw revisao.error;

    return {
      ...revisao,
      data: await this._formatarRevisao(revisao.data),
    };
  }

  static async BuscarRevisaoByUserId(userId) {
    if (!userId) {
      const erroId = new Error("Id não especificado.");
      erroId.statusCode = 400;
      throw erroId;
    }

    const revisao = await RevisaoModel.BuscarRevisaoByUserId(userId);

    if (revisao.error) throw revisao.error;

    return {
      ...revisao,
      data: await this._formatarRevisoes(revisao.data),
    };
  }

  static async BuscarRevisaoBylivroId(livroId) {
    if (!livroId) {
      const erroId = new Error("Id não especificado.");
      erroId.statusCode = 400;
      throw erroId;
    }

    const revisao = await RevisaoModel.BuscarRevisaoByLivroId(livroId);

    if (revisao.error) throw revisao.error;

    return {
      ...revisao,
      data: await this._formatarRevisoes(revisao.data),
    };
  }

  static async VerificarRevisor(livroId, funcionarioId) {
    if (!livroId || !funcionarioId) {
      const erroId = new Error("livroId ou funcionarioId não especificado.");
      erroId.statusCode = 400;
      throw erroId;
    }

    const revisao = await RevisaoModel.VerificarRevisor(livroId, funcionarioId);

    if (revisao?.error) throw revisao.error;

    return this._formatarRevisao(revisao);
  }

  static async AtualizarRevisao(
    id,
    nome,
    apontamento,
    idLivro,
    manuscritoRevisto = null,
    funcionarioId,
  ) {
    if (!id) {
      const erroId = new Error("Id da revisão é obrigatório.");
      erroId.statusCode = 400;
      throw erroId;
    }

    if (!funcionarioId) {
      const erroUsuario = new Error("Administrador não autenticado.");
      erroUsuario.statusCode = 401;
      throw erroUsuario;
    }

    const revisaoAtual = await RevisaoModel.buscarRevisaoParaAtualizacao(
      id,
      funcionarioId,
    );

    if (!revisaoAtual) {
      const erroRevisao = new Error(
        "Revisão não encontrada ou não pertence ao administrador.",
      );
      erroRevisao.statusCode = 403;
      throw erroRevisao;
    }

    if (revisaoAtual.completado) {
      const erroRevisao = new Error(
        "Revisões concluídas não podem ser alteradas.",
      );
      erroRevisao.statusCode = 409;
      throw erroRevisao;
    }

    if (
      idLivro !== undefined &&
      String(idLivro) !== String(revisaoAtual.fk_livro_id)
    ) {
      const erroLivro = new Error(
        "A revisão não pode ser vinculada a outro livro.",
      );
      erroLivro.statusCode = 409;
      throw erroLivro;
    }

    let manuscritoPath;
    if (manuscritoRevisto) {
      manuscritoPath = await this._uploadRevisao(
        manuscritoRevisto,
        funcionarioId,
      );
    }

    const dadosRevisao = {};
    if (nome !== undefined) dadosRevisao.nome = nome;
    if (apontamento !== undefined) dadosRevisao.apontamento = apontamento;
    if (idLivro !== undefined) dadosRevisao.fk_livro_id = idLivro;
    if (manuscritoPath !== undefined) dadosRevisao.arquivo = manuscritoPath;

    let revisaoAtualizada;
    try {
      revisaoAtualizada = await RevisaoModel.AtualizarRevisao(
        id,
        funcionarioId,
        dadosRevisao,
      );
    } catch (error) {
      await this._removerRevisaoUpload(manuscritoPath);
      throw error;
    }

    const arquivoAnterior = normalizarCaminhoPersistido(
      revisaoAtual.arquivo,
      STORAGE_BUCKET.MANUSCRITOS,
    );
    if (
      manuscritoPath &&
      arquivoAnterior &&
      manuscritoPath !== arquivoAnterior
    ) {
      await this._removerRevisaoUpload(arquivoAnterior);
    }

    return this._formatarRevisao(revisaoAtualizada);
  }

  static async CriarRevisao(
    nome,
    apontamento,
    idLivro,
    manuscritoRevisto = null,
    userId,
  ) {
    if (!nome || !apontamento || !idLivro || !userId || !manuscritoRevisto) {
      const erroDados = new Error(
        "Dados de criação de revisão não informados.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    const livro = await RevisaoModel.buscarLivroParaRevisao(idLivro);
    if (!livro) {
      const erroLivro = new Error("Livro não encontrado.");
      erroLivro.statusCode = 404;
      throw erroLivro;
    }

    if (livro.ativo !== true || livro.estado !== LIVRO_ESTADO.EM_REVISAO) {
      const erroEstado = new Error(
        "Só é possível criar revisão para livro em revisão ativo.",
      );
      erroEstado.statusCode = 409;
      throw erroEstado;
    }

    const revisaoPendente =
      await RevisaoModel.buscarRevisaoPendentePorLivro(idLivro);
    if (revisaoPendente) {
      const erroRevisao = new Error("O livro já possui uma revisão pendente.");
      erroRevisao.statusCode = 409;
      throw erroRevisao;
    }

    let manuscritoPath = null;
    if (manuscritoRevisto) {
      manuscritoPath = await this._uploadRevisao(manuscritoRevisto, userId);
    }

    const dadosRevisao = {
      nome,
      apontamento,
      fk_livro_id: idLivro,
      arquivo: manuscritoPath,
      fk_user_profile_id: userId,
    };

    let revisaoCriada;
    try {
      revisaoCriada = await RevisaoModel.CriarRevisao(dadosRevisao);
    } catch (error) {
      await this._removerRevisaoUpload(manuscritoPath);
      throw error;
    }

    return this._formatarRevisao(revisaoCriada);
  }

  static async CompletarRevisao(id, funcionarioId) {
    if (!id) {
      const erroId = new Error("Id da revisão não informado.");
      erroId.statusCode = 404;
      throw erroId;
    }

    if (!funcionarioId) {
      const erroUsuario = new Error("Administrador não autenticado.");
      erroUsuario.statusCode = 401;
      throw erroUsuario;
    }

    return RevisaoModel.CompletarRevisao(id, funcionarioId);
  }

  static async publicarLivro(livroId, funcionarioId) {
    if (!livroId || !funcionarioId) {
      const erroDados = new Error(
        "Erro ao informar os dados para alterar estado de livro.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    return RevisaoModel.publicarLivro(livroId, funcionarioId);
  }

  static async negarPublicacaoLivro(idLivro, funcionarioId) {
    if (!idLivro || !funcionarioId) {
      const erroDados = new Error(
        "Erro ao informar os dados para alterar estado de livro.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    return RevisaoModel.negarPublicacaoLivro(idLivro, funcionarioId);
  }

  static async SolicitarRecallLivro(idLivro, funcionarioId) {
    if (!idLivro || !funcionarioId) {
      const erroDados = new Error(
        "Erro ao informar os dados para alterar estado de livro.",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    return RevisaoModel.SolicitarRecallLivro(idLivro, funcionarioId);
  }
}
