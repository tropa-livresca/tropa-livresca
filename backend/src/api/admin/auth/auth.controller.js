import { AuthService } from "./auth.service.js";

export class AuthController {
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
        user: data?.user
      });
      
    } catch (err) {
      next(err);
    }
  }
}
