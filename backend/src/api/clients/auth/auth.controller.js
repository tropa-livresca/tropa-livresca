import supabase, { supabaseAdmin } from "../../common/config/supabase.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
};

export const setSession = async (req, res) => {
  const { accessToken, refreshToken } = req.body;

  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res.json({
      user: data.user,
      message: "Sessão definida com sucesso e cookies configurados.",
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao definir sessão." });
  }
};

export const refreshSession = async (req, res) => {
  const refreshToken = req.cookies["refresh-token"];

  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "Token de atualização não fornecido." });
  }

  try {
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      return res.status(401).json({ error: "Token de atualização inválido." });
    }

    const COOKIE_OPTIONS = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    };

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res.status(200).json({ message: "Sessão renovada com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar sessão." });
  }
};

export const signup = async (req, res) => {
  const { email, password, telefone, nome } = req.body;

  if (!email || !password || !nome || !telefone) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
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
        return res.status(400).json({ error: "Email já cadastrado." });
      }

      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      user: data.user,
      message:
        "Cadastro Realizado! Por favor, verifique seu email para confirmar a conta.",
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar usuário." });
  }
};

export const signout = async (req, res) => {
  try {
    await supabase.auth.signOut();
    res.clearCookie("auth-token", COOKIE_OPTIONS);
    res.clearCookie("refresh-token", COOKIE_OPTIONS);
    res.json({ message: "Desconectado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao desconectar usuário." });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res
      .status(200)
      .json({ user: data.user, message: "Login Realizado!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao realizar login." });
  }
};
