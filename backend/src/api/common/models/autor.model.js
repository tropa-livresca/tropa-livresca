import { LIVRO_ESTADO } from "../config/livro-estados.js";
import {
  criarClienteModel,
  marcarErro,
  paginaPocketBase,
} from "./pocketbase.helpers.js";

const COLECAO_PERFIL = "users_profile";

async function buscarAutores(pb, busca = "") {
  const livros = await pb.collection("livros").getFullList({
    filter: pb.filter("ativo = true && estado = {:estado}", {
      estado: LIVRO_ESTADO.PUBLICADO,
    }),
    fields:
      "id,titulo,ativo,capa,preco_digital,preco_fisico,idioma,fk_user_profile_id",
  });
  const livrosPorAutor = new Map();
  for (const livro of livros) {
    const registros = livrosPorAutor.get(livro.fk_user_profile_id) || [];
    registros.push(livro);
    livrosPorAutor.set(livro.fk_user_profile_id, registros);
  }

  const ids = [...livrosPorAutor.keys()];
  if (!ids.length) return { autores: [], count: 0 };

  const partesFiltro = ids.map((_, index) => `id = {:id${index}}`);
  const parametros = Object.fromEntries(
    ids.map((id, index) => [`id${index}`, id]),
  );
  if (busca) {
    parametros.busca = busca;
  }

  const filtroIds = `(${partesFiltro.join(" || ")})`;
  const autores = await pb.collection(COLECAO_PERFIL).getFullList({
    filter: pb.filter(
      busca ? `${filtroIds} && nome ~ {:busca}` : filtroIds,
      parametros,
    ),
    sort: "nome",
  });

  return {
    autores: autores.map((autor) => ({
      ...autor,
      livros: livrosPorAutor.get(autor.id) || [],
    })),
    count: autores.length,
  };
}

export class AutorModel {
  static async buscarComFiltros({ page = 1, limit = 12, busca = "" }) {
    const pb = criarClienteModel();
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
    const pb = criarClienteModel();

    try {
      const { autores } = await buscarAutores(pb);
      const autor = autores.find((item) => item.id === id);
      if (!autor) return null;
      return {
        id: autor.id,
        nome: autor.nome,
        imagem: autor.imagem,
        descricao: autor.descricao,
        redes_sociais: autor.redes_sociais,
        livros: autor.livros,
      };
    } catch (error) {
      marcarErro(error);
    }
  }
}
