import jwt from "jsonwebtoken";
import { AuthModel } from "../models/auth.model.js";

const erroValidacao = (mensagem, statusCode = 400) => {
  const error = new Error(mensagem);
  error.statusCode = statusCode;
  return error;
};

export class AuthService {
  static async signinAdm(email, senha) {
    const resultado = await AuthModel.signinAdmin(email, senha);

    const { userId, user } = resultado.data;

    const token = jwt.sign(
      {
        id: userId,
        email: user.email,
        is_admin: user.is_admin,
        is_master: user.is_master,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    return {
      token,
      user,
      primeiroAcesso: user.primeiro_acesso,
    };
  }

  static async alterarSenhaAdm(userId, novaSenha, senhaAntiga) {
    if (!userId || !novaSenha) {
      const error = new Error("Usuário e nova senha são obrigatórios.");

      error.statusCode = 400;
      throw error;
    }

    return await AuthModel.alterarSenhaAdmin(userId, novaSenha, senhaAntiga);
  }

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
static async alterarSenhaAdm(userId, novaSenha) {
  if (!userId || !novaSenha) {
    throw erroValidacao("Usuário e nova senha são obrigatórios.");
  }

  if (typeof novaSenha !== "string" || novaSenha.length < 8) {
    throw erroValidacao(
      "A nova senha deve possuir pelo menos 8 caracteres.",
    );
  }

  return await AuthModel.alterarSenhaAdmin(
    userId,
    novaSenha,
    null,
  );
}

static async alterarSenhaAntiga(userId, senhaAntiga, novaSenha) {
  if (!userId || !senhaAntiga || !novaSenha) {
    throw erroValidacao(
      "Usuário e senhas são obrigatórios.",
    );
  }

  if (typeof novaSenha !== "string" || novaSenha.length < 8) {
    throw erroValidacao(
      "A nova senha deve possuir pelo menos 8 caracteres.",
    );
  }

  return await AuthModel.alterarSenhaAdmin(
    userId,
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
