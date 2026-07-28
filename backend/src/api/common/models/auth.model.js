import supabase from "../config/supabase.js";

export class AuthModel {
  static async signInAdministrador(usernameDigitado, senhaAdm) {
    const emailVirtual = `${usernameDigitado.toLowerCase()}@adm.sistema.internal`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailVirtual,
      password: senhaAdm,
    });

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    return data;
  }

  static async conferirAdministrador(userId) {
    const { data, error } = await supabase
      .from("adm_credenciais")
      .select("funcao, ativo, primeiro_acesso")
      .eq("id", userId)
      .single();

    if (error) {
      error.statusCode = 404;
      throw error;
    }

    return data;
  }

  static async atualizarSenha(novaSenha) {
    const { data, error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    return data;
  }

  static async atualizarPrimeiroAcesso(userId) {
    const { data, error } = await supabase
      .from("adm_credenciais")
      .update({ primeiro_acesso: false })
      .eq("id", userId);

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    return data;
  }

  //Usuários comuns
  static async enviarEmailRecuperacao(email, redirectUrl) {
  const {data, error} = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if(error){
    error.statusCode = 500;
    throw error;
  }

  return data;
}

  static async signinComGoogle(idToken) {
    const {data, error} = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });

    if(error){
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

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
