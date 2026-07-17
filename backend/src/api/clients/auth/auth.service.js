import * as authService from "./auth.service.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
};

export const setSession = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.body;
    
    const data = await authService.setSessionService({ accessToken, refreshToken });

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res.status(200).json({
      user: data.user,
      message: "Sessão definida com sucesso e cookies configurados.",
    });
  } catch (err) {
    next(err);
  }
};

export const refreshSession = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refresh-token"];
    
    const data = await authService.refreshSessionService(refreshToken);

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res.status(200).json({ message: "Sessão renovada com sucesso." });
  } catch (err) {
    next(err);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { email, password, telefone, nome } = req.body;
    
    const data = await authService.signupService({ email, password, telefone, nome });

    return res.status(201).json({
      user: data.user,
      message: "Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar o e-mail.",
    });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const data = await authService.signinService({ email, password });

    res.cookie("auth-token", data.session.access_token, COOKIE_OPTIONS);
    res.cookie("refresh-token", data.session.refresh_token, COOKIE_OPTIONS);

    return res.status(200).json({ user: data.user, message: "Login realizado com sucesso!" });
  } catch (err) {
    next(err);
  }
};

export const signout = async (req, res, next) => {
  try {
    await authService.signoutService();
    
    res.clearCookie("auth-token", COOKIE_OPTIONS);
    res.clearCookie("refresh-token", COOKIE_OPTIONS);
    
    return res.status(200).json({ message: "Desconectado com sucesso." });
  } catch (err) {
    next(err);
  }
};
