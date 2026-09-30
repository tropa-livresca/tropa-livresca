import { ComentarioModel } from "../../common/models/comentario.model.js";
import { error, errorUsuarioId } from "../../common/utils/error.js";

export class ComentarioService {
  static async buscarComentarios(idLivro, limit = 5, secao = 1) {
    if (!idLivro) error(500, "Id do livro não informado.");

    const {data,error,count} = await ComentarioModel.buscarComentarios(
      idLivro,
      limit,
      secao,
    );

    console.log(idLivro);

    if (error) throw error;

    return {data, meta: {secao, limit, totalItens: count, totalSecoes: count/limit}};
  }

  static async deletarComentario(idUsuario, idComentario) {
    if (!idUsuario) errorUsuarioId();

    if (!idComentario) error(400, "Id do comentário a deletar não informado.");

    const comentarioDeletado = await ComentarioModel.deletarComentario(
      idUsuario,
      idComentario,
    );

    return comentarioDeletado;
  }

  static async criarComentario(usuarioId, livroId, texto) {
    if (!usuarioId) errorUsuarioId();

    if (!livroId || !texto) error(400, "Dados do comentário não informados.");

    const dadosComentario = {
      texto: texto,
      fk_livros_id: livroId,
      fk_user_profile_id: usuarioId,
    };

    const novoComentario =
      await ComentarioModel.criarComentario(dadosComentario);

    if (novoComentario.error) throw novoComentario.error;

    return novoComentario;
  }

  static async atualizarComentario(idComentario, idUsuario, texto) {
    if (!idUsuario) errorUsuarioId();

    if (!idComentario) error(400, "Id do comentário não informado.");

    const dadosAtualizados = {
      fk_user_profile_id: idUsuario,
      texto: texto || "",
    };

    const comentarioAtualizado = await ComentarioModel.atualizarComentario(
      idComentario,
      idUsuario,
      dadosAtualizados,
    );

    if (comentarioAtualizado.error) throw comentarioAtualizado.error;

    return comentarioAtualizado;
  }
}
