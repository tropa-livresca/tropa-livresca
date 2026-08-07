import supabase from "../config/supabase.js";

export class AuthModel {
  static async signInAdministrador(usernameDigitado, senhaAdm) {
    const emailVirtual = `${usernameDigitado.toLowerCase()}@adm.sistema.internal`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailVirtual,
      password: senhaAdm,
    });

    if (error) {
      const appError = new Error(error.message || "Erro na autenticação.");
      appError.statusCode = 400;
      throw appError;
    }

    return data;
  }

  static async conferirAdministrador(userId) {
    try {
      const { data, error } = await supabase
        .from("adm_credenciais")
        .select("funcao, ativo, primeiro_acesso")
        .eq("fk_user_profile_id", userId)
        .single();

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  static async atualizarSenha(userId, novaSenha) {
    const { data, error } = await supabase.auth.updateUser({
      password: novaSenha,
    });

    if (error) {
      const appError = new Error(error.message || "Erro ao atualizar senha.");
      appError.statusCode = 400;
      throw appError;
    }

    return { data, error: null };
  }

  static async atualizarPrimeiroAcesso(userId) {
    try {
      const { data, error } = await supabase
        .from("adm_credenciais")
        .update({ primeiro_acesso: false })
        .eq("fk_user_profile_id", userId);

      if (error) {
        return { data: null, error };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  }

  static async enviarEmailRecuperacao(email, redirectUrl) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });

    if (error) {
      const appError = new Error(error.message || "Erro ao enviar e-mail.");
      appError.statusCode = 500;
      throw appError;
    }

    return data;
  }

  static async signinComGoogle(redirectTo) {
    const callbackUrl =
      redirectTo ||
      process.env.SUPABASE_AUTH_REDIRECT_URL ||
      "http://localhost:5173/auth/callback";

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        const oauthError = new Error(
          error.message || "Falha ao iniciar autenticação do Google.",
        );
        oauthError.statusCode = 502;
        throw oauthError;
      }

      return {
        ...data,
        url: data?.url || callbackUrl,
      };
    } catch (error) {
      const appError = new Error(error.message || "Erro no provedor OAuth.");
      appError.statusCode = error.statusCode || 502;
      throw appError;
    }
  }

  static async setSession(accessToken, refreshToken) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      const appError = new Error(error.message || "Erro ao definir sessão.");
      appError.statusCode = 400;
      throw appError;
    }
    return { data, error: null };
  }

  static async setSessionWithCode(code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      const appError = new Error(
        error.message || "Erro ao trocar código por sessão.",
      );
      appError.statusCode = 400;
      throw appError;
    }
    return { data, error: null };
  }

  static async refreshSession(refreshToken) {
    if (!refreshToken) {
      return {
        data: null,
        error: new Error("Token de atualização não fornecido."),
      };
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return { data: null, error: error || new Error("Sessão inválida.") };
    }
    return { data, error: null };
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
        data: { nome, telefone },
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
      const appError = new Error(error.message || "Erro no cadastro.");
      appError.statusCode = 400;
      throw appError;
    }
    return data;
  }

  static async signout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      const appError = new Error(error.message || "Erro ao sair.");
      appError.statusCode = 400;
      throw appError;
    }

    return true;
  }

  static async signin(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const appError = new Error(error.message || "Erro no login.");
      appError.statusCode = 400;
      throw appError;
    }
    return data;
  }
}
