import { AuthModel } from "../../common/models/auth.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const ALGORITMO = "aes-256-gcm";
const CHAVE_SECRETA = Buffer.from(process.env.MINHA_CHAVE_SUPER_SECRETA, "hex");
const JWT_SECRET = process.env.JWT_SECRET;

export class AuthService {
  static _descriptografar(textoCriptografado) {
    const [ivHex, tagHex, dadoHex] = textoCriptografado.split(":");
    const decoder = crypto.createDecipheriv(
      ALGORITMO,
      CHAVE_SECRETA,
      Buffer.from(ivHex, "hex"),
    );
    decoder.setAuthTag(Buffer.from(tagHex, "hex"));

    let limpo = decoder.update(dadoHex, "hex", "utf8");
    limpo += decoder.final("utf8");
    return limpo;
  }

  static _criptografar(texto) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITMO, CHAVE_SECRETA, iv);

    let criptografado = cipher.update(texto, "utf-8", "hex");
    criptografado += cipher.final("hex");

    const tag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${tag}:${criptografado}`;
  }

  static async autenticar(username, senha) {
    const usuario = await AuthModel.buscarPorUsername(username);
    if (!usuario) return { autenticado: false };

    let senhaSalvaTextoPlano;

    try {
      senhaSalvaTextoPlano = this._descriptografar(usuario.senha_criptografada);
    } catch (err) {
      throw new Error("Falha crítica de descriptografia");
    }

    if (senha !== senhaSalvaTextoPlano) return { autenticado: false };

    if (usuario.forcar_troca_senha) {
      return { status: "Troca_obrigatoria", userId: usuario.user_id };
    }

    const token = jwt.sign(
      {
        id: usuario.user_id,
        username: usuario.username,
        funcao: usuario.funcao,
      },
      JWT_SECRET,
      { expiresIn: "8h" },
    );

    return {
      status: "Sucesso",
      token,
      usuario: {
        id: usuario.user_id,
        nome: usuario.nome_completo,
        username: usuario.username,
        funcao: usuario.funcao,
      },
    };
  }

  static async trocarSenhaObrigatoria(userId, novaSenha) {
    const senhaCripto = this._criptografar(novaSenha);
    return await AuthModel.atualizarSenha(userId, senhaCripto);
  }
}
