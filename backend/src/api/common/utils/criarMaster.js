import { randomInt } from "node:crypto";
import { criarClienteAdminPocketBase } from "../config/pocketbase.js";
import { gerarSenha } from "./senha.util.js";

const COLECAO = "users_profile";

const CARACTERES = {
  maiusculas: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  minusculas: "abcdefghijkmnopqrstuvwxyz",
  numeros: "23456789",
  especiais: "!@#$%&*_-",
};

const TODOS_CARACTERES = Object.values(CARACTERES).join("");

const gerarSenhaTemporaria = (tamanho = 16) => {
  if (!Number.isInteger(tamanho) || tamanho < 8) {
    throw new Error("O tamanho mínimo da senha é 8 caracteres.");
  }

  const obrigatorios = Object.values(CARACTERES).map(
    (grupo) => grupo[randomInt(grupo.length)],
  );

  const restantes = Array.from(
    { length: tamanho - obrigatorios.length },
    () => TODOS_CARACTERES[randomInt(TODOS_CARACTERES.length)],
  );

  const caracteres = [...obrigatorios, ...restantes];

  for (let i = caracteres.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [caracteres[i], caracteres[j]] = [caracteres[j], caracteres[i]];
  }

  return caracteres.join("");
};

const criarMaster = async () => {
  try {
    const email = process.argv[2];

    if (!email) {
      throw new Error("Informe o e-mail do usuário que será master.");
    }

    console.log("[1] Autenticando superusuário...");

    const pb = await criarClienteAdminPocketBase();

    console.log("[2] Consultando usuário...");

    const filtro = pb.filter("email = {:email}", { email });

    const usuario = await pb.collection(COLECAO).getFirstListItem(filtro);

    if (usuario.is_master) {
      throw new Error("Este usuário já é administrador master.");
    }

    if (usuario.is_admin) {
      throw new Error("Este usuário já é administrador.");
    }

    console.log("[3] Gerando senha administrativa...");

    const senhaTemporaria = gerarSenhaTemporaria(16);
    const hash = await gerarSenha(senhaTemporaria);

    console.log("[4] Atualizando usuário...");

    await pb.collection(COLECAO).update(usuario.id, {
      is_admin: true,
      is_master: true,
      senha_admin: hash,
      primeiro_acesso: true,
    });

    console.log("\nAdministrador master criado com sucesso!");
    console.log("E-mail:", usuario.email);
    console.log("Senha administrativa temporária:", senhaTemporaria);
    console.log("Troca de senha obrigatória no primeiro acesso.");
  } catch (error) {
    console.error("\nErro ao criar administrador master:");
    console.error("Mensagem:", error.message);
    console.error("Status HTTP:", error.status);
    console.error("Resposta:", error.response);

    process.exitCode = 1;
  }
};

criarMaster();
