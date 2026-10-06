import { supabaseAdmin } from "./supabase.js";

export const STORAGE_BUCKET = Object.freeze({
  CAPAS: "capa-livros",
  MANUSCRITOS: "manuscrito-livro",
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
    mimeTypes: Object.freeze(["image/jpe g", "image/png"]),
    maxBytes: 10 * 1024 * 1024,
    signature: "image",
  }),
  capa_orelhas: Object.freeze({
    bucket: STORAGE_BUCKET.CAPAS,
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

export function obterRegraArquivo(tipo) {
  const regra = STORAGE_FILE_RULES[tipo];

  if (!regra) {
    throw erroStorage("Tipo de arquivo inválido para o sistema.");
  }

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

  console.log(regra);
  console.log(mimeType);

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
    const marker = `/storage/v1/object/`;
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

export async function criarUrlAssinada(bucket, path) {
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUrl(path, STORAGE_SIGNED_URL_TTL);

  if (error) {
    error.statusCode = 500;
    throw error;
  }

  return data.signedUrl;
}

export async function removerArquivos(bucket, paths) {
  const pathsValidos = [...new Set((paths || []).filter(Boolean))];

  if (!pathsValidos.length) return;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove(pathsValidos);

  if (error) {
    error.statusCode = 500;
    throw error;
  }
}

export async function validarArquivoArmazenado(bucket, path, tipo) {
  const regra = obterRegraArquivo(tipo);
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .download(path);

  if (error) {
    error.statusCode = 400;
    throw error;
  }

  const bytes = new Uint8Array(await data.arrayBuffer());

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
