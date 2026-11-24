export const errorHandler = (err, _req, res, _next) => {
  console.error("Erro detectado no servidor:", err);

  let statusCode = err.statusCode || err.status || 500;
  let mensagem =
    typeof err.message === "string" && err.message.trim()
      ? err.message
      : "Ocorreu um erro interno inesperado no servidor.";

  const pbStatus = err.response?.status;
  const pbData = err.response?.data;

  if (pbStatus) {
    statusCode = pbStatus;
  }

  if (pbStatus === 400 && pbData) {
    const camposInvalidos = Object.entries(pbData)
      .filter(([, campo]) => campo?.message)
      .map(([nome, campo]) => `${nome}: ${campo.message}`);

    if (camposInvalidos.length > 0) {
      mensagem = `Dados inválidos: ${camposInvalidos.join("; ")}`;
    } else {
      mensagem = pbData.message || "Os dados enviados são inválidos.";
    }
  }

  if (pbStatus === 401) {
    mensagem = "Não autenticado. Faça login novamente.";
  }

  if (pbStatus === 403) {
    mensagem = "Você não possui permissão para realizar esta operação.";
  }

  if (pbStatus === 404) {
    mensagem = "O registro ou recurso solicitado não foi encontrado.";
  }

  if (pbStatus === 409) {
    mensagem =
      "Não foi possível concluir a operação devido a um conflito de dados.";
  }

  if (pbStatus === 413) {
    mensagem = "O arquivo enviado excede o tamanho máximo permitido.";
  }

  if (pbStatus === 422) {
    mensagem = "Não foi possível processar os dados enviados.";
  }

  if (pbStatus === 429) {
    mensagem =
      "Muitas requisições. Aguarde alguns instantes e tente novamente.";
  }

  if (err.code && err.code.startsWith("22")) {
    statusCode = 400;
    mensagem = "O identificador ou dado fornecido possui um formato inválido.";
  }

  if (err.code === "P0001") {
    statusCode = 400;
  }

  if (err.code === "23505") {
    statusCode = 409;
    mensagem = "Já existe um registro com os dados informados.";
  }

  if (err.code === "23503") {
    statusCode = 400;
    mensagem =
      "Não foi possível realizar a operação devido a uma referência inválida.";
  }

  if (err.code === "23502") {
    statusCode = 400;
    mensagem = "Um ou mais campos obrigatórios não foram preenchidos.";
  }

  if (err.code === "42501") {
    statusCode = 403;
    mensagem = "Você não possui permissão para realizar esta operação.";
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    mensagem = "O arquivo enviado excede o tamanho máximo permitido.";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    mensagem = "Foi enviado um campo de arquivo inesperado.";
  }

  if (err.code === "LIMIT_FILE_COUNT") {
    statusCode = 400;
    mensagem = "A quantidade de arquivos enviados excede o limite permitido.";
  }

  if (statusCode >= 500) {
    mensagem = "Ocorreu um erro interno inesperado no servidor.";
  }

  return res.status(statusCode).json({
    status: "error",
    statusCode,
    error: mensagem,
  });
};
