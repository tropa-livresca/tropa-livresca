import { criarClienteAdminPocketBase } from "../config/pocketbase.js";

export const criarClienteModel = async () =>
  await criarClienteAdminPocketBase();

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

export function mapearCampoArquivo(pb, record, campo) {
  const valor = record?.[campo];

  const nomes = (Array.isArray(valor) ? valor : [valor]).filter(
    (nome) => typeof nome === "string" && nome.length > 0,
  );

  const urls = nomes.map((nome) => pb.files.getURL(record, nome));
  const multiplo = Array.isArray(valor);

  return {
    [`${campo}Nome`]: multiplo ? nomes : (nomes[0] ?? null),
    [`${campo}Url`]: multiplo ? urls : (urls[0] ?? null),
  };
}

export function primeiraUrlArquivo(urls) {
  if (Array.isArray(urls)) return urls[0] ?? null;
  return urls ?? null;
}
