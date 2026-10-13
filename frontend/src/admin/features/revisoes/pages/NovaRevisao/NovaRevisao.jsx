import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useRevisao } from "../../hooks/useRevisao.js";
import { useLivros } from "../../../livros/hooks/useLivros.js";
import { LIVRO_ESTADO } from "../../../../../common/config/livroEstados.js";
import styles from "./NovaRevisao.module.css";
import { useRef } from "react";
import { FaFilePdf } from "react-icons/fa";

export default function NovaRevisao() {
  const { id } = useParams();
  const {
    revisaoAtual,
    nome,
    setNome,
    setManuscrito,
    apontamento,
    setApontamento,
    criarRevisao,
    atualizarRevisao,
    verificarRevisor,
    carregando,
    revisor,
  } = useRevisao();
  const { buscarLivroById, livro } = useLivros();

  useEffect(() => {
    if (id) {
      buscarLivroById(id);
    }
  }, [buscarLivroById, id]);

  useEffect(() => {
    verificarRevisor(id);
  }, [verificarRevisor, id]);

  const salvarRevisao = async (e, status) => {
    e.preventDefault();
    try {
      await criarRevisao(id, status);
      alert(`Revisão salva com sucesso como ${status}!`);
    } catch (err) {
      alert(err.message || "Erro ao criar revisão.");
    }
  };

  const alterarRevisao = async (e, status) => {
    e.preventDefault();

    try {
      await atualizarRevisao(revisaoAtual.id, id, status);
    } catch (err) {
      console.error(err.message);
      alert(err.message || "Erro ao criar revisão.");
    }
  };

  const inputRef = useRef(null);

  return (
    <main className={styles.mainContainer}>
      {livro && (
        <div className={styles.topo}>
          <h2 className={styles.titulo}>
            Criando revisão para: {livro.titulo}
          </h2>
          {livro.subtitulo && <p>{livro.subtitulo}</p>}
        </div>
      )}

      <div className={styles.container}>
        {livro && (
          <div className={styles.manuscrito}>
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
            <Link to={`/admin/livros/detalhes/${livro.id}`}>
              Ver dados completos do livro
            </Link>
          </div>
        )}

        {carregando == true && <p>carregando</p>}

        <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
          <div>
            <label>Nome da revisão:</label>
            <input
              type="text"
              name="nome"
              className={styles.input}
              placeholder="Insira o nome da revisão"
              value={nome || ""}
              onChange={(e) => setNome(e.target.value)}
              disabled={revisor == false}
            />
          </div>
          <div>
            <label>Apontamento:</label>
            <textarea
              id="apontamento"
              name="apontamento"
              rows="10"
              cols="50"
              className={styles.textarea}
              placeholder="Digite o apontamento"
              value={apontamento || ""}
              onChange={(e) => setApontamento(e.target.value)}
              disabled={revisor == false}
            />
          </div>
          {revisor == true ? (
            <div
              className={styles.carregar}
              onClick={() => inputRef.current.click()}
            >
              <FaFilePdf className={styles.carregarsvg} />

              <span>
                Manuscrito
                <span className={styles.clique}>Aceitamos arquivos .pdf</span>
              </span>

              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setManuscrito(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <></>
          )}

          {revisor === true ? (
            <div className={styles.gridBotoes}>
              {revisaoAtual == null ? (
                <>
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => salvarRevisao(e, LIVRO_ESTADO.EM_REVISAO)}
                  >
                    Salvar Nova Revisão
                  </button>

                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => salvarRevisao(e, LIVRO_ESTADO.PUBLICADO)}
                  >
                    Enviar Revisão e Publicar
                  </button>

                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => salvarRevisao(e, LIVRO_ESTADO.RECALL)}
                  >
                    Enviar Revisão e pedir correção
                  </button>

                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => salvarRevisao(e, LIVRO_ESTADO.NEGADO)}
                  >
                    Enviar Revisão e negar livro
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => alterarRevisao(e, LIVRO_ESTADO.EM_REVISAO)}
                  >
                    Alterar Revisão
                  </button>

                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => alterarRevisao(e, LIVRO_ESTADO.PUBLICADO)}
                  >
                    Enviar Revisão e Publicar
                  </button>

                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => alterarRevisao(e, LIVRO_ESTADO.RECALL)}
                  >
                    Enviar Revisão e pedir correção
                  </button>

                  <button
                    type="button"
                    className={styles.btn}
                    onClick={(e) => alterarRevisao(e, LIVRO_ESTADO.NEGADO)}
                  >
                    Enviar Revisão e negar livro
                  </button>
                </>
              )}
            </div>
          ) : null}
        </form>
      </div>
    </main>
  );
}
