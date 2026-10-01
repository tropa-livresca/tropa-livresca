import { AvaliacaoModel } from "../../common/models/avaliacao.model.js";
import { error, errorUsuarioId } from "../../common/utils/error.js";

const validarLivroId = (livroId) => {
  const id = Number(livroId);
  if (!Number.isInteger(id) || id <= 0) error(400, "Livro inválido.");
  return id;
};

export class AvaliacaoService {
  static async buscarResumoLivro(livroId) {
    return AvaliacaoModel.buscarResumoLivro(validarLivroId(livroId));
  }

  static async buscarAvaliacao(usuarioId, livroId) {
    if (!usuarioId) errorUsuarioId();
    const id = validarLivroId(livroId);

    const [avaliacao, podeAvaliar] = await Promise.all([
      AvaliacaoModel.buscarAvaliacaoUsuario(usuarioId, id),
      AvaliacaoModel.usuarioComprouLivro(usuarioId, id),
    ]);

    return { avaliacao, podeAvaliar };
  }

  static async salvarAvaliacao(usuarioId, livroId, qtdEstrelas) {
    if (!usuarioId) errorUsuarioId();
    const id = validarLivroId(livroId);

    const estrelas = Number(qtdEstrelas);
    if (!Number.isInteger(estrelas) || estrelas < 1 || estrelas > 5)
      error(400, "A avaliação deve ter de 1 a 5 estrelas.");

    const comprou = await AvaliacaoModel.usuarioComprouLivro(usuarioId, id);
    if (!comprou)
      error(403, "Só quem comprou este livro pode avaliá-lo.");

    return AvaliacaoModel.salvarAvaliacao(usuarioId, id, estrelas);
  }
}
