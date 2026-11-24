import { LIVRO_ESTADO } from "../config/livro-estados.js";
import {
  criarClienteModel,
  getListPocketBase,
  marcarErro,
  mapearCampoArquivo,
  primeiraUrlArquivo,
} from "./pocketbase.helpers.js";

const COLECAO = "livros";
const RELACAO_PERFIL = "fk_user_profile_id";

const COLUNAS_LIVRO = [
  "id",
  "collectionId",
  "collectionName",
  "ISBN",
  "data_de_publicacao",
  "categoria",
  "idioma",
  "titulo",
  "subtitulo",
  "descricao",
  "manuscrito",
  "capa_frente",
  "capa_verso",
  "direitos_de_publicacao",
  "preco_digital",
  "preco_fisico",
  "numero_paginas",
  "colaboradores",
  "ativo",
  "estado",
  RELACAO_PERFIL,
].join(",");

function formatarLivro(pb, livro) {
  if (!livro) return livro;

  const perfilExpandido = livro.expand?.[RELACAO_PERFIL] || null;

  const imagem = perfilExpandido
    ? mapearCampoArquivo(pb, perfilExpandido, "imagem")
    : null;

  const perfil = perfilExpandido
    ? {
        ...perfilExpandido,
        ...imagem,
        imagem: primeiraUrlArquivo(imagem.imagemUrl),
      }
    : null;

  const arquivos = {
    ...mapearCampoArquivo(pb, livro, "manuscrito"),
    ...mapearCampoArquivo(pb, livro, "capa_frente"),
    ...mapearCampoArquivo(pb, livro, "capa_verso"),
  };

  return {
    ...livro,
    ...arquivos,
    users_profile: perfil,
    capa: {
      frente: primeiraUrlArquivo(arquivos.capa_frenteUrl),
      verso: primeiraUrlArquivo(arquivos.capa_versoUrl),
    },
  };
}

function resultadoPaginado(pb, result) {
  return {
    data: result.items.map((livro) => formatarLivro(pb, livro)),
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
    const pb = await criarClienteModel();
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

      return resultadoPaginado(pb, result);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarLivroByIdAdmin(livroId) {
    if (!livroId) return null;

    const pb = await criarClienteModel();

    try {
      const livro = await pb.collection(COLECAO).getOne(livroId, {
        expand: RELACAO_PERFIL,
      });

      return formatarLivro(pb, livro);
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }

  static async alterarAtivoLivro(livroId, ativo) {
    const pb = await criarClienteModel();

    try {
      const livro = await pb.collection(COLECAO).update(livroId, {
        ativo,
      });

      return {
        id: livro.id,
        titulo: livro.titulo,
        ativo: livro.ativo,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarLivroByUserId(userId) {
    if (!userId) return null;

    const pb = await criarClienteModel();

    try {
      const result = await pb.collection(COLECAO).getFullList({
        filter: pb.filter(`${RELACAO_PERFIL} = {:userId}`, {
          userId,
        }),
        expand: RELACAO_PERFIL,
      });

      return result.map((livro) => formatarLivro(pb, livro));
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
    const pb = await criarClienteModel();

    const filtros = ["ativo = true", "estado = {:estado}"];
    const params = {
      estado: LIVRO_ESTADO.PUBLICADO,
    };

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
        fields: [
          COLUNAS_LIVRO,
          `expand.${RELACAO_PERFIL}.id`,
          `expand.${RELACAO_PERFIL}.collectionId`,
          `expand.${RELACAO_PERFIL}.collectionName`,
          `expand.${RELACAO_PERFIL}.nome`,
          `expand.${RELACAO_PERFIL}.sobrenome`,
          `expand.${RELACAO_PERFIL}.imagem`,
        ].join(","),
      });

      return resultadoPaginado(pb, result);
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarDetalhesPorId(id) {
    if (!id) return null;

    const pb = await criarClienteModel();

    try {
      const livro = await pb.collection(COLECAO).getOne(id, {
        expand: RELACAO_PERFIL,
      });

      if (!livro.ativo) return null;

      return formatarLivro(pb, livro);
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
  }
}
