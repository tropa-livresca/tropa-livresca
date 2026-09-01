import { AuthService } from "./auth.service.js";
import supabase from "../../common/config/supabase.js";

export class AuthController {
  static COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  static async obterDadosUsuarioUnificado(userId) {
    const { data } = await supabase
      .from("users_profile")
      .select("nome, telefone, imagem, descricao, redes_sociais, is_admin, funcao")
      .eq("id", userId)
      .single();
    return data || {};
  }

  static async setSession(req, res, next) {
    const code = req.body.code;
    const accessToken = req.body.accessToken || req.body.access_token;
    const refreshToken = req.body.refreshToken || req.body.refresh_token;

    if (!code && (!accessToken || !refreshToken)) {
      return res.status(400).json({
        error: "Código ou tokens não fornecidos para configuração de sessão.",
      });
    }

    try {
      const data = code
        ? await AuthService.setSessionWithCode(code)
        : await AuthService.setSession(accessToken, refreshToken);

      const finalAccessToken = data?.session?.access_token || accessToken;
      const finalRefreshToken = data?.session?.refresh_token || refreshToken;

      let finalUser = data?.user || data?.session?.user;

      if (!finalUser && finalAccessToken) {
        const { data: userData } = await supabase.auth.getUser(finalAccessToken);
        finalUser = userData?.user;
      }

      if (!finalAccessToken || !finalRefreshToken || !finalUser) {
        return res.status(502).json({
          error: "Não foi possível finalizar a sessão do Google. Dados insuficientes retornados pelo provedor.",
        });
      }

      const dadosPerfil = await AuthController.obterDadosUsuarioUnificado(finalUser.id);
      const usuarioCompleto = { ...finalUser, ...dadosPerfil };

      res.cookie("auth-token", finalAccessToken, AuthController.COOKIE_OPTIONS);
      res.cookie("refresh-token", finalRefreshToken, AuthController.COOKIE_OPTIONS);

      return res.json({
        user: usuarioCompleto,
        session: {
          access_token: finalAccessToken,
          refresh_token: finalRefreshToken,
        },
        message: "Sessão definida com sucesso e cookies configurados.",
      });
    } catch (err) {
      if (
        err?.code === "invalid_jwt" ||
        err?.message?.includes("Invalid JWT") ||
        err?.statusCode === 401
      ) {
        return res.status(401).json({
          error: "Os tokens recebidos não são válidos para finalizar a sessão.",
        });
      }

      return next(err);
    }
  }

  static async refreshSession(req, res, next) {
    const refreshToken = req.cookies["refresh-token"];

    if (!refreshToken) {
      return res.status(401).json({
        error: "Token de atualização não fornecido.",
      });
    }

    try {
      const data = await AuthService.refreshSession(refreshToken);

      res.cookie(
        "auth-token",
        data.session.access_token,
        AuthController.COOKIE_OPTIONS,
      );
      res.cookie(
        "refresh-token",
        data.session.refresh_token,
        AuthController.COOKIE_OPTIONS,
      );

      return res.status(200).json({ message: "Sessão renovada com sucesso." });
    } catch (err) {
      return res.status(err?.statusCode || 401).json({
        error: err?.message || "Não foi possível renovar a sessão.",
      });
    }
  }

  static async signinComGoogle(req, res, next) {
    try {
      const redirectTo =
        req.body?.redirectTo ||
        req.query?.redirectTo ||
        process.env.SUPABASE_AUTH_REDIRECT_URL ||
        `${req.protocol}://${req.get("host")}/auth/callback`;

      const data = await AuthService.signinComGoogle(redirectTo);

      if (!data?.url) {
        return res.status(502).json({
          error: "Não foi possível gerar a URL de autenticação com Google no momento.",
        });
      }

      return res.status(200).json({
        data: { url: data.url },
        message: "Login com Google efetuado com sucesso!",
      });
    } catch (err) {
      return next(err);
    }
  }

  static async signup(req, res, next) {
    try {
      const { email, password, telefone, nome } = req.body;

      const data = await AuthService.signup(email, password, nome, telefone);

      return res.status(201).json({
        data: data,
        message: "Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.",
      });
    } catch (err) {
      return next(err);
    }
  }

  static async signout(req, res, next) {
    try {
      await AuthService.signout();
      res.clearCookie("auth-token", AuthController.COOKIE_OPTIONS);
      res.clearCookie("refresh-token", AuthController.COOKIE_OPTIONS);
      return res.json({ message: "Desconectado com sucesso." });
    } catch (err) {
      return next(err);
    }
  }

  static async signin(req, res, next) {
    try {
      const { email, password } = req.body;

      const data = await AuthService.signin(email, password);

      if (!data || !data.session) {
        return res.status(401).json({ error: "E-mail ou senha incorretos." });
      }

      const dadosPerfil = await AuthController.obterDadosUsuarioUnificado(data.user.id);
      const usuarioCompleto = { ...data.user, ...dadosPerfil };

      res.cookie(
        "auth-token",
        data.session.access_token,
        AuthController.COOKIE_OPTIONS,
      );
      res.cookie(
        "refresh-token",
        data.session.refresh_token,
        AuthController.COOKIE_OPTIONS,
      );

      return res
        .status(200)
        .json({ user: usuarioCompleto, message: "Login realizado com sucesso!" });
    } catch (err) {
      return next(err);
    }
  }

  static async atualizarSenha(req, res, next) {
    try {
      const novaSenha = req.body.novaSenha || req.body.senha;

      const resultado = await AuthService.atualizarSenha(novaSenha);

      return res.status(200).json({
        user: resultado.user,
        message: "Alteração na senha realizada!",
      });
    } catch (err) {
      return next(err);
    }
  }

  static async atualizarSenhaAntiga(req, res, next) {
    try {
      const { senhaAntiga, senhaNova } = req.body;
      const email = req.user?.email;

      await AuthService.atualizarSenhaAntiga(email, senhaAntiga, senhaNova);

      return res.status(200).json({
        message: "Senha alterada com sucesso!",
      });
    } catch (err) {
      return next(err);
    }
  }

  static async esqueciSenha(req, res, next) {
    try {
      const { email } = req.body;

      await AuthService.esqueciSenha(email);

      return res.status(200).json({
        message: "E-mail de recuperação enviado com sucesso! Verifique sua caixa de e-mail.",
      });
    } catch (err) {
      return next(err);
    }
  }

  static async callbackRedefinirSenha(req, res) {
    return res.redirect("https://urban-zebra-r4q9wg546jp2pqjp-5173.app.github.dev/auth/callback");
  }

  static async redefinirSenha(req, res, next) {
    try {
      const { novaSenha, accessToken, refreshToken } = req.body;

      if (!accessToken || !refreshToken) {
        return res.status(401).json({
          error: "Tokens de autenticação ausentes no corpo da requisição.",
        });
      }

      if (!novaSenha) {
        return res.status(400).json({ error: "A nova senha é obrigatória." });
      }

      await AuthService.setSession(accessToken, refreshToken);
      await AuthService.atualizarSenha(novaSenha);

      return res.status(200).json({
        message: "Senha atualizada com sucesso! Voce ja pode fazer login.",
      });
    } catch (err) {
      return next(err);
    }
  }
}
