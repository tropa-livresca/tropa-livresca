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

      res.cookie(
        "auth-token",
        finalAccessToken,
        AuthController.COOKIE_OPTIONS,
      );
      res.cookie(
        "refresh-token",
        finalRefreshToken,
        AuthController.COOKIE_OPTIONS,
      );

      return res.json({
        user: finalUser,
        session: {
          access_token: finalAccessToken,
          refresh_token: finalRefreshToken
        },
        message: "Sessão definida com sucesso e cookies configurados.",
      });     
    } catch (err) {
      if (err?.code === "invalid_jwt" || err?.message?.includes("Invalid JWT") || err?.statusCode === 401) {
        return res.status(401).json({
          error: "Os tokens recebidos do Google não são válidos para finalizar a sessão.",
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
      res.status(err?.statusCode || 401).json({
        error: err?.message || "Não foi possível renovar a sessão.",
      });

      next(err);
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
      next(err);
    }
  }

  static async signup(req, res, next) {
    const { email, password, telefone, nome } = req.body;
    try {
      const data = await AuthService.signup(email, password, nome, telefone);

      return res.status(201).json({
        data: data,
        message: "Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.",
      });
    } catch (err) {
      next(err);
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

  static async signin(req, res, next) {
    const { email, password } = req.body;
    try {
      const data = await AuthService.signin(email, password);

      if (!data || !data.session) {
        const error = new Error("E-mail ou senha incorretos.");
        error.statusCode = 401;
        throw error;
      }

      res.cookie("auth-token", data.session.access_token, this.COOKIE_OPTIONS);
      res.cookie("refresh-token", data.session.refresh_token, this.COOKIE_OPTIONS);

      return res
        .status(200)
        .json({ user: data.user, message: "Login realizado com sucesso!" });
    } catch (err) {
      next(err);
    }
  }

  static async atualizarSenha(req, res, next) {
    const { senha } = req.body;

    try {
      const resultado = await AuthService.atualizarSenha(senha);

      return res.status(200).json({
        user: resultado.user,
        message: "Alteração na senha realizada!",
      });
    } catch (err) {
      next(err);
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
      next(err);
    }
  }

  static async redefinirSenha(req, res, next) {
    try {
      const { accessToken, refreshToken, novaSenha } = req.body;

      await AuthService.confirmarNovaSenha(
        accessToken,
        refreshToken,
        novaSenha,
      );

      return res.status(200).json({
        message: "Senha atualizada com sucesso! Você já pode fazer login.",
      });
    } catch (err) {
      next(err);
    }
  }
}
