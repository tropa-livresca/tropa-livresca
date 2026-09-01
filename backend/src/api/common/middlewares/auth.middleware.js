import supabase from "../config/supabase.js";

export const checkAuth = async (req, res, next) => {
  const token = req.cookies["auth-token"];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de autenticação não fornecido." });
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Token de autenticação inválido." });
    }

    req.user = data.user;
    return next();
  } catch (err) {
    console.error("Erro ao verificar autenticação:", err);
    return res.status(500).json({ error: "Erro ao verificar autenticação." });
  }
};

export const verificarAutenticacaoAdm = async (req, res, next) => {
  // AJUSTE: Tenta pegar o token do Header. Se não existir, pega do Cookie.
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies["auth-token"]) {
    token = req.cookies["auth-token"];
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de acesso não fornecido ou inválido." });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Sessão expirada ou inválida." });
    }

    const { data: adm, error: dbError } = await supabase
      .from("users_profile")
      .select("is_admin, funcao")
      .eq("id", user.id)
      .single();

    if (dbError || !adm || !adm.is_admin) {
      return res.status(403).json({
        error: "Acesso negado: Recursos restritos a administradores ativos.",
      });
    }

    req.user = user;
    req.adm = adm;

    next();
  } catch (err) {
    next(err);
  }
};

export const verificarAutenticacaoAdmMaster = async (req, res, next) => {
  // AJUSTE: Tenta pegar o token do Header. Se não existir, pega do Cookie.
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies["auth-token"]) {
    token = req.cookies["auth-token"];
  }

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de acesso não fornecido ou inválido." });
  }

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Sessão expirada ou inválida." });
    }

    const { data: adm, error: dbError } = await supabase
      .from("users_profile")
      .select("is_admin, funcao")
      .eq("id", user.id)
      .single();

    if (dbError || !adm || !adm.is_admin || adm.funcao !== "master") {
      return res.status(403).json({
        error: "Acesso negado: Recursos restritos a administradores ativos.",
      });
    }

    req.user = user;
    req.adm = adm;

    next();
  } catch (err) {
    next(err);
  }
};
