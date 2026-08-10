import { useEffect } from "react";
import styles from "./Conteudo.module.css";
import { FaFilePdf, FaImage } from "react-icons/fa";

export default function Conteudo({
  dados,
  onChange,
  irParaProximaEtapa,
  voltarEtapa,
  isBloqueadoParaEdicao,
}) {
  const atualizarCampo = (chave, e) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      onChange({ ...dados, [chave]: arquivo });
    }
  };

  const atualizarCapa = (parte, e) => {
    const arquivo = e.target.files?.[0];
    if (arquivo) {
      onChange({
        ...dados,
        capa: {
          ...(dados.capa || {}),
          [parte]: arquivo,
        },
      });
    }
  };

  const obterPreview = (arquivo) => {
    if (arquivo && (arquivo instanceof File || arquivo instanceof Blob)) {
      return URL.createObjectURL(arquivo);
    }
    if (typeof arquivo === "string") {
      return arquivo;
    }
    return null;
  };

  const previewFrente = obterPreview(dados.capa?.frente);
  const previewVerso = obterPreview(dados.capa?.verso);
  const previewOrelhas = obterPreview(dados.capa?.orelhas);
  const previewManuscrito = obterPreview(dados.manuscrito);

  useEffect(() => {
    return () => {
      if (previewFrente) URL.revokeObjectURL(previewFrente);
      if (previewVerso) URL.revokeObjectURL(previewVerso);
      if (previewOrelhas) URL.revokeObjectURL(previewOrelhas);
      if (previewManuscrito) URL.revokeObjectURL(previewManuscrito);
    };
  }, [previewFrente, previewVerso, previewOrelhas, previewManuscrito]);

  return (
    <main>
      <form onSubmit={(e) => e.preventDefault()} className={styles.form}>
        <h1 className={styles.titulo}>Conteúdo</h1>
        <div className={styles.card}>
          <legend>Manuscrito</legend>
          <label className={styles.carregar}>
            <FaFilePdf className={styles.carregarsvg} />

            <span>
              Subir arquivo do livro
              <span className={styles.clique}>
                Aceitamos apenas arquivos .pdf
              </span>
            </span>

            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => atualizarCampo("manuscrito", e)}
              disabled={isBloqueadoParaEdicao}
            />
          </label>

          {previewManuscrito ? (
            <div>
              <p style={{ color: "green" }}>✓ Manuscrito carregado</p>
              <a
                href={previewManuscrito}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", marginBottom: "8px" }}
              >
                Abrir manuscrito (PDF)
              </a>
              <div>
                <embed
                  src={previewManuscrito}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                />
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.card}>
          <legend>Capa do Livro</legend>

          <div>
            <label className={styles.carregar}>
              <FaImage className={styles.carregarsvg} />

              <span>
                Frente da capa
                <span className={styles.clique}>
                  Aceitamos arquivos .jpg e .png
                </span>
              </span>

              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png"
                onChange={(e) => atualizarCapa("frente", e)}
                disabled={isBloqueadoParaEdicao}
              />
            </label>

            {previewFrente && (
              <div className={styles.preview}>
                <img src={previewFrente} alt="Preview da Frente" width="150" />
              </div>
            )}
          </div>

          <div>
            <label className={styles.carregar}>
              <FaImage className={styles.carregarsvg} />

              <span>
                Verso da capa
                <span className={styles.clique}>
                  Aceitamos arquivos .jpg e .png
                </span>
              </span>

              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png"
                onChange={(e) => atualizarCapa("verso", e)}
                disabled={isBloqueadoParaEdicao}
              />
            </label>

            {previewVerso && (
              <div className={styles.preview}>
                <img src={previewVerso} alt="Preview do Verso" width="150" />
              </div>
            )}
          </div>

          <div>
            <label className={styles.carregar}>
              <FaImage className={styles.carregarsvg} />
              <span>
                Orelhas da capa
                <span className={styles.clique}>
                  Aceitamos arquivos .jpg e .png
                </span>
              </span>

              <input
                type="file"
                hidden
                accept=".jpg,.jpeg,.png"
                onChange={(e) => atualizarCapa("orelhas", e)}
                disabled={isBloqueadoParaEdicao}
              />
            </label>

            {previewOrelhas && (
              <div className={styles.preview}>
                <img
                  src={previewOrelhas}
                  alt="Preview das Orelhas"
                  width="150"
                />
              </div>
            )}
          </div>
        </div>

        <div className={styles.posterior}>
          <button type="button" onClick={voltarEtapa} id={styles.btn}>
            Anterior
          </button>
          <button type="button" onClick={irParaProximaEtapa} id={styles.btn2}>
            Posterior
          </button>
        </div>
      </form>
    </main>
  );
}
