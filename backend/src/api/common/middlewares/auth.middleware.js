import supabase from "../config/supabase.js";
import jwt from "jsonwebtoken";

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
  const token = req.cookies?.["admin-token"];

  if (!token) {
    return res.status(401).json({
      error: "Sessão administrativa não encontrada.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.is_admin) {
      return res.status(403).json({
        error: "Acesso restrito a administradores.",
      });
    }

    const { data: adm, error } = await supabase
      .from("users_profile")
      .select("is_admin, is_master, senha_adm, primeiro_acesso")
      .eq("id", decoded.id)
      .single();

    if (error) {
      console.error("ERRO AO BUSCAR ADMIN:", error);

      return res.status(500).json({
        error: "Erro ao consultar administrador.",
        details: error.message,
      });
    }

    if (!adm) {
      return res.status(403).json({
        error: "Administrador não encontrado.",
      });
    }

    if (!adm.is_admin) {
      return res.status(403).json({
        error: "Usuário não possui privilégios de administrador.",
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    req.adm = adm;

    return next();
  } catch (err) {
    console.error("Erro ao validar admin-token:", err);

    return res.status(401).json({
      error: "Sessão administrativa inválida ou expirada.",
    });
  }
};

export const verificarAutenticacaoAdmMaster = async (req, res, next) => {
  const token = req.cookies?.["admin-token"];

  if (!token) {
    return res.status(401).json({
      error: "Não autenticado.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.is_admin) {
      return res.status(403).json({
        error: "Acesso restrito a administradores Master.",
      });
    }

    const { data: adm, error } = await supabase
      .from("users_profile")
      .select("is_admin, is_master, senha_adm, primeiro_acesso")
      .eq("id", decoded.id)
      .single();

    if (error) {
      console.error("ERRO AO BUSCAR ADMIN:", error);

      return res.status(500).json({
        error: "Erro ao consultar administrador.",
        details: error.message,
      });
    }

    if (!adm) {
      return res.status(403).json({
        error: "Administrador não encontrado.",
      });
    }

    if (!adm.is_admin) {
      return res.status(403).json({
        error: "Usuário não possui privilégios de administrador.",
      });
    }

    if (!adm.is_master) {
      return res.status(403).json({
        error: "Usuário não possui privil[efio de administrador master.",
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    req.adm = adm;

    return next();
  } catch (err) {
    console("Erro na sessão do adm master", err);

    return res.status(401).json({
      error: "Sessão administrativa inválida ou expirada.",
    });
  }
};
