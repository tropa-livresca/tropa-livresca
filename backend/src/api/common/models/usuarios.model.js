import { LIVRO_ESTADO } from "../config/livro-estados.js";

import {
  criarClienteModel,
  getListPocketBase,
  marcarErro,
  mapearCampoArquivo,
  primeiraUrlArquivo,
} from "./pocketbase.helpers.js";

import nodemailer from "nodemailer";

const COLECAO_PERFIL = "users_profile";
const COLECAO_LIVROS = "livros";
const COLECAO_REVISOES = "revisoes";

const RELACAO_PERFIL = "fk_user_profile_id";

function formatarUsuario(pb, perfil, livros = []) {
  const imagem = mapearCampoArquivo(pb, perfil, "imagem");

  const nome = perfil.nome || "";
  const sobrenome = perfil.sobrenome || "";

  return {
    ...perfil,
    nome,
    sobrenome,
    nomeCompleto: `${nome} ${sobrenome}`.trim(),
    email: perfil.email || "",
    imagem: primeiraUrlArquivo(imagem.imagemUrl),
    imagemNome: imagem.imagemNome,
    isAdmin: !!perfil.is_admin,
    isAutor: livros.some(
      (livro) =>
        livro.estado === LIVRO_ESTADO.PUBLICADO && livro.ativo === true,
    ),
    livros,
  };
}

async function buscarLivrosPorPerfis(pb, perfis) {
  if (!perfis.length) return [];

  const clauses = perfis.map((_, index) => `${RELACAO_PERFIL} = {:id${index}}`);

  const params = Object.fromEntries(
    perfis.map((perfil, index) => [`id${index}`, perfil.id]),
  );

  return pb.collection(COLECAO_LIVROS).getFullList({
    filter: pb.filter(clauses.join(" || "), params),
  });
}

function agruparLivrosPorPerfil(livros) {
  const livrosPorPerfil = new Map();

  for (const livro of livros) {
    const perfilId = livro[RELACAO_PERFIL];

    if (!perfilId) continue;

    const lista = livrosPorPerfil.get(perfilId) || [];
    lista.push(livro);

    livrosPorPerfil.set(perfilId, lista);
  }

  return livrosPorPerfil;
}

export class UsuariosModel {
  static async buscarUsuarios({
    page = 1,
    limit = 12,
    busca = "",
    ordem = "",
    filtro = "",
  }) {
    const pb = await criarClienteModel();

    const filtros = [];
    const params = {};

    if (filtro === "funcionario") {
      filtros.push("is_admin = true");
    }

    if (filtro === "cliente") {
      filtros.push("is_admin = false");
    }

    if (busca) {
      filtros.push("(nome ~ {:busca} || sobrenome ~ {:busca})");
      params.busca = busca;
    }

    try {
      const resultado = await getListPocketBase(pb.collection(COLECAO_PERFIL), {
        page,
        limit,
        filter: filtros.length ? pb.filter(filtros.join(" && "), params) : "",
        sort: ordem === "ascendente" ? "nome" : "-nome",
        fields:
          "id,nome,sobrenome,email,imagem,is_admin,is_master,primeiro_acesso,redes_sociais",
      });

      const livros = await buscarLivrosPorPerfis(pb, resultado.items);

      const livrosPorPerfil = agruparLivrosPorPerfil(livros);

      let usuariosFormatados = resultado.items.map((perfil) =>
        formatarUsuario(pb, perfil, livrosPorPerfil.get(perfil.id) || []),
      );

      let count = resultado.totalItems;

      if (filtro === "autor") {
        const todosPerfis = await pb.collection(COLECAO_PERFIL).getFullList({
          fields:
            "id,nome,sobrenome,email,imagem,is_admin,is_master,primeiro_acesso,redes_sociais",
        });

        const todosLivros = await buscarLivrosPorPerfis(pb, todosPerfis);

        const todosLivrosPorPerfil = agruparLivrosPorPerfil(todosLivros);

        const autores = new Set(
          todosLivros
            .filter(
              (livro) => livro.ativo && livro.estado === LIVRO_ESTADO.PUBLICADO,
            )
            .map((livro) => livro[RELACAO_PERFIL]),
        );

        const filtrados = todosPerfis
          .filter((perfil) => {
            const nomeCompleto = `${perfil.nome || ""} ${perfil.sobrenome || ""}`;

            return (
              autores.has(perfil.id) &&
              (!busca ||
                nomeCompleto.toLowerCase().includes(busca.toLowerCase()))
            );
          })
          .sort((a, b) => {
            const nomeA = `${a.nome || ""} ${a.sobrenome || ""}`;

            const nomeB = `${b.nome || ""} ${b.sobrenome || ""}`;

            return (
              nomeA.localeCompare(nomeB) * (ordem === "ascendente" ? 1 : -1)
            );
          });

        count = filtrados.length;

        const paginaAtual = Math.max(1, Number(page) || 1);

        const limiteAtual = Math.max(1, Number(limit) || 12);

        const start = (paginaAtual - 1) * limiteAtual;

        usuariosFormatados = filtrados
          .slice(start, start + limiteAtual)
          .map((perfil) => ({
            ...formatarUsuario(
              pb,
              perfil,
              todosLivrosPorPerfil.get(perfil.id) || [],
            ),
            isAutor: true,
          }));
      }

      return {
        data: usuariosFormatados,
        count,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarUsuarioById(usuarioId) {
    if (!usuarioId) return null;

    const pb = await criarClienteModel();

    try {
      const perfil = await pb.collection(COLECAO_PERFIL).getOne(usuarioId);

      const [livros, revisoes] = await Promise.all([
        pb.collection(COLECAO_LIVROS).getFullList({
          filter: pb.filter(`${RELACAO_PERFIL} = {:usuarioId}`, {
            usuarioId,
          }),
        }),

        pb.collection(COLECAO_REVISOES).getFullList({
          filter: pb.filter(`${RELACAO_PERFIL} = {:usuarioId}`, {
            usuarioId,
          }),
        }),
      ]);

      return {
        ...formatarUsuario(pb, perfil, livros),
        livros,
        revisoes,
      };
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
    const pb = await criarClienteModel();

    let data;

    try {
      data = await pb.collection(COLECAO_PERFIL).update(usuarioId, {
        is_admin: true,
      });
    } catch (error) {
      marcarErro(error);
    }

    const titulo = "Promoção a Administrador";

    await this.enviarEmail({
      from: `"Tropa Livresca" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: titulo,
      text: `Olá ${data.nome || ""},\n\nParabéns! Você foi promovido a Administrador da Tropa Livresca.\nO usuário é: ${data.email}\nA senha é: Senh@Adm123!\n\nAtenciosamente,\nEquipe Tropa Livresca`,
      html: `<p>Olá ${data.nome || ""},</p><p>Parabéns! Você foi promovido a <strong>Administrador</strong> da Tropa Livresca.</p><p>O usuário é: ${data.email}</p><p>A senha de primeiro acesso é: Senh@Adm123!</p><p>Atenciosamente,<br/>Equipe Tropa Livresca</p>`,
    });

    return {
      ...data,
      nome: data.nome || "",
      sobrenome: data.sobrenome || "",
      email: data.email || "",
    };
  }

  static async inativarFuncionario(funcionarioId) {
    const pb = await criarClienteModel();

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
      text: `Olá ${data.nome || ""},\n\nLamentamos informar que seus privilégios de Administrador foram removidos da Tropa Livresca.\n\nAtenciosamente,\nEquipe Tropa Livresca`,
      html: `<p>Olá ${data.nome || ""},</p><p>Lamentamos informar que seus privilégios de <strong>Administrador</strong> foram removidos da Tropa Livresca.</p><p>O usuário é: ${data.email}</p><p>Atenciosamente,<br/>Equipe Tropa Livresca</p>`,
    });

    return {
      ...data,
      nome: data.nome || "",
      sobrenome: data.sobrenome || "",
      email: data.email || "",
    };
  }
}
