import { supabaseAdmin } from "../config/supabase.js";
import { LIVRO_ESTADO } from "../config/livro-estados.js";
import nodemailer from "nodemailer";

export class UsuariosModel {
  static async buscarUsuarios({
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
    filtro = "",
  }) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabaseAdmin
      .from("users_profile")
      .select("*, livros(estado, ativo)", { count: "exact" });

    if (filtro === "funcionario") {
      query = query.eq("is_admin", true);
    } else if (filtro === "cliente") {
      query = query.eq("is_admin", false);
    }

    if (busca) {
      query = query.ilike("nome", `%${busca}%`);
    }

    const isAsc = ordem === "ascendente";
    query = query.order("nome", { ascending: isAsc });

    let { data, error, count } = await query;

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    let usuariosFormatados =
      data?.map((usuario) => {
        const temLivroPublicado =
          Array.isArray(usuario.livros) &&
          usuario.livros.some(
            (livro) =>
              livro.estado === LIVRO_ESTADO.PUBLICADO && livro.ativo === true,
          );

        return {
          id: usuario.id,
          nome: usuario.nome,
          isAdmin: !!usuario.is_admin,
          isAutor: temLivroPublicado,
          redes_sociais: usuario.redes_sociais,
          primeiro_acesso: usuario.primeiro_acesso,
        };
      }) || [];

    if (filtro === "autor") {
      usuariosFormatados = usuariosFormatados.filter((u) => u.isAutor);
      count = usuariosFormatados.length;
    }

    const dadosPaginados = usuariosFormatados.slice(start, end + 1);

    return {
      data: dadosPaginados,
      count: count || 0,
    };
  }

  static async buscarUsuarioById(usuarioId) {
    if (!usuarioId) return null;

    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .select("*, livros(*), revisoes(*)")
      .eq("id", usuarioId)
      .maybeSingle();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    return data;
  }

  static async enviarEmail(dadosMail) {
    const porta = Number(process.env.SMTP_PORT || 465);

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      const erro = new Error("Configuração de SMTP incompleta no backend.");
      erro.statusCode = 500;
      throw erro;
    }

    try {
      const transporte = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: porta,
        secure: porta === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        family: 4,
      });

      return await transporte.sendMail({
        ...dadosMail,
        from: `"Administração Tropa Livresca" <${process.env.SMTP_USER}>`,
      });
    } catch (erro) {
      console.error("[UsuariosModel:enviarEmail] Erro ao enviar email:", {
        message: erro?.message,
        code: erro?.code,
        command: erro?.command,
        responseCode: erro?.responseCode,
        response: erro?.response,
      });

      erro.statusCode = 500;
      throw erro;
    }
  }

  static async promoverUsuario(usuarioId) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({ is_admin: true })
      .select()
      .eq("id", usuarioId)
      .single();

    if (error) {
      error.statusCode = 500;
      throw error;
    }

    const titulo = String("Promoção a Administrador");

    const dadosMail = {
      from: `"Tropa Livresca" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: titulo,
      text: `Olá ${data.nome},\n\nParabéns! Você foi promovido a Administrador da Tropa Livresca.\n O usuário é: ${data.email}\n A senha é: Senh@Adm123!\n\nAtenciosamente,\nEquipe Tropa Livresca`,
      html: `<p>Olá ${data.nome},</p><p>Parabéns! Você foi promovido a <strong>Administrador</strong> da Tropa Livresca.</p><p>O usuário é: ${data.email}</p><p>A senha de primeiro acesso é: Senh@Adm123!</p><p>Atenciosamente,<br/>Equipe Tropa Livresca</p>`,
    };

    await this.enviarEmail(dadosMail);

    return data;
  }

  static async inativarFuncionario(funcionarioId) {
    const { data, error } = await supabaseAdmin
      .from("users_profile")
      .update({
        is_admin: false,
        is_master: false,
      })
      .eq("id", funcionarioId)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      const erroRegistro = new Error(
        "Nenhum perfil foi encontrado para atualização.",
      );
      erroRegistro.statusCode = 404;
      throw erroRegistro;
    }

    const titulo = String("Remoção de Privilégios de Administrador");

    const dadosMail = {
      from: `"Tropa Livresca" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: titulo,
      text: `Olá ${data.nome},\n\nLamentamos informar que seus privilégios de Administrador foram removidos da Tropa Livresca.\n\nAtenciosamente,\nEquipe Tropa Livresca`,
      html: `<p>Olá ${data.nome},</p><p>Lamentamos informar que seus privilégios de <strong>Administrador</strong> foram removidos da Tropa Livresca.</p><p>O usuário é: ${data.email}</p><p>Atenciosamente,<br/>Equipe Tropa Livresca</p>`,
    };

    await this.enviarEmail(dadosMail);

    return data;
  }
}
