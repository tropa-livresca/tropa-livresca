import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
import { useRevisao } from "../../hooks/useRevisao.js";
import { useLivros } from "../../../livros/hooks/useLivros.js";
import { LIVRO_ESTADO } from "../../../../../common/config/livroEstados.js";

import styles from "./NovaRevisao.module.css";

export default function NovaRevisao() {
  const { id } = useParams();
  const inputRef = useRef(null);

  const [arquivoSelecionado, setArquivoSelecionado] = useState("");
  const [enviando, setEnviando] = useState(false);

  const {
    revisaoAtual,
    nome,
    setNome,
    manuscrito,
    setManuscrito,
    apontamento,
    setApontamento,
    criarRevisao,
    atualizarRevisao,
    verificarRevisor,
    carregando,
    error,
    revisor,
  } = useRevisao();

  const { buscarLivroById, livro } = useLivros();

  useEffect(() => {
    if (!id) return;

    buscarLivroById(id);
  }, [buscarLivroById, id]);

  useEffect(() => {
    if (!id) return;

    verificarRevisor(id).catch((err) => {
      console.error("Erro ao verificar revisão:", err);
    });
  }, [verificarRevisor, id]);

  const selecionarManuscrito = useCallback(
    (event) => {
      const arquivo = event.target.files?.[0];

      if (!arquivo) return;

      const ehPdf =
        arquivo.name.toLowerCase().endsWith(".pdf") &&
        (!arquivo.type || arquivo.type === "application/pdf");

      if (!ehPdf) {
        alert("Selecione um arquivo PDF válido.");
        event.target.value = "";
        setArquivoSelecionado("");
        return;
      }

      setManuscrito(arquivo);
      setArquivoSelecionado(arquivo.name);
    },
    [setManuscrito],
  );

  const executarAcao = async (status) => {
    if (!id) {
      alert("Não foi possível identificar o livro.");
      return;
    }

    if (enviando || carregando) return;

    setEnviando(true);

    try {
      if (revisaoAtual?.id) {
        await atualizarRevisao(revisaoAtual.id, id, status);
      } else {
        await criarRevisao(id, status);
      }

      const mensagens = {
        [LIVRO_ESTADO.EM_REVISAO]: "Revisão salva com sucesso.",
        [LIVRO_ESTADO.PUBLICADO]:
          "Revisão enviada e livro publicado com sucesso.",
        [LIVRO_ESTADO.RECALL]:
          "Revisão enviada e correção solicitada com sucesso.",
        [LIVRO_ESTADO.NEGADO]:
          "Revisão enviada e publicação negada com sucesso.",
      };

      alert(mensagens[status] || "Revisão salva com sucesso.");
    } catch (err) {
      console.error("Erro ao salvar revisão:", err);

      alert(err.message || "Não foi possível concluir a operação.");
    } finally {
      setEnviando(false);
    }
  };

  const ocupado = carregando || enviando;

  return (
    <main className={styles.mainContainer}>
      {livro && (
        <div className={styles.topo}>
          <h2 className={styles.titulo}>Revisão do livro: {livro.titulo}</h2>

          {livro.subtitulo && <p>{livro.subtitulo}</p>}
        </div>
      )}

      <div className={styles.container}>
        {livro && (
          <div className={styles.manuscrito}>
            {livro.manuscrito ? (
              <object
                data={livro.manuscrito}
                type="application/pdf"
                width="100%"
                height="650px"
              >
                <p>
                  Seu navegador não suporta a exibição de PDFs.{" "}
                  <a
                    href={livro.manuscrito}
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    Clique aqui para baixar o arquivo.
                  </a>
                </p>
              </object>
            ) : (
              <p>
                O manuscrito original não está disponível para visualização.
              </p>
            )}

            <Link to={`/admin/livros/detalhes/${livro.id}`}>
              Ver dados completos do livro
            </Link>
          </div>
        )}

        {ocupado && <p role="status">Carregando ou processando revisão...</p>}

        {error && <p role="alert">{error}</p>}

        {!ocupado && revisor === false && (
          <p role="status">Você não pode editar esta revisão no momento.</p>
        )}

        <form
          onSubmit={(event) => event.preventDefault()}
          className={styles.form}
        >
          <div>
            <label htmlFor="nome">Nome da revisão:</label>

            <input
              id="nome"
              type="text"
              name="nome"
              className={styles.input}
              placeholder="Insira o nome da revisão"
              value={nome || ""}
              onChange={(event) => setNome(event.target.value)}
              disabled={!revisor || ocupado}
              required
            />
          </div>

          <div>
            <label htmlFor="apontamento">Apontamento:</label>

            <textarea
              id="apontamento"
              name="apontamento"
              rows={10}
              className={styles.textarea}
              placeholder="Digite o apontamento"
              value={apontamento || ""}
              onChange={(event) => setApontamento(event.target.value)}
              disabled={!revisor || ocupado}
              required
            />
          </div>

          {revisor === true && (
            <div className={styles.carregar}>
              <button
                type="button"
                className={styles.carregar}
                onClick={() => inputRef.current?.click()}
                disabled={ocupado}
                aria-label="Selecionar manuscrito revisado em PDF"
              >
                <FaFilePdf className={styles.carregarsvg} />

                <span>
                  Manuscrito revisado
                  <span className={styles.clique}>Aceitamos arquivos PDF</span>
                </span>
              </button>

              <input
                ref={inputRef}
                type="file"
                name="manuscritoRevisto"
                accept=".pdf,application/pdf"
                onChange={selecionarManuscrito}
                disabled={ocupado}
                style={{ display: "none" }}
              />

              {arquivoSelecionado && (
                <p>Arquivo selecionado: {arquivoSelecionado}</p>
              )}

              {!arquivoSelecionado &&
                typeof manuscrito === "string" &&
                manuscrito && (
                  <p>Um manuscrito já está associado a esta revisão.</p>
                )}
            </div>
          )}

          {revisor === true && (
            <div className={styles.gridBotoes}>
              <button
                type="button"
                className={styles.btn}
                onClick={() => executarAcao(LIVRO_ESTADO.EM_REVISAO)}
                disabled={ocupado}
              >
                {ocupado ? "Processando..." : "Salvar revisão"}
              </button>

              <button
                type="button"
                className={styles.btn}
                onClick={() => executarAcao(LIVRO_ESTADO.PUBLICADO)}
                disabled={ocupado}
              >
                Enviar revisão e publicar
              </button>

              <button
                type="button"
                className={styles.btn}
                onClick={() => executarAcao(LIVRO_ESTADO.RECALL)}
                disabled={ocupado}
              >
                Enviar revisão e pedir correção
              </button>

              <button
                type="button"
                className={styles.btn}
                onClick={() => executarAcao(LIVRO_ESTADO.NEGADO)}
                disabled={ocupado}
              >
                Enviar revisão e negar livro
              </button>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}
