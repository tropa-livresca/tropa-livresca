import supabase from "../config/supabase.js";

import {
  SUPABASE_AUTH_REDIRECT_URL,
  SUPABASE_RESET_PASSWORD_URL,
  SUPABASE_EMAIL_CONFIRMATION_URL,
} from "../config/environment.js";
export class AuthModel {
  static async conferirPrimeiroAcesso(userId) {
    const { data, error } = await supabase
      .from("users_profile")
      .select("primeiro_acesso")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data?.primeiro_acesso ?? false;
  }

  static async alterarSenhaAdmin(userId, novaSenha) {
    const { data, error } = await supabase.rpc("alterar_senha_adm", {
      p_user_id: userId,
      p_nova_senha: novaSenha,
    });

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return {
      data: data?.[0] ?? null,
    };
  }

  static async signinAdmin(email, senha) {
    const { data: busca, error: buscaError } = await supabase
      .from("users_profile")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (buscaError || !busca) {
      return { data: null, error: new Error("E-mail não cadastrado.") };
    }

    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      "verificar_senha_adm",
      {
        user_id: busca.id,
        senha_digitada: senha,
      },
    );

    if (rpcError || !rpcResult) {
      return { data: null, error: new Error("Senha incorreta.") };
    }

    return {
      data: {
        userId: busca.id,
        user: busca,
      },
      error: null,
    };
  }

  static async conferirAdmin(userId) {
    const { data, error } = await supabase
      .from("users_profile")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      const erroBanco = new Error(error.message || "Erro no banco de dados.");
      erroBanco.statusCode = 500;
      throw erroBanco;
    }

    if (!data || data.is_admin == false) {
      const erroAdmin = new Error("Acesso negado. Apenas administradores.");
      erroAdmin.statusCode = 403;
      throw erroAdmin;
    }

    return data;
  }

  static async atualizarSenha(senhaNova) {
    const { data, error } = await supabase.auth.updateUser({
      password: senhaNova,
    });

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    return data;
  }

  static async enviarEmailRecuperacao(email, redirectUrl) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl || SUPABASE_RESET_PASSWORD_URL,
    });

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async signinComGoogle(redirectTo) {
    const callbackUrl = redirectTo || SUPABASE_AUTH_REDIRECT_URL;

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
      if (!error.statusCode) {
        error.statusCode = 502;
      }
      throw error;
    }
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

  static async setSessionWithCode(code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

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

    const redirectUrl = SUPABASE_EMAIL_CONFIRMATION_URL;

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
      error.statusCode = 400;
      throw error;
    }
    return data;
  }

  static async signout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    return true;
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
