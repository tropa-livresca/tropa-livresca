import { AuthModel } from "../../common/models/auth.model.js";

export class AuthService {
  static async signInAdministrador(usernameDigitado, senhaAdm) {
    if (!usernameDigitado || !senhaAdm) {
      const erroCredenciais = new Error("Credenciais não informadas.");
      erroCredenciais.statusCode = 400;
      throw erroCredenciais;
    }

    try {
      const resultado = await AuthModel.signInAdministrador(
        usernameDigitado,
        senhaAdm,
      );

      const userId = resultado?.data?.user?.id;
      if (!userId) {
        const erroAuth = new Error("Senha ou usuário incorretos.");
        erroAuth.statusCode = 400;
        throw erroAuth;
      }

      const { data: adm, error: dbError } =
        await AuthModel.conferirAdministrador(userId);

      if (dbError) {
        const erroBanco = new Error("Erro interno ao validar permissões.");
        erroBanco.statusCode = 500;
        throw erroBanco;
      }

      if (!adm || !adm.ativo) {
        const erroValidacao = new Error("Senha ou usuário incorretos.");
        erroValidacao.statusCode = 400;
        throw erroValidacao;
      }

      if (adm.primeiro_acesso) {
        return {
          status: "EXIGIR_TROCA_DE_SENHA",
          userId: userId,
        };
      }

      return resultado;
    } catch (error) {
      error.statusCode = error.statusCode || 400;
      throw error;
    }
  }

  static async atualizarSenha(userId, novaSenha) {
    if (!userId || !novaSenha) {
      const erroCredenciais = new Error(
        "Dados para atualização não fornecidos.",
      );
      erroCredenciais.statusCode = 400;
      throw erroCredenciais;
    }

    const { data, error } = await AuthModel.atualizarSenha(novaSenha);

    if (error) {
      const erroAlteracao = new Error("Erro na alteração da senha.");
      erroAlteracao.statusCode = 400;
      throw erroAlteracao;
    }

    const { error: dbError } = await AuthModel.atualizarPrimeiroAcesso(userId);

    if (dbError) {
      const erroAcesso = new Error(
        "Erro ao atualizar o status de primeiro acesso.",
      );
      erroAcesso.statusCode = 500;
      throw erroAcesso;
    }

    return data;
  }
}
