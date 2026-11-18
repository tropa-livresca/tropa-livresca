import {
  LIVRO_ESTADO,
  TRANSICOES_ADMINISTRADOR,
  transicaoPermitida,
} from "../config/livro-estados.js";
import {
  criarClienteModel,
  getListPocketBase,
  marcarErro,
  obterIdPerfil,
} from "./pocketbase.helpers.js";

const COLECAO_REVISOES = "revisoes";
const COLECAO_LIVROS = "livros";
const RELACAO_LIVRO = "fk_livro_id";
const RELACAO_PERFIL = "fk_user_profile_id";
const EXPAND_LIVRO = `${RELACAO_LIVRO},${RELACAO_LIVRO}.fk_user_profile_id`;

function mapearRevisao(revisao) {
  const { expand, ...dados } = revisao;
  const livro = expand?.[RELACAO_LIVRO] || null;
  return {
    ...dados,
    livros: livro
      ? {
          ...livro,
          users_profile: livro.expand?.fk_user_profile_id || null,
        }
      : null,
  };
}

async function buscarRevisaoOpcional(pb, filtro, parametros = {}) {
  try {
    return await pb
      .collection(COLECAO_REVISOES)
      .getFirstListItem(pb.filter(filtro, parametros), {
        expand: EXPAND_LIVRO,
      });
  } catch (error) {
    if (error.status === 404) return null;
    marcarErro(error);
  }
}

export class RevisaoModel {
  static async BuscarLivroRevisao(busca) {
    const pb = criarClienteModel();
    try {
      const filtros = [];
      const params = {};
      if (busca) {
        filtros.push("titulo ~ {:busca}");
        params.busca = busca;
      }
      const result = await pb.collection(COLECAO_LIVROS).getFullList({
        filter: filtros.length ? pb.filter(filtros.join(" && "), params) : "",
        expand: "fk_user_profile_id",
        fields:
          "id,titulo,subtitulo,capa,estado,fk_user_profile_id,expand.fk_user_profile_id.nome,expand.fk_user_profile_id.sobrenome",
      });
      return result.map((livro) => ({
        ...livro,
        users_profile: livro.expand?.fk_user_profile_id || null,
      }));
    } catch (error) {
      marcarErro(error);
    }
  }

  static async BuscarRevisoes(
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    livro = "",
  ) {
    const pb = criarClienteModel();
    const filtros = [];
    const params = {};
    if (busca) {
      filtros.push("nome ~ {:busca}");
      params.busca = busca;
    }
    if (livro) {
      filtros.push(`${RELACAO_LIVRO} = {:livro}`);
      params.livro = livro;
    }
    const sortField = filtro === "data" ? "data_criacao" : "nome";
    const sort =
      filtro === "data"
        ? ordem === "ascendente"
          ? sortField
          : `-${sortField}`
        : ordem === "descendente"
          ? `-${sortField}`
          : sortField;

    try {
      const result = await getListPocketBase(pb.collection(COLECAO_REVISOES), {
        page,
        limit,
        filter: filtros.length ? pb.filter(filtros.join(" && "), params) : "",
        sort,
        expand: EXPAND_LIVRO,
      });
      const data = result.items.map(mapearRevisao);
      return {
        data,
        livros: data.map((revisao) => revisao.livros).filter(Boolean),
        count: result.totalItems,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async BuscarRevisaoById(id) {
    const pb = criarClienteModel();
    try {
      const revisao = await pb
        .collection(COLECAO_REVISOES)
        .getOne(id, { expand: EXPAND_LIVRO });
      const dados = mapearRevisao(revisao);
      return { data: dados, livro: dados.livros };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async BuscarRevisaoByUserId(userId) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, userId);
    try {
      const data = await pb.collection(COLECAO_REVISOES).getFullList({
        filter: pb.filter(`${RELACAO_PERFIL} = {:perfilId}`, { perfilId }),
        expand: EXPAND_LIVRO,
      });
      return { data: data.map(mapearRevisao) };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async BuscarRevisaoByLivroId(livroId) {
    const pb = criarClienteModel();
    try {
      const data = await pb.collection(COLECAO_REVISOES).getFullList({
        filter: pb.filter(`${RELACAO_LIVRO} = {:livroId}`, { livroId }),
        expand: EXPAND_LIVRO,
      });
      return { data: data.map(mapearRevisao) };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async AtualizarRevisao(id, funcionarioId, dadosAtualizados) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, funcionarioId);
    const revisao = await buscarRevisaoOpcional(
      pb,
      `id = {:id} && ${RELACAO_PERFIL} = {:perfilId} && completado = false`,
      { id, perfilId },
    );
    if (!revisao) {
      const error = new Error(
        "Revisão não encontrada ou não pertence ao administrador.",
      );
      error.statusCode = 403;
      throw error;
    }

    try {
      const atualizada = await pb
        .collection(COLECAO_REVISOES)
        .update(id, dadosAtualizados);
      return mapearRevisao(atualizada);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async VerificarRevisor(livroId, funcionarioId) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, funcionarioId);
    const revisao = await buscarRevisaoOpcional(
      pb,
      `completado = false && ${RELACAO_LIVRO} = {:livroId}`,
      { livroId },
    );
    if (!revisao) return null;
    return {
      ...mapearRevisao(revisao),
      revisor: revisao[RELACAO_PERFIL] === perfilId,
    };
  }

  static async atualizarEstadoComRevisao(livroId, novoEstado, funcionarioId) {
    if (
      !transicaoPermitida(
        LIVRO_ESTADO.EM_REVISAO,
        novoEstado,
        TRANSICOES_ADMINISTRADOR,
      )
    ) {
      const error = new Error("Transição administrativa de estado inválida.");
      error.statusCode = 400;
      throw error;
    }

    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, funcionarioId);
    const revisao = await buscarRevisaoOpcional(
      pb,
      `${RELACAO_LIVRO} = {:livroId} && ${RELACAO_PERFIL} = {:perfilId} && completado = false`,
      { livroId, perfilId },
    );
    if (!revisao) {
      const error = new Error(
        "Administrador não possui revisão pendente vinculada a este livro.",
      );
      error.statusCode = 403;
      throw error;
    }

    let livro;
    try {
      livro = await pb.collection(COLECAO_LIVROS).getOne(livroId);
    } catch (error) {
      marcarErro(error);
    }
    if (!livro.ativo || livro.estado !== LIVRO_ESTADO.EM_REVISAO) {
      const error = new Error(
        "O livro não está em revisão ou seu estado foi alterado.",
      );
      error.statusCode = 409;
      throw error;
    }

    let livroAtualizado;
    try {
      livroAtualizado = await pb
        .collection(COLECAO_LIVROS)
        .update(livroId, { estado: novoEstado });
      const revisaoConcluida = await pb
        .collection(COLECAO_REVISOES)
        .update(revisao.id, { completado: true });
      return { ...livroAtualizado, revisao: revisaoConcluida };
    } catch (error) {
      if (livroAtualizado) {
        await pb.collection(COLECAO_LIVROS).update(livroId, {
          estado: LIVRO_ESTADO.EM_REVISAO,
        });
      }
      marcarErro(error, 409);
    }
  }

  static async buscarLivroParaRevisao(livroId) {
    const pb = criarClienteModel();
    try {
      const livro = await pb.collection(COLECAO_LIVROS).getOne(livroId, {
        fields: "id,estado,ativo",
      });
      return { id: livro.id, estado: livro.estado, ativo: livro.ativo };
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }

  static async buscarRevisaoPendentePorLivro(livroId) {
    const pb = criarClienteModel();
    return buscarRevisaoOpcional(
      pb,
      `${RELACAO_LIVRO} = {:livroId} && completado = false`,
      { livroId },
    );
  }

  static async buscarRevisaoParaAtualizacao(id, funcionarioId) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, funcionarioId);
    return buscarRevisaoOpcional(
      pb,
      `id = {:id} && ${RELACAO_PERFIL} = {:perfilId}`,
      { id, perfilId },
    );
  }

  static async CriarRevisao(dadosRevisao) {
    const pb = criarClienteModel();
    const dados = { ...dadosRevisao };
    if (dados[RELACAO_PERFIL]) {
      dados[RELACAO_PERFIL] = await obterIdPerfil(pb, dados[RELACAO_PERFIL]);
    }
    try {
      const revisao = await pb.collection(COLECAO_REVISOES).create(dados);
      return mapearRevisao(revisao);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async CompletarRevisao(id, funcionarioId) {
    const pb = criarClienteModel();
    const revisao = await this.buscarRevisaoParaAtualizacao(id, funcionarioId);
    if (!revisao) {
      const error = new Error(
        "Revisão não encontrada ou não pertence ao administrador.",
      );
      error.statusCode = 403;
      throw error;
    }
    if (revisao.completado) return revisao;

    const livro = await this.buscarLivroParaRevisao(revisao[RELACAO_LIVRO]);
    if (
      ![
        LIVRO_ESTADO.PUBLICADO,
        LIVRO_ESTADO.NEGADO,
        LIVRO_ESTADO.RECALL,
      ].includes(livro?.estado)
    ) {
      const error = new Error(
        "A revisão só pode ser concluída após uma decisão administrativa.",
      );
      error.statusCode = 409;
      throw error;
    }

    try {
      return await pb.collection(COLECAO_REVISOES).update(id, {
        completado: true,
      });
    } catch (error) {
      marcarErro(error);
    }
  }

  static async publicarLivro(idLivro, funcionarioId) {
    return this.atualizarEstadoComRevisao(
      idLivro,
      LIVRO_ESTADO.PUBLICADO,
      funcionarioId,
    );
  }

  static async SolicitarRecallLivro(idLivro, funcionarioId) {
    return this.atualizarEstadoComRevisao(
      idLivro,
      LIVRO_ESTADO.RECALL,
      funcionarioId,
    );
  }

  static async negarPublicacaoLivro(idLivro, funcionarioId) {
    return this.atualizarEstadoComRevisao(
      idLivro,
      LIVRO_ESTADO.NEGADO,
      funcionarioId,
    );
  }
}
