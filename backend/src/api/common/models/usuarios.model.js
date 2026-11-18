import { LIVRO_ESTADO } from "../config/livro-estados.js";
import {
  criarClienteModel,
  getListPocketBase,
  marcarErro,
} from "./pocketbase.helpers.js";
import nodemailer from "nodemailer";

const COLECAO_PERFIL = "users_profile";

async function buscarLivrosPorPerfis(pb, perfis) {
  if (!perfis.length) return [];
  const clauses = perfis.map(
    (_, index) => `fk_user_profile_id = {:id${index}}`,
  );
  const params = Object.fromEntries(
    perfis.map((perfil, index) => [`id${index}`, perfil.id]),
  );
  return pb.collection("livros").getFullList({
    filter: pb.filter(clauses.join(" || "), params),
  });
}

export class UsuariosModel {
  static async buscarUsuarios({
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
    filtro = "",
  }) {
    const pb = criarClienteModel();
    const filtros = [];
    const params = {};

    if (filtro === "funcionario") filtros.push("is_admin = true");
    if (filtro === "cliente") filtros.push("is_admin = false");
    if (busca) {
      filtros.push("nome ~ {:busca}");
      params.busca = busca;
    }

    try {
      const resultado = await getListPocketBase(pb.collection(COLECAO_PERFIL), {
        page,
        limit,
        filter: filtros.length ? pb.filter(filtros.join(" && "), params) : "",
        sort: ordem === "ascendente" ? "nome" : "-nome",
      });
      const livros = await buscarLivrosPorPerfis(pb, resultado.items);
      const livrosPorPerfil = new Map();
      for (const livro of livros) {
        const lista = livrosPorPerfil.get(livro.fk_user_profile_id) || [];
        lista.push(livro);
        livrosPorPerfil.set(livro.fk_user_profile_id, lista);
      }

      let usuariosFormatados = resultado.items.map((usuario) => {
        const livrosUsuario = livrosPorPerfil.get(usuario.id) || [];
        const temLivroPublicado = livrosUsuario.some(
          (livro) =>
            livro.estado === LIVRO_ESTADO.PUBLICADO && livro.ativo === true,
        );
        const nomeCompleto = `${usuario.nome || ""} ${
          usuario.sobrenome || ""
        }`.trim();
        return {
          id: usuario.id,
          nome: nomeCompleto,
          nomeCompleto,
          sobrenome: usuario.sobrenome || "",
          imagem: usuario.imagem || null,
          isAdmin: !!usuario.is_admin,
          isAutor: temLivroPublicado,
          redes_sociais: usuario.redes_sociais,
          primeiro_acesso: usuario.primeiro_acesso,
        };
      });

      let count = resultado.totalItems;
      if (filtro === "autor") {
        const todosPerfis = await pb.collection(COLECAO_PERFIL).getFullList();
        const todosLivros = await buscarLivrosPorPerfis(pb, todosPerfis);
        const autores = new Set(
          todosLivros
            .filter(
              (livro) => livro.ativo && livro.estado === LIVRO_ESTADO.PUBLICADO,
            )
            .map((livro) => livro.fk_user_profile_id),
        );
        const filtrados = todosPerfis
          .filter(
            (perfil) =>
              autores.has(perfil.id) &&
              (!busca ||
                perfil.nome.toLowerCase().includes(busca.toLowerCase())),
          )
          .sort(
            (a, b) =>
              String(a.nome).localeCompare(String(b.nome)) *
              (ordem === "ascendente" ? 1 : -1),
          );
        count = filtrados.length;
        const start = (Math.max(1, Number(page) || 1) - 1) * limit;
        usuariosFormatados = filtrados
          .slice(start, start + limit)
          .map((u) => {
            const nomeCompleto = `${u.nome || ""} ${
              u.sobrenome || ""
            }`.trim();
            return {
              id: u.id,
              nome: nomeCompleto,
              nomeCompleto,
              sobrenome: u.sobrenome || "",
              imagem: u.imagem || null,
              isAdmin: !!u.is_admin,
              isAutor: true,
              redes_sociais: u.redes_sociais,
              primeiro_acesso: u.primeiro_acesso,
            };
          });
      }

      return { data: usuariosFormatados, count };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarUsuarioById(usuarioId) {
    if (!usuarioId) return null;
    const pb = criarClienteModel();

    try {
      const usuario = await pb.collection(COLECAO_PERFIL).getOne(usuarioId);
      const [livros, revisoes] = await Promise.all([
        pb.collection("livros").getFullList({
          filter: pb.filter("fk_user_profile_id = {:usuarioId}", {
            usuarioId,
          }),
        }),
        pb.collection("revisoes").getFullList({
          filter: pb.filter("fk_user_profile_id = {:usuarioId}", {
            usuarioId,
          }),
        }),
      ]);
      return { ...usuario, livros, revisoes };
    } catch (error) {
      if (error.status === 404) return null;
      marcarErro(error);
    }
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
    const pb = criarClienteModel();
    let data;
    try {
      data = await pb
        .collection(COLECAO_PERFIL)
        .update(usuarioId, { is_admin: true });
    } catch (error) {
      marcarErro(error);
    }

    const titulo = "Promoção a Administrador";
    await this.enviarEmail({
      from: `"Tropa Livresca" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: titulo,
      text: `Olá ${data.nome},\n\nParabéns! Você foi promovido a Administrador da Tropa Livresca.\nO usuário é: ${data.email}\nA senha é: Senh@Adm123!\n\nAtenciosamente,\nEquipe Tropa Livresca`,
      html: `<p>Olá ${data.nome},</p><p>Parabéns! Você foi promovido a <strong>Administrador</strong> da Tropa Livresca.</p><p>O usuário é: ${data.email}</p><p>A senha de primeiro acesso é: Senh@Adm123!</p><p>Atenciosamente,<br/>Equipe Tropa Livresca</p>`,
    });
    return data;
  }

  static async inativarFuncionario(funcionarioId) {
    const pb = criarClienteModel();
    let data;
    try {
      data = await pb.collection(COLECAO_PERFIL).update(funcionarioId, {
        is_admin: false,
        is_master: false,
      });
    } catch (error) {
      marcarErro(error);
    }

    await this.enviarEmail({
      from: `"Tropa Livresca" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: "Remoção de Privilégios de Administrador",
      text: `Olá ${data.nome},\n\nLamentamos informar que seus privilégios de Administrador foram removidos da Tropa Livresca.\n\nAtenciosamente,\nEquipe Tropa Livresca`,
      html: `<p>Olá ${data.nome},</p><p>Lamentamos informar que seus privilégios de <strong>Administrador</strong> foram removidos da Tropa Livresca.</p><p>O usuário é: ${data.email}</p><p>Atenciosamente,<br/>Equipe Tropa Livresca</p>`,
    });
    return data;
  }
}
