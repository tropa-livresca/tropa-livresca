import { AuthModel } from "../../common/models/auth.model.js";

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
      erroEmail.statusCode = 500;
      throw erroEmail;
    }

    const redirectUrl =
      process.env.SUPABASE_RESET_PASSWORD_CALLBACK_URL ||
      "http://localhost:3000/api/v1/clients/auth/callback-redefinir-senha";

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
      dataLogin.session.refresh_token
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
      error.statusCode = 400;
      throw error;
    }
  }

  static async atualizarSenha(novaSenha) {
    if (!novaSenha) {
      const erroSenha = new Error("Nenhuma nova senha informada.");
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
