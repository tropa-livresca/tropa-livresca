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
    next();
  } catch (err) {
    err.status(500).json({ error: "Erro ao verificar autenticação." });
    next(err);
  }
};

export const verificarAutenticacaoAdm = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token de acesso não fornecido ou inválido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Sessão expirada ou inválida." });
    }

    const { data: adm, error: dbError } = await supabase
      .from("adm_credenciais")
      .select("funcao, ativo")
      .eq("id", user.id)
      .single();

    if (dbError || !adm || !adm.ativo) {
      return res
        .status(403)
        .json({
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
