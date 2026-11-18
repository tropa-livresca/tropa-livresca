import { criarClienteAdminPocketBase } from "./pocketbase.js";

const COLECAO_ARQUIVOS = "storage_files";

export const STORAGE_BUCKET = Object.freeze({
  CAPAS: "capa-livros",
  MANUSCRITOS: "manuscrito-livro",
  PERFIS: "imagens-perfil",
});

export const STORAGE_SIGNED_URL_TTL = 300;

export const STORAGE_FILE_RULES = Object.freeze({
  capa_frente: Object.freeze({
    bucket: STORAGE_BUCKET.CAPAS,
    extensions: Object.freeze(["jpg", "jpeg", "png"]),
    mimeTypes: Object.freeze(["image/jpeg", "image/png"]),
    maxBytes: 10 * 1024 * 1024,
    signature: "image",
  }),
  capa_verso: Object.freeze({
    bucket: STORAGE_BUCKET.CAPAS,
    extensions: Object.freeze(["jpg", "jpeg", "png"]),
    mimeTypes: Object.freeze(["image/jpeg", "image/png"]),
    maxBytes: 10 * 1024 * 1024,
    signature: "image",
  }),
  imagem_perfil: Object.freeze({
    bucket: STORAGE_BUCKET.PERFIS,
    extensions: Object.freeze(["jpg", "jpeg", "png"]),
    mimeTypes: Object.freeze(["image/jpeg", "image/png"]),
    maxBytes: 10 * 1024 * 1024,
    signature: "image",
  }),
  manuscrito: Object.freeze({
    bucket: STORAGE_BUCKET.MANUSCRITOS,
    extensions: Object.freeze(["pdf"]),
    mimeTypes: Object.freeze(["application/pdf"]),
    maxBytes: 50 * 1024 * 1024,
    signature: "pdf",
  }),
});

function erroStorage(mensagem, statusCode = 400) {
  const error = new Error(mensagem);
  error.statusCode = statusCode;
  return error;
}

function marcarErro(error, statusCode = 500) {
  error.statusCode = error.statusCode || error.status || statusCode;
  throw error;
}

async function buscarArquivo(bucket, path) {
  const pb = criarClienteAdminPocketBase();
  try {
    const record = await pb.collection(COLECAO_ARQUIVOS).getFirstListItem(
      pb.filter("bucket = {:bucket} && path = {:path}", { bucket, path }),
    );
    return { pb, record };
  } catch (error) {
    if (error.status === 404) {
      throw erroStorage("Arquivo não encontrado.", 404);
    }
    marcarErro(error);
  }
}

export function obterRegraArquivo(tipo) {
  const regra = STORAGE_FILE_RULES[tipo];
  if (!regra) throw erroStorage("Tipo de arquivo inválido para o sistema.");
  return regra;
}

export function normalizarExtensao(extensao) {
  return String(extensao || "")
    .trim()
    .toLowerCase()
    .replace(/^\./, "");
}

export function validarMetadadosUpload({ tipo, extensao, mimeType, tamanho }) {
  const regra = obterRegraArquivo(tipo);
  const extensaoNormalizada = normalizarExtensao(extensao);
  const tamanhoNumerico = Number(tamanho);

  if (!regra.extensions.includes(extensaoNormalizada)) {
    throw erroStorage("Extensão de arquivo não permitida.");
  }
  if (!regra.mimeTypes.includes(mimeType)) {
    throw erroStorage("Tipo MIME de arquivo não permitido.");
  }
  if (!Number.isInteger(tamanhoNumerico) || tamanhoNumerico <= 0) {
    throw erroStorage("Tamanho de arquivo inválido.");
  }
  if (tamanhoNumerico > regra.maxBytes) {
    throw erroStorage("Arquivo excede o tamanho máximo permitido.");
  }
  return { regra, extensao: extensaoNormalizada };
}

export function validarPathDoUsuario(path, userId, bucket) {
  if (typeof path !== "string" || !path || !userId || !bucket) {
    throw erroStorage("Path de arquivo inválido.", 400);
  }
  if (
    path.includes("..") ||
    path.includes("\\") ||
    path.includes("?") ||
    path.includes("#") ||
    path.startsWith("/") ||
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    !path.startsWith(`${userId}/`)
  ) {
    throw erroStorage("Tentativa inválida de manipulação de arquivo.", 403);
  }
  if (path.split("/").some((segment) => !segment || segment === ".")) {
    throw erroStorage("Path de arquivo inválido.", 400);
  }
  return path;
}

export function normalizarCaminhoPersistido(value, bucket) {
  if (typeof value !== "string" || !value) return null;
  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    return value;
  }

  try {
    const url = new URL(value);
    const marker = "/storage/v1/object/";
    const markerIndex = url.pathname.indexOf(marker);
    if (markerIndex === -1) return null;
    const pathParts = url.pathname
      .slice(markerIndex + marker.length)
      .split("/");
    const bucketIndex = pathParts.indexOf(bucket);
    if (bucketIndex === -1) return null;
    return decodeURIComponent(pathParts.slice(bucketIndex + 1).join("/"));
  } catch {
    return null;
  }
}

export function criarPathUpload(userId, tipo, extensao) {
  const regra = obterRegraArquivo(tipo);
  const extensaoNormalizada = normalizarExtensao(extensao);
  return {
    bucket: regra.bucket,
    path: `${userId}/livro_${tipo}_${globalThis.crypto.randomUUID()}.${extensaoNormalizada}`,
  };
}

export async function uploadArquivo(bucket, path, arquivo) {
  const pb = criarClienteAdminPocketBase();
  const owner = path.split("/")[0];
  const formData = new FormData();
  const blob = new Blob([arquivo.buffer], { type: arquivo.mimetype });
  formData.append("owner", owner);
  formData.append("bucket", bucket);
  formData.append("path", path);
  formData.append(
    "file",
    new File([blob], path.split("/").pop(), { type: arquivo.mimetype }),
  );

  try {
    return await pb.collection(COLECAO_ARQUIVOS).create(formData);
  } catch (error) {
    marcarErro(error);
  }
}

export async function criarUrlAssinada(bucket, path) {
  const { pb, record } = await buscarArquivo(bucket, path);
  try {
    const token = await pb.files.getToken();
    return pb.files.getURL(record, record.file, { token });
  } catch (error) {
    marcarErro(error);
  }
}

export async function removerArquivos(bucket, paths) {
  const caminhos = [...new Set((paths || []).filter(Boolean))];
  if (!caminhos.length) return;

  const pb = criarClienteAdminPocketBase();
  for (const path of caminhos) {
    try {
      const record = await pb.collection(COLECAO_ARQUIVOS).getFirstListItem(
        pb.filter("bucket = {:bucket} && path = {:path}", { bucket, path }),
      );
      await pb.collection(COLECAO_ARQUIVOS).delete(record.id);
    } catch (error) {
      if (error.status === 404) continue;
      marcarErro(error);
    }
  }
}

export async function validarArquivoArmazenado(bucket, path, tipo) {
  const regra = obterRegraArquivo(tipo);
  const url = await criarUrlAssinada(bucket, path);
  const response = await fetch(url);
  if (!response.ok) {
    throw erroStorage("Não foi possível validar o arquivo armazenado.", 400);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length === 0 || bytes.length > regra.maxBytes) {
    throw erroStorage("Arquivo armazenado excede o tamanho permitido.");
  }

  const ehPdf =
    regra.signature === "pdf" &&
    new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  const ehJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const ehPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  const assinaturaValida = regra.signature === "pdf" ? ehPdf : ehJpeg || ehPng;
  if (!assinaturaValida) {
    throw erroStorage("Conteúdo do arquivo não corresponde ao tipo permitido.");
  }
}
