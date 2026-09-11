import { AuthModel } from "../../common/models/auth.model.js";

import {
  SUPABASE_RESET_PASSWORD_CALLBACK_URL,
  SUPABASE_REDIRECT_ADMIN_URL,
} from "../../common/config/environment.js";
export class AuthService {
  static async signinComGoogle(redirectTo) {
    try {
      const result = await AuthModel.signinComGoogle(redirectTo);

      if (!result) {
        const error = new Error("Resposta vazia ao iniciar login com Google.");
        error.statusCode = 502;
        throw error;
      }

      return result;
    } catch (error) {
      error.statusCode = error.statusCode || 500;
      throw error;
    }
  }

  static async esqueciSenha(email) {
    if (!email) {
      const erroEmail = new Error("O e-mail é obrigatório.");
      erroEmail.statusCode = 400;
      throw erroEmail;
    }

    const redirectUrl = SUPABASE_RESET_PASSWORD_CALLBACK_URL;

    const { data, error } = await AuthModel.enviarEmailRecuperacao(
      email,
      redirectUrl,
    );

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    return data;
  }

  static async confirmarNovaSenha(accessToken, refreshToken, novaSenha) {
    if (!accessToken || !novaSenha) {
      const erroDados = new Error("Dados de validação ou nova senha ausentes.");
      erroDados.statusCode = 400;
      throw erroDados;
    }

    await AuthModel.setSession(accessToken, refreshToken);

    return await AuthModel.atualizarSenha(novaSenha);
  }

  static async atualizarSenhaAntiga(email, senhaAntiga, senhaNova) {
    if (!email || !senhaAntiga || !senhaNova) {
      const erroDados = new Error(
        "Dados para atualização de senha não informados",
      );
      erroDados.statusCode = 400;
      throw erroDados;
    }

    try {
      const dataLogin = await AuthModel.signin(email, senhaAntiga);

      await AuthModel.setSession(
        dataLogin.session.access_token,
        dataLogin.session.refresh_token,
      );

      const dataUpdate = await AuthModel.atualizarSenha(senhaNova);

      return dataUpdate;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }

  static async setSession(accessToken, refreshToken) {
    const { data, error } = await AuthModel.setSession(
      accessToken,
      refreshToken,
    );

    if (error) {
      error.statusCode = 400;
      throw error;
    }
    return data;
  }

  static async setSessionWithCode(code) {
    const { data, error } = await AuthModel.setSessionWithCode(code);

    if (error) {
      error.statusCode = 400;
      throw error;
    }
    return data;
  }

  static async refreshSession(refreshToken) {
    if (!refreshToken) {
      const erroToken = new Error("Token de atualização não fornecido.");
      erroToken.statusCode = 401;
      throw erroToken;
    }

    const { data, error } = await AuthModel.refreshSession(refreshToken);

    if (error || !data.session) {
      const erroValidacao = new Error(
        "Token de atualização inválido ou expirado.",
      );
      erroValidacao.statusCode = 401;
      throw erroValidacao;
    }
    return data;
  }

  static async signup(email, password, nome, telefone) {
    if (!email || !password || !nome || !telefone) {
      const erroCampos = new Error(
        "Todos os campos são obrigatórios para o cadastro.",
      );
      erroCampos.statusCode = 400;
      throw erroCampos;
    }

    const { data, error } = await AuthModel.signup(
      email,
      password,
      nome,
      telefone,
    );

    if (error) {
      if (
        error.message?.includes("already registered") ||
        error.status === 422
      ) {
        const erroDuplicado = new Error(
          "O e-mail informado já está cadastrado no sistema.",
        );
        erroDuplicado.statusCode = 400;
        throw erroDuplicado;
      }
      error.statusCode = 400;
      throw error;
    }
    return data;
  }

  static async signout() {
    await AuthModel.signout();
  }

  static async signin(email, password) {
    try {
      const resultado = await AuthModel.signin(email, password);

      return resultado;
    } catch (error) {
      error.statusCode = error.status || 400;
      throw error;
    }
  }

  static async signinAdmin(email, senhaAdmin) {
    if (!email || !senhaAdmin) {
      const erroCredenciais = new Error(
        "Email e/ou senha não informados para o login!",
      );
      erroCredenciais.statusCode = 400;
      throw erroCredenciais;
    }

    const { data: authData, error } = await AuthModel.signinAdmin(
      email,
      senhaAdmin,
    );

    if (error) {
      throw error;
    }

    const userId = authData?.userId;

    if (!userId) {
      const erroId = new Error(
        "Usuário não encontrado ou credenciais inválidas.",
      );
      erroId.statusCode = 401;
      throw erroId;
    }

    const primeiroAcesso = await AuthModel.conferirPrimeiroAcesso(userId);

    const redirectUrl = primeiroAcesso ? SUPABASE_REDIRECT_ADMIN_URL : null;
    return {
      data: authData.data,
      user: authData.user,
      redirectUrl,
    };
  }

  static async alterarSenhaAdm(userId, novaSenha) {
    if (!userId || !novaSenha) {
      const erroCampos = new Error(
        "ID do usuário e nova senha são obrigatórios para a alteração de senha.",
      );
      erroCampos.statusCode = 400;
      throw erroCampos;
    }

    const resultado = await AuthModel.alterarSenhaAdmin(userId, novaSenha);

    return resultado;
  }

  static async alterarSenhaAntigaAdm(email, senhaAntiga, novaSenha) {
    if (!email || !novaSenha || !senhaAntiga) {
      const erroCampos = new Error(
        "Erro ao informar as credenciais para alteração de senha.",
      );
      erroCampos.statusCode = 400;
      throw erroCampos;
    }

    const login = await AuthModel.signinAdmin(email, senhaAntiga);

    const resultado = login
      ? await AuthModel.alterarSenhaAdmin(login.userId, novaSenha)
      : null;

    return resultado;
  }

  static async atualizarSenha(novaSenha) {
    if (!novaSenha) {
      const erroSenha = new Error("Nenhuma nova senha informada.");
      erroSenha.statusCode = 400;
      throw erroSenha;
    }

    try {
      const resultado = await AuthModel.atualizarSenha(novaSenha);

      return resultado;
    } catch (error) {
      error.statusCode = 500;
      throw error;
    }
  }
}
