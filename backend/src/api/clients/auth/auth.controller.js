import supabase from "../../common/config/supabase.js"; 

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
};

export const setSession = async (req, res, next) => {
  const { accessToken, refreshToken } = req.body;

  try {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res.json({
      user: data.user,
      message: "Sessão definida com sucesso e cookies configurados.",
    });
  } catch (err) {
    next(err);
  }
};

export const refreshSession = async (req, res, next) => {
  const refreshToken = req.cookies["refresh-token"];

  try {
    if (!refreshToken) {
      const erroToken = new Error("Token de atualização não fornecido.");
      erroToken.statusCode = 401;
      throw erroToken;
    }

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      const erroValidacao = new Error("Token de atualização inválido ou expirado.");
      erroValidacao.statusCode = 401;
      throw erroValidacao;
    }

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res.status(200).json({ message: "Sessão renovada com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const signup = async (req, res, next) => {
  const { email, password, telefone, nome } = req.body;

  try {
    if (!email || !password || !nome || !telefone) {
      const erroCampos = new Error("Todos os campos são obrigatórios para o cadastro.");
      erroCampos.statusCode = 400;
      throw erroCampos;
    }

    const redirectUrl = process.env.SUPABASE_REDIRECT_URL || "http://localhost:5173/confirmacao-email";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { nome, telephone: telefone },
      },
    });

    if (error) {
      if (error.message?.includes("already registered") || error.status === 422) {
        const erroDuplicado = new Error("O e-mail informado já está cadastrado no sistema.");
        erroDuplicado.statusCode = 400;
        throw erroDuplicado;
      }
      error.statusCode = 400;
      throw error;
    }

    return res.status(201).json({
      user: data.user,
      message: "Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.",
    });
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    await supabase.auth.signOut();
    res.clearCookie("auth-token", COOKIE_OPTIONS);
    res.clearCookie("refresh-token", COOKIE_OPTIONS);
    return res.json({ message: "Desconectado com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      error.statusCode = 400;
      throw error;
    }

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res.status(200).json({ user: data.user, message: "Login realizado com sucesso!" });
  } catch (err) {
    next(err);
  }
};
