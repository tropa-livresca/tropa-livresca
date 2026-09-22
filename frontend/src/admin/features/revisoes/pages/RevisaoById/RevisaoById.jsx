import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRevisao } from "../../hooks/useRevisao.js";
import {
  FaArrowLeft,
  FaEdit,
  FaTimes,
  FaSave,
  FaTrash,
  FaExternalLinkAlt,
  FaBook,
} from "react-icons/fa";
import styles from "./RevisaoById.module.css"; // Importando o CSS

export default function RevisaoById() {
  const { id } = useParams();
  const {
    buscarRevisaoById,
    revisaoAtual,
    livroRevisado,
    nome,
    setNome,
    manuscrito,
    setManuscrito,
    apontamento,
    setApontamento,
    atualizarRevisao,
    LimparCampos,
  } = useRevisao();

  const [isEdicao, setIsEdicao] = useState(false);

  useEffect(() => {
    if (!id) return;

    const CarregarDados = async () => {
      await buscarRevisaoById(id);
    };

    CarregarDados();
  }, [id, buscarRevisaoById]);

  const executarSalvar = async (e) => {
    e.preventDefault();
    if (id) {
      await atualizarRevisao(id, e);
      setIsEdicao(false);
    }
  };

  return (
    <main className={styles.container}>
      {/* Barra de Ações Superior */}
      <div className={styles.topBar}>
        <Link to="/admin/revisoes" className={styles.linkVoltar}>
          <FaArrowLeft /> Voltar às Revisões
        </Link>

        <button
          onClick={() => setIsEdicao(!isEdicao)}
          className={isEdicao ? styles.botaoCancelar : styles.botaoEditar}
        >
          {isEdicao ? (
            <>
              <FaTimes /> Cancelar
            </>
          ) : (
            <>
              <FaEdit /> Editar Revisão
            </>
          )}
        </button>
      </div>

      {revisaoAtual ? (
        <div className={styles.conteudoCard}>
          <div className={styles.headerRevisao}>
            <h1 className={styles.titulo}>Detalhes da Revisão #{id}</h1>

            {livroRevisado?.id && (
              <Link
                to={`/admin/livros/visualizar/${livroRevisado.id}`}
                className={styles.linkLivro}
              >
                <FaBook /> Ver livro relacionado
              </Link>
            )}
          </div>

          <form onSubmit={executarSalvar} className={styles.formulario}>
            {/* Campo Nome */}
            <div className={styles.campoGrupo}>
              <label className={styles.label}>Nome da revisão:</label>
              <input
                type="text"
                name="nome"
                value={nome || ""}
                disabled={!isEdicao}
                onChange={(e) => setNome(e.target.value)}
                className={styles.input}
                placeholder="Ex: Revisão de ortografia do capítulo 1"
              />
            </div>

            {/* Campo Apontamento */}
            <div className={styles.campoGrupo}>
              <label className={styles.label}>Apontamento:</label>
              <textarea
                id="apontamento"
                name="apontamento"
                rows="10"
                placeholder="Digite detalhadamente as notas da revisão..."
                value={apontamento || ""}
                disabled={!isEdicao}
                onChange={(e) => setApontamento(e.target.value)}
                className={styles.textarea}
              />
            </div>

            {/* Campo Manuscrito / Arquivo */}
            <div className={styles.campoGrupo}>
              <label className={styles.label}>Manuscrito / Anexo:</label>

              {isEdicao && (
                <input
                  type="file"
                  onChange={(e) => setManuscrito(e.target.files[0])}
                  className={styles.inputFile}
                />
              )}

              {manuscrito && typeof manuscrito === "string" && (
                <div className={styles.arquivoBox}>
                  <span>Arquivo atual anexado ao sistema</span>
                  <a
                    href={manuscrito}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkArquivo}
                  >
                    Visualizar Arquivo <FaExternalLinkAlt size={12} />
                  </a>
                </div>
              )}
            </div>

            {/* Botões Inferiores de Edição */}
            {isEdicao && (
              <div className={styles.acoesFormulario}>
                <button
                  type="button"
                  onClick={LimparCampos}
                  className={styles.botaoLimpar}
                >
                  <FaTrash /> Limpar Formulário
                </button>
                <button type="submit" className={styles.botaoSalvar}>
                  <FaSave /> Salvar Alterações
                </button>
              </div>
            )}
          </form>
        </div>
      ) : (
        <div className={styles.feedbackErro}>
          Nenhuma revisão encontrada para este ID. Verifique o caminho
          informado.
        </div>
      )}
    </main>
  );
}
