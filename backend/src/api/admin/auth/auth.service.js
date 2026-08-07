import { AuthModel } from "../../common/models/auth.model.js";

export class AuthService {
  static async signInAdministrador(usernameDigitado, senhaAdm) {
    if (!usernameDigitado || !senhaAdm) {
      const erroCredenciais = new Error("Credenciais não informadas.");
      erroCredenciais.statusCode = 400;
      throw erroCredenciais;
    }

    const emailVirtual = `${usernameDigitado.toLowerCase().trim()}@adm.sistema.internal`;

    try {
      const resultado = await AuthModel.signInAdministrador(
        usernameDigitado.toLowerCase().trim(),
        senhaAdm,
      );

      const userId = resultado?.user?.id;
      
      if (!userId) {
        const erroAuth = new Error("Senha ou usuário incorretos.");
        erroAuth.statusCode = 400;
        throw erroAuth;
      }

      const { data: adm, error: dbError } = await AuthModel.conferirAdministrador(userId);

      if (dbError) {
        const erroBanco = new Error(dbError.message || "Erro interno ao validar permissões.");
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
      const AppError = new Error(error.message || "Erro na autenticação.");
      AppError.statusCode = error.statusCode || 400;
      throw AppError;
    }
  }

  static async atualizarSenha(userId, novaSenha) {
    if (!userId || !novaSenha) {
      const erroCredenciais = new Error("Dados para atualização não fornecidos.");
      erroCredenciais.statusCode = 400;
      throw erroCredenciais;
    }

    const { data, error } = await AuthModel.atualizarSenha(userId, novaSenha);

    if (error) {
      const erroAlteracao = new Error("Erro na alteração da senha.");
      erroAlteracao.statusCode = 400;
      throw erroAlteracao;
    }

    const { error: dbError } = await AuthModel.atualizarPrimeiroAcesso(userId);

    if (dbError) {
      const erroAcesso = new Error("Erro ao atualizar o status de primeiro acesso.");
      erroAcesso.statusCode = 500;
      throw erroAcesso;
    }

    return data;
  }

  static async signout() {
    const { error } = await AuthModel.signout();
    
    if (error) {
      const erroSair = new Error(error.message || "Erro ao encerrar a sessão.");
      erroSair.statusCode = 400;
      throw erroSair;
    }
    
    return true;
  }

  static async setSession(accessToken, refreshToken) {
    const { data, error } = await AuthModel.setSession(accessToken, refreshToken);
    if (error) {
      error.statusCode = 400;
      throw error;
    }
    return data;
  }

  static async refreshSession(refreshToken) {
    if (!refreshToken) {
      const erroToken = new Error("Token de atualização não fornecido.");
      erroToken.statusCode = 401;
      throw erroToken;
    }

    const { data, error } = await AuthModel.refreshSession(refreshToken);

    if (error || !data.session) {
      const erroValidacao = new Error("Token de atualização inválido ou expirado.");
      erroValidacao.statusCode = 401;
      throw erroValidacao;
    }
    return data;
  }
}
