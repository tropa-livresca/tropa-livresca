import supabase from "../config/supabase.js";

export class AuthModel {
  //Administrador

  static async buscarPorUsername(username) {
    const { data, error } = await supabase
      .from("vw_auth_adm")
      .select("*")
      .eq("username", username.toLowerCase().trim())
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }
    return data;
  }

  static async atualizarSenha(userId, novaSenhaCriptografada) {
    const { data, error } = await supabase
      .from("adm_credenciais")
      .update({
        senha_adm: novaSenhaCriptografada,
        forcar_troca_senha: false,
      })
      .eq("fk_user_profile_id", userId)
      .select();

    if (error) throw error;
    return data;
  }

  //Usuários comuns
  static async setSession(accessToken, refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

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

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

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

    const redirectUrl =
      process.env.SUPABASE_REDIRECT_URL ||
      "http://localhost:5173/confirmacao-email";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { nome, telephone: telefone },
      },
    });

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
    await supabase.auth.signOut();
  }

  static async signin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      error.statusCode = 400;
      throw error;
    }
    return data;
  }
}
