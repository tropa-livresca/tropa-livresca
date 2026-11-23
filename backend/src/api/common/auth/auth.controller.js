import PocketBase from "pocketbase";
import jwt from "jsonwebtoken";

import {
  POCKETBASE_URL,
  FRONTEND_URL,
} from "../../common/config/environment.js";

import { criarClienteAdminPocketBase } from "../../common/config/pocketbase.js";

import {
  mapearCampoArquivo,
  primeiraUrlArquivo,
} from "../models/pocketbase.helpers.js";

const COLECAO_AUTH = "users_profile";

const criarCliente = (token = null) => {
  const pb = new PocketBase(POCKETBASE_URL);

  pb.autoCancellation(false);

  if (token) {
    pb.authStore.save(token, null);
  }

  return pb;
};

export class AuthController {
  static COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  static async obterDadosUsuarioUnificado(userId) {
    const pb = criarClienteAdminPocketBase();

    try {
      const perfil = await pb.collection(COLECAO_AUTH).getOne(userId, {
        fields:
          "id,email,nome,sobrenome,telefone,imagem,descricao,redes_sociais,is_admin,funcao,is_master,primeiro_acesso,verified",
      });

      const imagem = mapearCampoArquivo(pb, perfil, "imagem");

      return {
        ...perfil,
        ...imagem,
        imagem: primeiraUrlArquivo(imagem.imagemUrl),
      };
    } catch (error) {
      if (error.status === 404) {
        return {};
      }

      throw error;
    }
  }

  static async obterUsuarioCompleto(usuario) {
    const perfil = await AuthController.obterDadosUsuarioUnificado(usuario.id);

    return {
      ...usuario,
      ...perfil,
      id: usuario.id,
      email: usuario.email,
    };
  }

  static async callbackRedefinirSenha(req, res) {
    const token = req.query?.token;

    if (!token) {
      return res.redirect(
        `${FRONTEND_URL}/auth/redefinir-senha?erro=token_ausente`,
      );
    }

    return res.redirect(
      `${FRONTEND_URL}/auth/redefinir-senha?token=${encodeURIComponent(token)}`,
    );
  }

  static async signup(req, res, next) {
    try {
      const { email, password, telefone, nome, sobrenome } = req.body;

      const pb = criarCliente();

      const usuario = await pb.collection(COLECAO_AUTH).create({
        email,
        password,
        passwordConfirm: password,
        emailVisibility: false,
        telefone,
        nome,
        sobrenome,
      });

      await pb.collection(COLECAO_AUTH).requestVerification(email);

      return res.status(201).json({
        data: {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
          sobrenome: usuario.sobrenome,
        },
        message:
          "Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const pb = criarCliente();

      const authData = await pb
        .collection(COLECAO_AUTH)
        .authWithPassword(email, password);

      if (!authData.record.verified) {
        pb.authStore.clear();

        return res.status(403).json({
          error: "Confirme seu e-mail antes de entrar.",
        });
      }

      const usuarioCompleto = await AuthController.obterUsuarioCompleto(
        authData.record,
      );

      res.cookie("auth-token", authData.token, AuthController.COOKIE_OPTIONS);

      return res.status(200).json({
        user: usuarioCompleto,
        message: "Login realizado com sucesso!",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async setSession(req, res, next) {
    try {
      const { token } = req.body;

      if (!token || typeof token !== "string") {
        return res.status(400).json({
          error: "Token de autenticação não fornecido.",
        });
      }

      const pb = criarCliente(token);

      const authData = await pb.collection(COLECAO_AUTH).authRefresh();

      if (!authData.record.verified) {
        pb.authStore.clear();

        return res.status(403).json({
          error: "Confirme seu e-mail antes de entrar.",
        });
      }

      const usuarioCompleto = await AuthController.obterUsuarioCompleto(
        authData.record,
      );

      res.cookie("auth-token", authData.token, AuthController.COOKIE_OPTIONS);

      return res.status(200).json({
        user: usuarioCompleto,
        message: "Sessão sincronizada com sucesso.",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async refreshSession(req, res) {
    const token = req.cookies?.["auth-token"];

    if (!token) {
      return res.status(401).json({
        error: "Token de autenticação não fornecido.",
      });
    }

    try {
      const pb = criarCliente(token);

      const authData = await pb.collection(COLECAO_AUTH).authRefresh();

      res.cookie("auth-token", authData.token, AuthController.COOKIE_OPTIONS);

      return res.status(200).json({
        message: "Sessão renovada com sucesso.",
      });
    } catch (error) {
      console.error(error);

      res.clearCookie("auth-token", AuthController.COOKIE_OPTIONS);

      return res.status(401).json({
        error: "Sessão inválida ou expirada.",
      });
    }
  }

  static async getSession(req, res, next) {
    try {
      const usuarioCompleto = await AuthController.obterUsuarioCompleto(
        req.user,
      );

      return res.status(200).json({
        user: usuarioCompleto,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getSessionAdm(req, res) {
    const perfil = req.adm;

    return res.status(200).json({
      user: {
        ...perfil,
        id: req.user.id,
        email: req.user.email,
      },
    });
  }

  static async signinAdm(req, res, next) {
    try {
      const { email, senha } = req.body;

      const pb = criarCliente();

      const authData = await pb
        .collection(COLECAO_AUTH)
        .authWithPassword(email, senha);

      const usuario = authData.record;

      if (!usuario.is_admin) {
        pb.authStore.clear();

        return res.status(403).json({
          error: "Acesso negado. Apenas administradores.",
        });
      }

      const perfil = await AuthController.obterDadosUsuarioUnificado(
        usuario.id,
      );

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          is_admin: usuario.is_admin,
          funcao: usuario.funcao,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        },
      );

      res.cookie("admin-token", token, AuthController.COOKIE_OPTIONS);

      return res.status(200).json({
        user: {
          ...usuario,
          ...perfil,
        },
        primeiroAcesso: usuario.primeiro_acesso,
        message: "Login administrativo realizado com sucesso!",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async signout(_req, res) {
    res.clearCookie("auth-token", AuthController.COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Desconectado com sucesso.",
    });
  }

  static async signoutAdm(_req, res) {
    res.clearCookie("admin-token", AuthController.COOKIE_OPTIONS);

    return res.status(200).json({
      message: "Desconectado com sucesso.",
    });
  }

  static async alterarSenhaAdm(req, res, next) {
    try {
      const userId = req.user?.id;
      const novaSenha = req.body.novaSenha;

      if (!userId || !novaSenha) {
        return res.status(400).json({
          error: "Usuário e nova senha são obrigatórios.",
        });
      }

      const pb = criarClienteAdminPocketBase();

      await pb.collection(COLECAO_AUTH).update(userId, {
        password: novaSenha,
        passwordConfirm: novaSenha,
        primeiro_acesso: false,
      });

      return res.status(200).json({
        message: "Senha administrativa alterada com sucesso.",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async alterarSenhaAntiga(req, res, next) {
    try {
      const { email, senhaAntiga, novaSenha } = req.body;

      const pb = criarCliente();

      await pb.collection(COLECAO_AUTH).authWithPassword(email, senhaAntiga);

      const userId = pb.authStore.record.id;

      await pb.collection(COLECAO_AUTH).update(userId, {
        oldPassword: senhaAntiga,
        password: novaSenha,
        passwordConfirm: novaSenha,
      });

      return res.status(200).json({
        message: "Senha alterada com sucesso!",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async atualizarSenha(req, res, next) {
    try {
      const novaSenha = req.body.novaSenha || req.body.senha;
      const token = req.cookies?.["auth-token"];

      if (!token) {
        return res.status(401).json({
          error: "Sessão não encontrada.",
        });
      }

      if (!novaSenha) {
        return res.status(400).json({
          error: "Nova senha não fornecida.",
        });
      }

      const pb = criarCliente(token);

      const authData = await pb.collection(COLECAO_AUTH).authRefresh();

      const usuario = await pb
        .collection(COLECAO_AUTH)
        .update(authData.record.id, {
          password: novaSenha,
          passwordConfirm: novaSenha,
        });

      return res.status(200).json({
        user: usuario,
        message: "Alteração na senha realizada!",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async atualizarSenhaAntiga(req, res, next) {
    try {
      const { senhaAntiga, senhaNova } = req.body;
      const token = req.cookies?.["auth-token"];

      if (!token) {
        return res.status(401).json({
          error: "Sessão não encontrada.",
        });
      }

      const pb = criarCliente(token);

      const authData = await pb.collection(COLECAO_AUTH).authRefresh();

      await pb.collection(COLECAO_AUTH).update(authData.record.id, {
        oldPassword: senhaAntiga,
        password: senhaNova,
        passwordConfirm: senhaNova,
      });

      return res.status(200).json({
        message: "Senha alterada com sucesso!",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async esqueciSenha(req, res, next) {
    try {
      const { email } = req.body;

      const pb = criarCliente();

      await pb.collection(COLECAO_AUTH).requestPasswordReset(email);

      return res.status(200).json({
        message:
          "Se o endereço estiver cadastrado, você receberá um e-mail para redefinir a senha.",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async redefinirSenha(req, res, next) {
    try {
      const { token, novaSenha } = req.body;

      if (!token || !novaSenha) {
        return res.status(400).json({
          error: "Token e nova senha são obrigatórios.",
        });
      }

      const pb = criarCliente();

      await pb
        .collection(COLECAO_AUTH)
        .confirmPasswordReset(token, novaSenha, novaSenha);

      return res.status(200).json({
        message: "Senha atualizada com sucesso! Você já pode fazer login.",
      });
    } catch (error) {
      return next(error);
    }
  }

  static async confirmarEmail(req, res, next) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          error: "Token de confirmação não fornecido.",
        });
      }

      const pb = criarCliente();

      await pb.collection(COLECAO_AUTH).confirmVerification(token);

      return res.status(200).json({
        message: "E-mail confirmado com sucesso!",
      });
    } catch (error) {
      return next(error);
    }
  }
}
