import { AvaliacaoModel } from "../../common/models/avaliacao.model.js";
import { error, errorUsuarioId } from "../../common/utils/error.js";

export class AvaliacaoService {
  static async criarAvaliacao(livroId, usuarioId, qtd_estrelas) {
    if (!usuarioId) errorUsuarioId();

    if (!livroId || !qtd_estrelas)
      error(400, "Dados da avaliação não informados.");

    const dadosAvaliacao = {
      fk_livros_id: livroId,
      fk_users_profile_id: usuarioId,
      qtd_estrelas: qtd_estrelas,
    };

    const novaAvaliacao = await AvaliacaoModel.criarAvaliacao(
      usuarioId,
      livroId,
      dadosAvaliacao,
    );

    if (novaAvaliacao.error) throw novaAvaliacao.error;

    return novaAvaliacao;
  }

  static async alterarAvaliacao(idUsuario, idAvaliacao, qtd_estrelas) {
    if (!idUsuario) errorUsuarioId();

    if (!idAvaliacao || !qtd_estrelas)
      error(400, "Dados da avaliação não informados.");

    const avaliacaoAtualizada = AvaliacaoModel.alterarAvaliacao(
      idUsuario,
      idAvaliacao,
      qtd_estrelas,
    );

    if (avaliacaoAtualizada.error) throw avaliacaoAtualizada.error;

    return avaliacaoAtualizada;
  }

  static async buscarAvaliacoesLivro(idLivro) {
    if (!idLivro) error(500, "Id do Livro não informado.");

    const avaliacoes = await AvaliacaoModel.buscarAvaliacoesLivro(idLivro);

    if (avaliacoes.error) throw avaliacoes.error;

    return avaliacoes;
  }
}
