import PocketBase from "pocketbase";
import { POCKETBASE_URL } from "./environment.js";

const pb = new PocketBase(POCKETBASE_URL);

export function criarClientePocketBase() {
  return new PocketBase(POCKETBASE_URL);
}

export function criarClienteAdminPocketBase() {
  const token = process.env.POCKETBASE_SUPERUSER_TOKEN;

  if (!token) {
    throw new Error("POCKETBASE_SUPERUSER_TOKEN não configurado.");
  }

  const cliente = criarClientePocketBase();

  cliente.authStore.save(token);

  return cliente;
}

export default pb;
