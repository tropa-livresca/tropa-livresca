import jwt from "jsonwebtoken";
import {
  criarClientePocketBase,
  criarClienteAdminPocketBase,
} from "../config/pocketbase.js";

const COLECAO_AUTH = "users";
const COLECAO_PERFIL = "users_profile";

const buscarPerfilAdmin = async (userId) => {
  const pb = criarClienteAdminPocketBase();

  const filtro = pb.filter("auth_user = {:userId}", {
    userId,
  });

  return await pb.collection(COLECAO_PERFIL).getFirstListItem(filtro, {
    fields: "id,auth_user,is_admin,is_master,primeiro_acesso",
  });
};

// Autenticação comum
export const checkAuth = async (req, res, next) => {
  const token = req.cookies?.["auth-token"];

  if (!token) {
    return res.status(401).json({
      error: "Token de autenticação não fornecido.",
    });
  }

  try {
    // Cada requisição utiliza uma instância independente.
    const pb = criarClientePocketBase();

    pb.authStore.save(token, null);

    // Valida o token diretamente no PocketBase.
    const { record } = await pb.collection(COLECAO_AUTH).authRefresh();

    req.user = record;

    return next();
  } catch (err) {
    console.error("Erro ao verificar autenticação:", err);

    if (err.status === 401 || err.status === 403) {
      return res.status(401).json({
        error: "Token de autenticação inválido ou expirado.",
      });
    }

    return res.status(500).json({
      error: "Erro ao verificar autenticação.",
    });
  }
};

// Autenticação administrativa
export const verificarAutenticacaoAdm = async (req, res, next) => {
  const token = req.cookies?.["admin-token"];

  if (!token) {
    return res.status(401).json({
      error: "Sessão administrativa não encontrada.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.is_admin || !decoded.id) {
      return res.status(403).json({
        error: "Acesso restrito a administradores.",
      });
    }

    const adm = await buscarPerfilAdmin(decoded.id);

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

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Sessão administrativa inválida ou expirada.",
      });
    }

    if (err.status === 404) {
      return res.status(403).json({
        error: "Administrador não encontrado.",
      });
    }

    return res.status(500).json({
      error: "Erro ao verificar sessão administrativa.",
    });
  }
};

// Autenticação administrativa Master
export const verificarAutenticacaoAdmMaster = async (req, res, next) => {
  const token = req.cookies?.["admin-token"];

  if (!token) {
    return res.status(401).json({
      error: "Não autenticado.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.is_admin || !decoded.id) {
      return res.status(403).json({
        error: "Acesso restrito a administradores Master.",
      });
    }

    const adm = await buscarPerfilAdmin(decoded.id);

    if (!adm.is_admin) {
      return res.status(403).json({
        error: "Usuário não possui privilégios de administrador.",
      });
    }

    if (!adm.is_master) {
      return res.status(403).json({
        error: "Usuário não possui privilégios de administrador Master.",
      });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    req.adm = adm;

    return next();
  } catch (err) {
    console.error("Erro na sessão do administrador Master:", err);

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Sessão administrativa inválida ou expirada.",
      });
    }

    if (err.status === 404) {
      return res.status(403).json({
        error: "Administrador não encontrado.",
      });
    }

    return res.status(500).json({
      error: "Erro ao verificar sessão administrativa.",
    });
  }
};
