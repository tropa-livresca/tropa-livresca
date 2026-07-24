import { AuthService } from "./auth.service.js";

export class AuthController {
  static async signin(req, res) {
    try {
      const { username, senha } = req.body;

      if (!username || !senha) {
        return res
          .status(400)
          .json({ error: "Username e senha são obrigatórios." });
      }

      const resultado = await AuthService.autenticar(username, senha);

      if (resultado.autenticado === false || resultado.status === undefined) {
        return res.status(401).json({ error: "Usuário ou senha incorretos." });
      }

      if (resultado.status === "Troca_obrigatoria") {
        return res.status(200).json({
          status: "Troca_obrigatoria",
          message:
            "Primeiro acesso detectado. Altere sua senha antes de prosseguir.",
          userId: resultado.userId,
        });
      }

      return res.status(200).json({
        status: "Sucesso",
        token: resultado.token,
        usuario: resultado.usuario,
      });
    } catch (err) {
      return res.status(500).json({
        error: "Erro interno no servidor ao tentar efetuar login",
      });
    }
  }

  static async atualizarSenhaPrimeiroAcesso(req, res) {
    try {
      const { userId, novaSenha } = req.body;

      if (!userId || !novaSenha) {
        return res
          .status(400)
          .json({ error: "Id do usuário e nova são obrigatórias." });
      }

      await AuthService.trocarSenhaObrigatoria(userId, novaSenha);

      return res.status(200).json({
        status: "Sucesso",
        message: "Senha atualizada com sucesso pelo utilitário.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro interno ao atualizar a senha do utilitário." });
    }
  }
}
