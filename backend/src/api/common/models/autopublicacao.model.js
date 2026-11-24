import { LIVRO_ESTADO } from "../config/livro-estados.js";
import {
  criarClienteModel,
  getListPocketBase,
  marcarErro,
} from "./pocketbase.helpers.js";

const COLECAO = "livros";
const RELACAO_PERFIL = "fk_user_profile_id";

function erroConflito() {
  const error = new Error("Livro não encontrado ou estado desatualizado.");

  error.statusCode = 409;
  return error;
}

export class AutopublicacaoModel {
  static async buscarComFiltros({
    userId,
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    estado = "",
  } = {}) {
    const pb = await criarClienteModel();

    const filtros = ["ativo = true", `${RELACAO_PERFIL} = {:userId}`];

    const params = { userId };

    if (busca) {
      filtros.push("titulo ~ {:busca}");
      params.busca = busca;
    }

    if (Object.values(LIVRO_ESTADO).includes(estado)) {
      filtros.push("estado = {:estado}");
      params.estado = estado;
    }

    const campoOrdenacao = filtro === "data" ? "data_de_publicacao" : "titulo";

    const ascending =
      filtro === "data" ? ordem === "ascendente" : ordem !== "descendente";

    try {
      const resultado = await getListPocketBase(pb.collection(COLECAO), {
        page,
        limit,
        filter: pb.filter(filtros.join(" && "), params),
        sort: ascending ? campoOrdenacao : `-${campoOrdenacao}`,
      });

      return {
        data: resultado.items,
        count: resultado.totalItems,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarDetalhesPorId(idLivro, userId) {
    const pb = await criarClienteModel();

    try {
      const livro = await pb.collection(COLECAO).getOne(idLivro);

      return livro[RELACAO_PERFIL] === userId && livro.ativo ? livro : null;
    } catch (error) {
      if (error.status === 404) return null;

      marcarErro(error);
    }
  }

  static async atualizarEstado(id, novoEstado, userId, estadoAtual) {
    const pb = await criarClienteModel();

    const livro = await this.buscarDetalhesPorId(id, userId);

    if (!livro || (estadoAtual && livro.estado !== estadoAtual)) {
      throw erroConflito();
    }

    try {
      return await pb.collection(COLECAO).update(id, {
        estado: novoEstado,
      });
    } catch (error) {
      marcarErro(error);
    }
  }

  static async criarLivro(dadosLivro) {
    const pb = await criarClienteModel();

    if (!(dadosLivro instanceof FormData)) {
      const error = new Error(
        "Os dados do livro devem ser enviados no formato FormData.",
      );

      error.statusCode = 400;
      throw error;
    }

    try {
      return await pb.collection(COLECAO).create(dadosLivro);
    } catch (error) {
      console.error("\n========== ERRO POCKETBASE ==========");

      console.error("Status:", error.status);
      console.error("Mensagem:", error.response?.message);

      console.error(
        "Detalhes dos campos:",
        JSON.stringify(error.response?.data, null, 2),
      );

      console.error("====================================\n");

      marcarErro(error);
    }
  }

  static async atualizarLivro(id, userId, estadoAtual, dadosAtualizados) {
    const pb = await criarClienteModel();

    const livro = await this.buscarDetalhesPorId(id, userId);

    if (!livro || livro.estado !== estadoAtual) {
      throw erroConflito();
    }

    try {
      return await pb.collection(COLECAO).update(id, dadosAtualizados);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async deletarLivro(idLivro, userId) {
    const pb = await criarClienteModel();

    const livro = await this.buscarDetalhesPorId(idLivro, userId);

    if (!livro) {
      const error = new Error("Livro não encontrado.");

      error.statusCode = 404;
      throw error;
    }

    if (livro.estado !== LIVRO_ESTADO.RASCUNHO) {
      const error = new Error(
        "Livros em rascunho podem ser deletados. Livros em revisão ou publicados não podem ser deletados.",
      );

      error.statusCode = 400;
      throw error;
    }

    try {
      await pb.collection(COLECAO).delete(idLivro);

      return livro;
    } catch (error) {
      marcarErro(error);
    }
  }
}
