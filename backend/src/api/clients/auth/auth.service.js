import { AuthModel } from "../../common/models/auth.model.js";

export class AuthService {
  static async setSession(accessToken, refreshToken) {
    const { data, error } = await AuthModel.setSession(accessToken, refreshToken);

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
      const erroValidacao = new Error("Token de atualização inválido ou expirado.");
      erroValidacao.statusCode = 401;
      throw erroValidacao;
    }
    return data;
  }

  static async signup(email, password, nome, telefone) {
    if (!email || !password || !nome || !telefone) {
      const erroCampos = new Error("Todos os campos são obrigatórios para o cadastro.");
      erroCampos.statusCode = 400;
      throw erroCampos;
    }

    const redirectUrl = process.env.SUPABASE_REDIRECT_URL || "http://localhost:5173/confirmacao-email";
    const metadata = { nome, telephone: telefone };

    const { data, error } = await AuthModel.signUp(email, password, redirectUrl, metadata);

    if (error) {
      if (error.message?.includes("already registered") || error.status === 422) {
        const erroDuplicado = new Error("O e-mail informado já está cadastrado no sistema.");
        erroDuplicado.statusCode = 400;
        throw erroDuplicado;
      }
      error.statusCode = 400;
      throw error;
    }
    return data;
  }

  static async signout() {
    await AuthModel.signOut();
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

}
