export const STORAGE_FILE_RULES = Object.freeze({
  capa_frente: Object.freeze({
    extensions: Object.freeze(["jpg", "jpeg", "png"]),
    mimeTypes: Object.freeze(["image/jpeg", "image/png"]),
    maxBytes: 10 * 1024 * 1024,
  }),
  capa_verso: Object.freeze({
    extensions: Object.freeze(["jpg", "jpeg", "png"]),
    mimeTypes: Object.freeze(["image/jpeg", "image/png"]),
    maxBytes: 10 * 1024 * 1024,
  }),
  imagem_perfil: Object.freeze({
    extensions: Object.freeze(["jpg", "jpeg", "png"]),
    mimeTypes: Object.freeze(["image/jpeg", "image/png"]),
    maxBytes: 10 * 1024 * 1024,
  }),
  manuscrito: Object.freeze({
    extensions: Object.freeze(["pdf"]),
    mimeTypes: Object.freeze(["application/pdf"]),
    maxBytes: 50 * 1024 * 1024,
  }),
});

function erroArquivo(mensagem) {
  const error = new Error(mensagem);
  error.statusCode = 400;
  return error;
}

export function obterRegraArquivo(tipo) {
  const regra = STORAGE_FILE_RULES[tipo];
  if (!regra) throw erroArquivo("Tipo de arquivo inválido para o sistema.");
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
    throw erroArquivo("Extensão de arquivo não permitida.");
  }
  if (!regra.mimeTypes.includes(mimeType)) {
    throw erroArquivo("Tipo MIME de arquivo não permitido.");
  }
  if (!Number.isInteger(tamanhoNumerico) || tamanhoNumerico <= 0) {
    throw erroArquivo("Tamanho de arquivo inválido.");
  }
  if (tamanhoNumerico > regra.maxBytes) {
    throw erroArquivo("Arquivo excede o tamanho máximo permitido.");
  }

  return { regra, extensao: extensaoNormalizada };
}
