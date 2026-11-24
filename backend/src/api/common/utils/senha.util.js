import bcrypt from "bcryptjs";

const ROUNDS = 12;
const HASH_BCRYPT = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

export function ehHashBcrypt(hash) {
  return typeof hash === "string" && HASH_BCRYPT.test(hash);
}

export async function gerarSenha(senha) {
  if (typeof senha !== "string" || !senha) {
    throw new Error("A senha deve ser uma string não vazia.");
  }

  return await bcrypt.hash(senha, ROUNDS);
}

export async function compararSenha(senhaDigitada, hashArmazenado) {
  if (
    typeof senhaDigitada !== "string" ||
    !senhaDigitada ||
    !ehHashBcrypt(hashArmazenado)
  ) {
    return false;
  }

  return await bcrypt.compare(senhaDigitada, hashArmazenado);
}
