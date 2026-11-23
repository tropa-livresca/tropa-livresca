import { AuthModel } from "../../common/models/auth.model.js";

const erroValidacao = (mensagem, statusCode = 400) => {
  const error = new Error(mensagem);
  error.statusCode = statusCode;
  return error;
};

export class AuthService {
  static async esqueciSenha(email) {
    if (!email) {
      throw erroValidacao("O e-mail é obrigatório.");
    }

    return await AuthModel.enviarEmailRecuperacao(email);
  }

  static async confirmarNovaSenha(token, novaSenha) {
    if (!token || !novaSenha) {
      throw erroValidacao("Token e nova senha são obrigatórios.");
    }

    return await AuthModel.confirmarNovaSenha(token, novaSenha);
  }

  static async atualizarSenhaAntiga(email, senhaAntiga, senhaNova) {
    if (!email || !senhaAntiga || !senhaNova) {
      throw erroValidacao("E-mail e senhas são obrigatórios.");
    }

    try {
      await AuthModel.signin(email, senhaAntiga);
      return await AuthModel.atualizarSenha(senhaNova, senhaAntiga);
    } catch (error) {
      error.statusCode = error.statusCode || error.status || 400;
      throw error;
    }
  }

  static async refreshSession() {
    return await AuthModel.refreshSession();
  }

  static async signup(email, password, nome, sobrenome, telefone) {
    if (!email || !password || !nome || !telefone || !sobrenome) {
      throw erroValidacao("Todos os campos são obrigatórios para o cadastro.");
    }

    try {
      return await AuthModel.signup(email, password, nome, sobrenome, telefone);
    } catch (error) {
      if (error.status === 422) {
        throw erroValidacao("O e-mail informado já está cadastrado.");
      }

      error.statusCode = error.statusCode || error.status || 400;
      throw error;
    }
  }

  static async signout() {
    return await AuthModel.signout();
  }

  static async signin(email, password) {
    if (!email || !password) {
      throw erroValidacao("E-mail e senha são obrigatórios.");
    }

    try {
      return await AuthModel.signin(email, password);
    } catch (error) {
      error.statusCode = error.statusCode || error.status || 400;
      throw error;
    }
  }

  static async signinAdmin(email, senhaAdmin) {
    if (!email || !senhaAdmin) {
      throw erroValidacao("E-mail e senha são obrigatórios.");
    }

    const { data: authData, error } = await AuthModel.signinAdmin(
      email,
      senhaAdmin,
    );

    if (error) {
      throw error;
    }

    const primeiroAcesso = await AuthModel.conferirPrimeiroAcesso(
      authData.userId,
    );

    return {
      data: authData,
      user: authData.user,
      primeiroAcesso,
    };
  }

  static async alterarSenhaAdm(userId, novaSenha, senhaAntiga) {
    if (!userId || !novaSenha) {
      throw erroValidacao(
        "ID do usuário e nova senha são obrigatórios para a alteração.",
      );
    }

    return await AuthModel.alterarSenhaAdmin(userId, novaSenha, senhaAntiga);
  }

  static async alterarSenhaAntigaAdm(email, senhaAntiga, novaSenha) {
    if (!email || !senhaAntiga || !novaSenha) {
      throw erroValidacao("E-mail e senhas são obrigatórios.");
    }

    const login = await AuthModel.signinAdmin(email, senhaAntiga);

    if (login.error || !login.data?.userId) {
      throw erroValidacao("Credenciais administrativas inválidas.", 401);
    }

    return await AuthModel.alterarSenhaAdmin(
      login.data.userId,
      novaSenha,
      senhaAntiga,
    );
  }

  static async atualizarSenha(novaSenha, senhaAntiga) {
    if (!novaSenha) {
      throw erroValidacao("Nenhuma nova senha informada.");
    }

    return await AuthModel.atualizarSenha(novaSenha, senhaAntiga);
  }
}
