import { LIVRO_ESTADO } from "../config/livro-estados.js";
import {
  criarClienteModel,
  marcarErro,
  mapearCampoArquivo,
  paginaPocketBase,
  primeiraUrlArquivo,
} from "./pocketbase.helpers.js";

const COLECAO_PERFIL = "users_profile";

async function buscarAutores(pb, busca = "") {
  const livros = await pb.collection("livros").getFullList({
    filter: pb.filter("ativo = true && estado = {:estado}", {
      estado: LIVRO_ESTADO.PUBLICADO,
    }),
    fields:
      "id,collectionId,collectionName,titulo,ativo,capa_frente,capa_verso,preco_digital,preco_fisico,idioma,fk_user_profile_id",
  });

  const livrosPorAutor = new Map();

  for (const livro of livros) {
    const registros = livrosPorAutor.get(livro.fk_user_profile_id) || [];

    const capaFrente = mapearCampoArquivo(pb, livro, "capa_frente");

    const capaVerso = mapearCampoArquivo(pb, livro, "capa_verso");

    registros.push({
      ...livro,
      ...capaFrente,
      ...capaVerso,
      capa: {
        frente: primeiraUrlArquivo(capaFrente.capa_frenteUrl),
        verso: primeiraUrlArquivo(capaVerso.capa_versoUrl),
      },
    });

    livrosPorAutor.set(livro.fk_user_profile_id, registros);
  }

  const ids = [...livrosPorAutor.keys()];

  if (!ids.length) {
    return { autores: [], count: 0 };
  }

  const partesFiltro = ids.map((_, index) => `id = {:id${index}}`);

  const parametros = Object.fromEntries(
    ids.map((id, index) => [`id${index}`, id]),
  );

  const filtroIds = `(${partesFiltro.join(" || ")})`;

  const registrosAutor = await pb.collection(COLECAO_PERFIL).getFullList({
    filter: pb.filter(filtroIds, parametros),
    fields:
      "id,collectionId,collectionName,nome,sobrenome,descricao,redes_sociais,imagem",
  });

  const termoBusca = busca.trim().toLocaleLowerCase();

  const autores = registrosAutor
    .map((autor) => {
      const arquivoImagem = mapearCampoArquivo(pb, autor, "imagem");

      return {
        ...autor,
        ...arquivoImagem,
        nome: autor.nome || "",
        sobrenome: autor.sobrenome || "",
        imagem: primeiraUrlArquivo(arquivoImagem.imagemUrl),
        livros: livrosPorAutor.get(autor.id) || [],
      };
    })
    .filter((autor) =>
      `${autor.nome} ${autor.sobrenome}`
        .toLocaleLowerCase()
        .includes(termoBusca),
    )
    .sort((a, b) =>
      `${a.nome} ${a.sobrenome}`.localeCompare(`${b.nome} ${b.sobrenome}`),
    );

  return {
    autores,
    count: autores.length,
  };
}

export class AutorModel {
  static async buscarComFiltros({ page = 1, limit = 12, busca = "" }) {
    const pb = await criarClienteModel();

    try {
      const { autores, count } = await buscarAutores(pb, busca);

      const { page: pagina, perPage } = paginaPocketBase({ page, limit });

      return {
        data: autores.slice((pagina - 1) * perPage, pagina * perPage),
        count,
      };
    } catch (error) {
      marcarErro(error);
    }
  }

  static async buscarPorId(id) {
    if (!id) return null;

    const pb = await criarClienteModel();

    try {
      const { autores } = await buscarAutores(pb);

      const autor = autores.find((item) => item.id === id);

      if (!autor) return null;

      return {
        id: autor.id,
        nome: autor.nome,
        sobrenome: autor.sobrenome,
        imagem: autor.imagem,
        imagemNome: autor.imagemNome,
        descricao: autor.descricao,
        redes_sociais: autor.redes_sociais,
        livros: autor.livros,
      };
    } catch (error) {
      marcarErro(error);
    }
  }
}
