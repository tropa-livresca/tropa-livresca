export function error(code, mensagem) {
  const erro = new Error(mensagem);
  erro.statusCode(code);
  throw erro;
}

export function errorUsuarioId() {
  error(401, "Id do usuário não informado.");
}
