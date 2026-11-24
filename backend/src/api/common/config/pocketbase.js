import PocketBase from "pocketbase";
import { POCKETBASE_URL } from "./environment.js";

const pb = new PocketBase(POCKETBASE_URL);

export function criarClientePocketBase() {
  return new PocketBase(POCKETBASE_URL);
}

export async function criarClienteAdminPocketBase() {
  const email = process.env.POCKETBASE_SUPERUSER_EMAIL;
  const senha = process.env.POCKETBASE_SUPERUSER_PASSWORD;

  if (!email || !senha) {
    throw new Error(
      "Credenciais do superusuário do PocketBase não configuradas.",
    );
  }

  const cliente = criarClientePocketBase();

  await cliente.collection("_superusers").authWithPassword(email, senha);

  return cliente;
}

export default pb;
