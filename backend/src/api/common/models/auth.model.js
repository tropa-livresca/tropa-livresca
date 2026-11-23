import pb from "../config/pocketbase.js";

const COLECAO_AUTH = "users_profile";

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

  static async signinAdmin(email, senha) {
    try {
      const authData = await pb
        .collection(COLECAO_AUTH)
        .authWithPassword(email, senha);

      const usuario = authData.record;

      if (!usuario.is_admin) {
        pb.authStore.clear();

        const error = new Error("Acesso negado. Apenas administradores.");

        error.statusCode = 403;
        throw error;
      }

      return {
        data: {
          userId: usuario.id,
          user: usuario,
        },
        error: null,
      };
    } catch (error) {
      if (error.statusCode === 403) {
        return {
          data: null,
          error,
        };
      }

      return {
        data: null,
        error: Object.assign(
          new Error(
            error.status === 400 || error.status === 401
              ? "Credenciais administrativas inválidas."
              : "Não foi possível realizar a autenticação administrativa.",
          ),
          {
            statusCode:
              error.status === 400 || error.status === 401
                ? 401
                : error.status || 500,
          },
        ),
      };
    }
  }

  static async conferirAdmin(userId) {
    try {
      const usuario = await this.buscarPerfil(userId);

      if (!usuario.is_admin) {
        const error = new Error("Acesso negado. Apenas administradores.");

        error.statusCode = 403;
        throw error;
      }

      return usuario;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = error.status || 500;
      }

      throw error;
    }
  }

  static async alterarSenhaAdmin(userId, novaSenha, senhaAntiga) {
    const usuarioAtual = pb.authStore.record;

    if (!usuarioAtual || usuarioAtual.id !== userId) {
      const error = new Error(
        "Não é permitido alterar a senha de outro usuário.",
      );

      error.statusCode = 403;
      throw error;
    }

    const dadosSenha = {
      password: novaSenha,
      passwordConfirm: novaSenha,
      primeiro_acesso: false,
    };

    if (senhaAntiga) {
      dadosSenha.oldPassword = senhaAntiga;
    }

    const usuario = await pb
      .collection(COLECAO_AUTH)
      .update(userId, dadosSenha);

    return {
      data: usuario,
    };
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
