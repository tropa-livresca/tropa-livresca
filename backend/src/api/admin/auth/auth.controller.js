import { AuthService } from "./auth.service.js";
import supabase from "../../common/config/supabase.js";

export class AuthController {
  static COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }

  static async signin(req, res, next) {
    const { username, senha } = req.body;

    try {
      const data = await AuthService.signInAdministrador(username, senha);

      if (data?.status === "EXIGIR_TROCA_DE_SENHA") {
        return res.status(200).json({
          status: "EXIGIR_TROCA_DE_SENHA",
          userId: data.userId,
          message: "Primeiro acesso detectado. Alteração de senha obrigatória.",
        });
      }

      const sessionData = data?.data;

      return res.status(200).json({
        user: sessionData?.user,
        session: sessionData?.session,
        message: "Login realizado com sucesso!",
      });
    } catch (err) {
      next(err);
    }
  }

  static async atualizarSenha(req, res, next) {
    const userId = req.user?.id || req.body.userId;
    const { novaSenha } = req.body;

    try {
      const data = await AuthService.atualizarSenha(userId, novaSenha);

      return res.status(200).json({
        message: "Senha atualizada com sucesso!",
        user: data?.user,
      });
    } catch (err) {
      next(err);
    }
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
        const { data: userData } =
          await supabase.auth.getUser(finalAccessToken);
        finalUser = userData?.user;
      }

      if (!finalAccessToken || !finalRefreshToken || !finalUser) {
        return res.status(502).json({
          error:
            "Não foi possível finalizar a sessão do Google. Dados insuficientes retornados pelo provedor.",
        });
      }

      res.cookie("auth-token", finalAccessToken, AuthController.COOKIE_OPTIONS);
      res.cookie(
        "refresh-token",
        finalRefreshToken,
        AuthController.COOKIE_OPTIONS,
      );

      return res.json({
        user: finalUser,
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
          error:
            "Os tokens recebidos do Google não são válidos para finalizar a sessão.",
        });
      }

      next(err);
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

  static async signout(req, res, next) {
    try {
      await AuthService.signout();
      res.clearCookie("auth-token", AuthController.COOKIE_OPTIONS);
      res.clearCookie("refresh-token", AuthController.COOKIE_OPTIONS);
      return res.json({ message: "Desconectado com sucesso." });
    } catch (err) {
      next(err);
    }
  }
}
