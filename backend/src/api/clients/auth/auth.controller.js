import { AuthService } from "./auth.service.js";

export class AuthController {
  static COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  static async setSession(req, res, next) {
    const { accessToken, refreshToken } = req.body;
    try {
      const data = await AuthService.setSession(accessToken, refreshToken);

      res.cookie("auth-token", data.session.access_token, AuthController.COOKIE_OPTIONS);
      res.cookie("refresh-token", data.session.refresh_token, AuthController.COOKIE_OPTIONS);

      return res.json({
        user: data.user,
        message: "Sessão definida com sucesso e cookies configurados.",
      });
    } catch (err) {
      next(err);
    }
  }

  static async refreshSession(req, res, next) {
    const refreshToken = req.cookies["refresh-token"];
    try {
      const data = await AuthService.refreshSession(refreshToken);

      res.cookie("auth-token", data.session.access_token, AuthController.COOKIE_OPTIONS);
      res.cookie("refresh-token", data.session.refresh_token, AuthController.COOKIE_OPTIONS);

      return res.status(200).json({ message: "Sessão renovada com sucesso." });
    } catch (err) {
      next(err);
    }
  }

  static async signup(req, res, next) {
    const { email, password, telefone, nome } = req.body;
    try {
      const data = await AuthService.signup(email, password, nome, telefone);

      return res.status(201).json({
        user: data.user,
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

      res.cookie("auth-token", data.session.access_token, AuthController.COOKIE_OPTIONS);
      res.cookie("refresh-token", data.session.refresh_token, AuthController.COOKIE_OPTIONS);

      return res.status(200).json({ user: data.user, message: "Login realizado com sucesso!" });
    } catch (err) {
      next(err);
    }
  }
}
