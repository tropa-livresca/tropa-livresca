import { LIVRO_ESTADO } from "../config/livro-estados.js";
import {
  criarClienteModel,
  getListPocketBase,
  marcarErro,
  mapearExpansao,
  obterIdPerfil,
} from "./pocketbase.helpers.js";

const COLECAO = "livros";
const RELACAO_PERFIL = "fk_user_profile_id";
const COLUNAS_LIVRO =
  "id, ISBN, data_de_publicacao, categoria, idioma, titulo, subtitulo, descricao, capa, direitos_de_publicacao";

function resultadoPaginado(result) {
  return {
    data: result.items.map((livro) =>
      mapearExpansao(livro, RELACAO_PERFIL, "users_profile"),
    ),
    count: result.totalItems,
  };
}

export class LivroModel {
  static async buscarLivrosAdmin({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
    estado = "",
  }) {
    const pb = criarClienteModel();
    const filtros = [`estado != {:rascunho}`];
    const params = { rascunho: LIVRO_ESTADO.RASCUNHO };

    if (busca) {
      filtros.push("(titulo ~ {:busca} || subtitulo ~ {:busca})");
      params.busca = busca;
    }
    if (
      estado === LIVRO_ESTADO.PUBLICADO ||
      estado === LIVRO_ESTADO.EM_REVISAO
    ) {
      filtros.push("estado = {:estado}");
      params.estado = estado;
    }

    const sortField = filtro === "data" ? "data_de_publicacao" : "titulo";
    const sort = ordem === "descendente" ? `-${sortField}` : sortField;

    try {
      const result = await getListPocketBase(pb.collection(COLECAO), {
        page,
        limit,
        filter: pb.filter(filtros.join(" && "), params),
        sort,
        expand: RELACAO_PERFIL,
      });
      return resultadoPaginado(result);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarLivroByIdAdmin(livroId) {
    if (!livroId) return null;
    const pb = criarClienteModel();

    try {
      const livro = await pb.collection(COLECAO).getOne(livroId, {
        expand: RELACAO_PERFIL,
      });
      return mapearExpansao(livro, RELACAO_PERFIL, "users_profile");
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }

  static async alterarAtivoLivro(livroId, ativo) {
    const pb = criarClienteModel();

    try {
      const livro = await pb.collection(COLECAO).update(livroId, { ativo });
      return { id: livro.id, titulo: livro.titulo, ativo: livro.ativo };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarLivroByUserId(userId) {
    if (!userId) return null;
    const pb = criarClienteModel();
    const perfilId = await obterIdPerfil(pb, userId);

    try {
      const result = await pb.collection(COLECAO).getFullList({
        filter: pb.filter(`${RELACAO_PERFIL} = {:perfilId}`, { perfilId }),
        expand: RELACAO_PERFIL,
      });
      return result.map((livro) =>
        mapearExpansao(livro, RELACAO_PERFIL, "users_profile"),
      );
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarComFiltros({
    page = 1,
    limit = 12,
    busca = "",
    filtro = "",
    ordem = "",
  }) {
    const pb = criarClienteModel();
    const filtros = ["ativo = true", "estado = {:estado}"];
    const params = { estado: LIVRO_ESTADO.PUBLICADO };

    if (busca) {
      filtros.push("(titulo ~ {:busca} || subtitulo ~ {:busca})");
      params.busca = busca;
    }

    const sortField = filtro === "data" ? "data_de_publicacao" : "titulo";
    const sort =
      filtro === "data"
        ? ordem === "ascendente"
          ? sortField
          : `-${sortField}`
        : ordem === "descendente"
          ? `-${sortField}`
          : sortField;

    try {
      const result = await getListPocketBase(pb.collection(COLECAO), {
        page,
        limit,
        filter: pb.filter(filtros.join(" && "), params),
        sort,
        expand: RELACAO_PERFIL,
        fields: `${COLUNAS_LIVRO},${RELACAO_PERFIL},expand.${RELACAO_PERFIL}.id,expand.${RELACAO_PERFIL}.nome,expand.${RELACAO_PERFIL}.sobrenome`,
      });
      return resultadoPaginado(result);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarDetalhesPorId(id) {
    if (!id) return null;
    const pb = criarClienteModel();

    try {
      const livro = await pb.collection(COLECAO).getOne(id, {
        expand: RELACAO_PERFIL,
      });
      if (!livro.ativo) return null;
      return mapearExpansao(livro, RELACAO_PERFIL, "users_profile");
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }
}
