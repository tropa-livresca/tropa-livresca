import { criarClienteAdminPocketBase } from "../config/pocketbase.js";

export const criarClienteModel = () => criarClienteAdminPocketBase();

export function marcarErro(error, statusCode = 500) {
  error.statusCode = error.statusCode || error.status || statusCode;
  throw error;
}

export async function buscarRegistroOpcional(colecao, id, options = {}) {
  try {
    return await colecao.getOne(id, options);
  } catch (error) {
    if (error.status === 404) return null;
    marcarErro(error);
  }
}

export async function obterIdPerfil(pb, usuarioId) {
  try {
    const perfil = await pb
      .collection("users_profile")
      .getFirstListItem(pb.filter("auth_user = {:usuarioId}", { usuarioId }));

    return perfil.id;
  } catch (error) {
    if (error.status !== 404) marcarErro(error);
  }

  const perfilExistente = await buscarRegistroOpcional(
    pb.collection("users_profile"),
    usuarioId,
  );

  return perfilExistente?.id || usuarioId;
}

export function paginaPocketBase({ page = 1, limit = 12 }) {
  return {
    page: Math.max(1, Number(page) || 1),
    perPage: Math.max(1, Number(limit) || 12),
  };
}

export function getListPocketBase(
  colecao,
  { page = 1, limit = 12, ...options },
) {
  const pagina = paginaPocketBase({ page, limit });

  return colecao.getList(pagina.page, pagina.perPage, options);
}

export function mapearExpansao(record, relacao, campo) {
  const { expand, ...dados } = record;

  return {
    ...dados,
    [campo]: expand?.[relacao] || null,
  };
}
