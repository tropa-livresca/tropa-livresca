import { RevisaoModel } from "../../common/models/revisao.model.js";
import { LIVRO_ESTADO } from "../../common/config/livro-estados.js";
import { validarMetadadosUpload } from "../../common/config/storage.js";

export class RevisaoService {
  static _formatarRevisao(revisao) {
    return revisao;
  }

  static _formatarRevisoes(revisoes) {
    return revisoes || [];
  }

  static _validarArquivo(arquivo) {
    if (!arquivo?.buffer || !arquivo.originalname) {
      const error = new Error("O arquivo da revisão é obrigatório.");
      error.statusCode = 400;
      throw error;
    }

    const extensao = arquivo.originalname?.split(".").pop();
    const tamanho = arquivo.size ?? arquivo.buffer?.length;

    validarMetadadosUpload({
      tipo: "manuscrito",
      extensao,
      mimeType: arquivo.mimetype,
      tamanho,
    });

    return arquivo;
  }

  static _criarFormData(dados, arquivo = null, removerArquivo = false) {
    const formData = new FormData();

    for (const [campo, valor] of Object.entries(dados)) {
      if (valor !== undefined && valor !== null) {
        formData.append(campo, String(valor));
      }
    }

    if (arquivo) {
      const blob = new Blob([arquivo.buffer], { type: arquivo.mimetype });
      formData.append("arquivo", blob, arquivo.originalname);
    }

    if (removerArquivo === true) {
      formData.append("arquivo-", "");
    } else {
      for (const nomeArquivo of Array.isArray(removerArquivo)
        ? removerArquivo
        : [removerArquivo]
      ) {
        if (typeof nomeArquivo === "string" && nomeArquivo) {
          formData.append("arquivo-", nomeArquivo);
        }
      }
    }

    return formData;
  }

  static async BuscarLivroRevisao(busca) {
    const livros = await RevisaoModel.BuscarLivroRevisao(busca);

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

    const dadosComCapas = this._formatarRevisoes(revisoes.data);

    return {
      data: dadosComCapas,
      livros: revisoes.livros ?? [],
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
      data: this._formatarRevisao(revisao.data),
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
      data: this._formatarRevisoes(revisao.data),
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
      data: this._formatarRevisoes(revisao.data),
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
    removerArquivo = false,
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

    const arquivo = manuscritoRevisto
      ? this._validarArquivo(manuscritoRevisto)
      : null;

    const dadosRevisao = {};
    if (nome !== undefined) dadosRevisao.nome = nome;
    if (apontamento !== undefined) dadosRevisao.apontamento = apontamento;
    if (idLivro !== undefined) dadosRevisao.fk_livro_id = idLivro;
    const formData = this._criarFormData(
      dadosRevisao,
      arquivo,
      arquivo || removerArquivo
        ? (revisaoAtual.arquivo || removerArquivo)
        : false,
    );

    const revisaoAtualizada = await RevisaoModel.AtualizarRevisao(
      id,
      funcionarioId,
      formData,
    );

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

    const arquivo = this._validarArquivo(manuscritoRevisto);
    const dadosRevisao = this._criarFormData(
      {
        nome,
        apontamento,
        fk_livro_id: idLivro,
        fk_user_profile_id: userId,
      },
      arquivo,
    );
    const revisaoCriada = await RevisaoModel.CriarRevisao(dadosRevisao);

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
