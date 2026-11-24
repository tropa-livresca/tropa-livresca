import bcrypt from "bcryptjs";

import pb, { criarClienteAdminPocketBase } from "../config/pocketbase.js";

import { gerarSenha } from "../utils/senha.util.js";

const COLECAO_AUTH = "users_profile";
const SALT_ROUNDS = 12;

export class AuthModel {
  static async buscarPerfil(userId) {
    return await pb.collection(COLECAO_AUTH).getOne(userId);
  }

  static async conferirPrimeiroAcesso(userId) {
    try {
      const perfil = await this.buscarPerfil(userId);

      return perfil.primeiro_acesso ?? false;
    } catch (error) {
      if (error.status === 404) return false;

      error.statusCode = error.status || 500;
      throw error;
    }
  }

  static async conferirAdmin(userId) {
    try {
      const pbAdmin = await criarClienteAdminPocketBase();

      const usuario = await pbAdmin.collection(COLECAO_AUTH).getOne(userId);

      if (!usuario.is_admin) {
        const error = new Error("Acesso negado. Apenas administradores.");

        error.statusCode = 403;
        throw error;
      }

      const { senha_admin, ...usuarioSeguro } = usuario;

      return usuarioSeguro;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = error.status || 500;
      }

      throw error;
    }
  }

  static async gerarCredenciaisAdmin() {
    const senha = gerarSenha(16);

    const hash = await bcrypt.hash(senha, SALT_ROUNDS);

    return {
      senha,
      hash,
    };
  }

  static async promoverAdmin(userId, isMaster = false) {
    const pbAdmin = await criarClienteAdminPocketBase();

    try {
      const usuario = await pbAdmin.collection(COLECAO_AUTH).getOne(userId);

      if (usuario.is_admin) {
        const error = new Error("Este usuário já é administrador.");

        error.statusCode = 409;
        throw error;
      }

      const { senha, hash } = await this.gerarCredenciaisAdmin();

      const atualizado = await pbAdmin.collection(COLECAO_AUTH).update(userId, {
        is_admin: true,
        is_master: isMaster,
        senha_admin: hash,
        primeiro_acesso: true,
      });

      return {
        data: {
          userId: atualizado.id,
          email: atualizado.email,
          nome: atualizado.nome,
          senhaTemporaria: senha,
        },
        error: null,
      };
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = error.status || 500;
      }

      throw error;
    }
  }

  static async signinAdmin(email, senha) {
    const pbAdmin = await criarClienteAdminPocketBase();

    try {
      const filtro = pbAdmin.filter("email = {:email}", { email });

      const usuario = await pbAdmin
        .collection(COLECAO_AUTH)
        .getFirstListItem(filtro);

      if (!usuario.is_admin || !usuario.senha_admin) {
        throw new Error("Credenciais administrativas inválidas.");
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_admin);

      if (!senhaValida) {
        throw new Error("Credenciais administrativas inválidas.");
      }

      const { senha_admin, ...usuarioSeguro } = usuario;

      return {
        data: {
          userId: usuario.id,
          user: usuarioSeguro,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: Object.assign(
          new Error("Credenciais administrativas inválidas.", error),
          {
            statusCode: 401,
          },
        ),
      };
    }
  }

  static async alterarSenhaAdmin(userId, novaSenha, senhaAntiga) {
    const pbAdmin = await criarClienteAdminPocketBase();

    try {
      const usuario = await pbAdmin.collection(COLECAO_AUTH).getOne(userId);

      if (!usuario.is_admin) {
        const error = new Error("Acesso negado. Apenas administradores.");
        error.statusCode = 403;
        throw error;
      }

      if (!usuario.senha_admin) {
        const error = new Error("Credencial administrativa não cadastrada.");
        error.statusCode = 400;
        throw error;
      }

      if (!usuario.primeiro_acesso) {
        if (!senhaAntiga) {
          const error = new Error("Informe sua senha administrativa atual.");
          error.statusCode = 400;
          throw error;
        }

        const senhaValida = await bcrypt.compare(
          senhaAntiga,
          usuario.senha_admin,
        );

        if (!senhaValida) {
          const error = new Error(
            "A senha administrativa atual está incorreta.",
          );
          error.statusCode = 401;
          throw error;
        }
      }

      if (typeof novaSenha !== "string" || novaSenha.length < 8) {
        const error = new Error(
          "A nova senha deve possuir pelo menos 8 caracteres.",
        );
        error.statusCode = 400;
        throw error;
      }

      const hash = await gerarSenha(novaSenha);

      const atualizado = await pbAdmin.collection(COLECAO_AUTH).update(userId, {
        senha_admin: hash,
        primeiro_acesso: false,
      });

      return {
        data: {
          userId: atualizado.id,
          primeiro_acesso: atualizado.primeiro_acesso,
        },
        error: null,
      };
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = error.status || 500;
      }

      throw error;
    }
  }
  static async atualizarSenha(senhaNova, senhaAntiga) {
    const usuario = pb.authStore.record;

    if (!usuario) {
      const error = new Error("Nenhum usuário autenticado.");

      error.statusCode = 401;
      throw error;
    }

    const dados = {
      password: senhaNova,
      passwordConfirm: senhaNova,
    };

    if (senhaAntiga) {
      dados.oldPassword = senhaAntiga;
    }

    return await pb.collection(COLECAO_AUTH).update(usuario.id, dados);
  }

  static async enviarEmailRecuperacao(email) {
    return await pb.collection(COLECAO_AUTH).requestPasswordReset(email);
  }

  static async confirmarNovaSenha(token, senhaNova) {
    return await pb
      .collection(COLECAO_AUTH)
      .confirmPasswordReset(token, senhaNova, senhaNova);
  }

  static async signin(email, password) {
    return await pb.collection(COLECAO_AUTH).authWithPassword(email, password);
  }

  static async signup(email, password, nome, sobrenome, telefone) {
    const dados = {
      email,
      password,
      passwordConfirm: password,
      nome,
      sobrenome,
      telefone,
    };

    const usuario = await pb.collection(COLECAO_AUTH).create(dados);

    await pb.collection(COLECAO_AUTH).requestVerification(email);

    return usuario;
  }

  static async signout() {
    pb.authStore.clear();

    return true;
  }

  static async refreshSession() {
    if (!pb.authStore.isValid) {
      const error = new Error("Sessão inválida ou expirada.");

      error.statusCode = 401;
      throw error;
    }

    return await pb.collection(COLECAO_AUTH).authRefresh();
  }

  static getUsuarioAtual() {
    return pb.authStore.record;
  }

  static getToken() {
    return pb.authStore.token;
  }

  static isAuthenticated() {
    return pb.authStore.isValid;
  }
}
