import { LIVRO_ESTADO } from "../config/livro-estados.js";
import {
  criarClienteModel,
  getListPocketBase,
  marcarErro,
  obterIdPerfil,
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
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, userId);
    const filtros = ["ativo = true", `${RELACAO_PERFIL} = {:perfilId}`];
    const params = { perfilId };

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
      return { data: resultado.items, count: resultado.totalItems };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarDetalhesPorId(idLivro, userId) {
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, userId);

    try {
      const livro = await pb.collection(COLECAO).getOne(idLivro);
      return livro[RELACAO_PERFIL] === perfilId && livro.ativo ? livro : null;
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }

  static async atualizarEstado(id, novoEstado, userId, estadoAtual) {
    const pb = criarClienteModel();
    const livro = await this.buscarDetalhesPorId(id, userId);
    if (!livro || (estadoAtual && livro.estado !== estadoAtual)) {
      throw erroConflito();
    }

    try {
      return await pb.collection(COLECAO).update(id, { estado: novoEstado });
    } catch (error) {
      marcarErro(error);
    }
  }

  static async criarLivro(dadosLivro) {
    const pb = criarClienteModel();
    const dados = { ...dadosLivro };
    if (dados[RELACAO_PERFIL]) {
      dados[RELACAO_PERFIL] = await obterIdPerfil(pb, dados[RELACAO_PERFIL]);
    }

    try {
      return await pb.collection(COLECAO).create(dados);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async atualizarLivro(id, userId, estadoAtual, dadosAtualizados) {
    const pb = criarClienteModel();
    const livro = await this.buscarDetalhesPorId(id, userId);
    if (!livro || livro.estado !== estadoAtual) throw erroConflito();

    try {
      return await pb.collection(COLECAO).update(id, dadosAtualizados);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async deletarLivro(idLivro, userId) {
    const pb = criarClienteModel();
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
