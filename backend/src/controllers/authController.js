import { supabaseAdmin } from "../config/supabase";

/**
 * @typedef {Object} RegisterResponse
 * @property {boolean} sucess - Indica se a operação foi realizada com sucesso
 * @property {Object} [User] - Os dados do usuário criado
 * @property {string[] [errors]} - Lista de mensagens de erro
 * @returns
 */

/**
 * Controller para registro de novos usuários via Admin SDK
 *
 * @param {import('express').Request} req - Objeto de requisição
 * @param {import('express').Response} res - Objeto de resposta
 * @returns {Promise<Import('express').Response<RegisterResponse>>}
 */
export const registerUser = async (req, res) => {
  /**
   * @type {{email: string, password: string}}
   */
  const { email, password, telefone, nome } = req.body;
  const erros = [];

  try {
    if (!email ) erros.push("O e-mail é obrigatório.");
    if (!password || password.length < 8)
      erros.push("A senha deve ter mais de 8 caracteres.");

    /**
     * Busca a lista de usuários para validar duplicidade
     */
    const {
      data: { users },
      error: listError,
    } = await supabaseAdmin.auth.admin.listUsers();
 
    if (users.some((u) => u.email === email)) {
      erros.push("Este usuário já está cadastrado.");
    }

    if (erros.length > 0) {
      return res.status(400).json({ success: false, errors: erros });
    }

    const { data, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        options: {data: {nome, telefone}},
        email_confirm: true,
      });

    if (createError) throw createError;

    return res.status(201).json({ success: true, user: data.user });
  } catch (err) {
    return res.status(500).json({ errors: ["Erro interno no servidor."] });
  }
};
