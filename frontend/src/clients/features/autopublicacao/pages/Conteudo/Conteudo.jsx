import { useEffect, useMemo } from "react";
import styles from "./Conteudo.module.css";
import { FaFilePdf, FaImage } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function Conteudo({
  dados,
  onChange,
  irParaProximaEtapa,
  voltarEtapa,
}) {
  const atualizarCampo = async (chave, e) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      if (chave === "manuscrito" && arquivo.type === "application/pdf") {
        try {
          const buffer = await arquivo.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: buffer });
          const pdfDocument = await loadingTask.promise;
          const totalPaginas = pdfDocument.numPages;

          onChange({
            ...dados,
            conteudo: { ...(dados.conteudo || {}), [chave]: arquivo },
            orcamento: {
              ...(dados.orcamento || {}),
              numeroPaginas: String(totalPaginas),
            },
          });
        } catch (erro) {
          console.error("Erro ao ler as páginas do PDF:", erro);
          onChange({
            ...dados,
            conteudo: { ...(dados.conteudo || {}), [chave]: arquivo },
          });
        }
      } else {
        onChange({
          ...dados,
          conteudo: { ...(dados.conteudo || {}), [chave]: arquivo },
        });
      }
    }
  };

  const atualizarCapa = (parte, e) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      onChange({
        ...dados,
        conteudo: {
          ...(dados.conteudo || {}),
          capa: { ...(dados.conteudo?.capa || {}), [parte]: arquivo },
        },
      });
    }
  };

  const previews = useMemo(() => {
    const urlsCriadas = [];
    const obterPreview = (arquivo) => {
      if (arquivo && (arquivo instanceof File || arquivo instanceof Blob)) {
        const url = URL.createObjectURL(arquivo);
        urlsCriadas.push(url);
        return url;
      }
      if (typeof arquivo === "string") {
        return arquivo;
      }
      return null;
    };

    return {
      frente: obterPreview(dados.conteudo?.capa?.frente),
      verso: obterPreview(dados.conteudo?.capa?.verso),
      orelhas: obterPreview(dados.conteudo?.capa?.orelhas),
      manuscrito: obterPreview(dados.conteudo?.manuscrito),
      _urlsCriadas: urlsCriadas,
    };
  }, [
    dados.conteudo?.capa?.frente,
    dados.conteudo?.capa?.verso,
    dados.conteudo?.capa?.orelhas,
    dados.conteudo?.manuscrito,
  ]);

  useEffect(() => {
    return () => {
      previews._urlsCriadas.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <h1 className={styles.titulo}>Conteúdo</h1>

        <div className={styles.card}>
          <legend>Manuscrito</legend>
          <label className={styles.carregar}>
            <FaFilePdf className={styles.carregarsvg} />
            <span>
              Subir arquivo do livro{" "}
              <span className={styles.clique}>
                Aceitamos apenas arquivos .pdf
              </span>
            </span>
            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => atualizarCampo("manuscrito", e)}
            />
          </label>

          {previews.manuscrito ? (
            <div className={styles.manuscrito}>
              <p className={styles.pmanuscrito}>
                ✓ Manuscrito carregado{" "}
                {dados.orcamento?.numeroPaginas &&
                  `(${dados.orcamento.numeroPaginas} páginas)`}
              </p>
              <a
                href={previews.manuscrito}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnmanus}
              >
                Abrir manuscrito (PDF)
              </a>
              <div className={styles.embed}>
                <embed src={previews.manuscrito} type="application/pdf" />
              </div>
            </div>
          ) : null}
        </div>

        {/* Card das Capas */}
        <div className={styles.card}>
          <legend>Capa do Livro</legend>

          <div>
            <label className={styles.carregar}>
              <FaImage className={styles.carregarsvg} />
              <span>
                Frente da capa{" "}
                <span className={styles.clique}>
                  Aceitamos arquivos .jpg e .png
                </span>
              </span>
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png"
                onChange={(e) => atualizarCapa("frente", e)}
              />
            </label>
            {previews.frente && (
              <div className={styles.preview}>
                <img
                  src={previews.frente}
                  alt="Preview da Frente"
                  width="150"
                />
              </div>
            )}
          </div>

          <div>
            <label className={styles.carregar}>
              <FaImage className={styles.carregarsvg} />
              <span>
                Verso da capa{" "}
                <span className={styles.clique}>
                  Aceitamos arquivos .jpg e .png
                </span>
              </span>
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png"
                onChange={(e) => atualizarCapa("verso", e)}
              />
            </label>
            {previews.verso && (
              <div className={styles.preview}>
                <img src={previews.verso} alt="Preview do Verso" width="150" />
              </div>
            )}
          </div>

          <div>
            <label className={styles.carregar}>
              <FaImage className={styles.carregarsvg} />
              <span>
                Orelhas da capa{" "}
                <span className={styles.clique}>
                  Aceitamos arquivos .jpg e .png
                </span>
              </span>
              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png"
                onChange={(e) => atualizarCapa("orelhas", e)}
              />
            </label>
            {previews.orelhas && (
              <div className={styles.preview}>
                <img
                  src={previews.orelhas}
                  alt="Preview das Orelhas"
                  width="150"
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.botao}>
          <Link to="/meuslivros" className={styles.btnmeu}>
            Voltar a Meus Livros
          </Link>
          <div className={styles.navegacao}>
            <button
              type="button"
              onClick={voltarEtapa}
              className={styles.btnmeu}
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={irParaProximaEtapa}
              className={styles.btn2meu}
            >
              Posterior
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
