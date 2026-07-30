import { AuthModel } from "../../common/models/auth.model.js";

export class AuthService {
  static async signinComGoogle(idToken) {
    if (!idToken) {
      const erroToken = new Error(
        "Token de autenticação do Google não fornecido.",
      );
      erroToken.statusCode = 400;
      throw erroToken;
    }

    try {
      const { data, error } = await AuthModel.signinComGoogle(idToken);

      if (error) {
        error.statusCode = 401;
        throw error;
      }
      return data;
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

    const redirectUrl = process.env.SUPABASE_RESET_PASSWORD_URL || "https://localhost:5173/auth/redefinir-senha";

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

    const metadata = { nome, telephone: telefone };

    const { data, error } = await AuthModel.signup(
      email,
      password,
      metadata,
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
