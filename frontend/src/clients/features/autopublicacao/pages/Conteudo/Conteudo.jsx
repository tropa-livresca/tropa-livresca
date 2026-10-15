import { useEffect, useRef, useState } from "react";
import styles from "./Conteudo.module.css";
import { FaFilePdf, FaImage } from "react-icons/fa";
import { Link } from "react-router-dom";

import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const TAMANHO_MAXIMO_CAPA = 10 * 1024 * 1024;
const TAMANHO_MAXIMO_MANUSCRITO = 50 * 1024 * 1024;
const FORMATOS_CAPA = ["image/jpeg", "image/png"];

const LARGURA_MINIMA_A5_PX = 1748;
const ALTURA_MINIMA_A5_PX = 2480;



    const dataURItoBlob = (dataURI) => {

    let byteString = atob(dataURI.split(',')[1]);


    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];


    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: mimeString});

  }

const formatarMB = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const validarCapa = (arquivo) => {
  if (!FORMATOS_CAPA.includes(arquivo.type)) {
    return "Formato inválido. Envie uma imagem JPG, JPEG ou PNG.";
  }

  if (arquivo.size <= 0) {
    return "O arquivo está vazio.";
  }

  if (arquivo.size > TAMANHO_MAXIMO_CAPA) {
    return `A imagem tem ${formatarMB(arquivo.size)}. O limite é 10 MB.`;
  }

  return null;
};

const fileToDataUri = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result)
    };
    reader.readAsDataURL(file);
    })

const obterDimensoesImagem = (arquivo) =>
  new Promise((resolve, reject) => {
    const imagem = new Image();
    const url = URL.createObjectURL(arquivo);

    imagem.onload = () => {
      const dimensoes = {
        largura: imagem.naturalWidth,
        altura: imagem.naturalHeight,
      };

      URL.revokeObjectURL(url);
      resolve(dimensoes);
    };

    imagem.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler as dimensões da imagem."));
    };

    imagem.src = url;
  });


function DimensoesCapa({ dimensoes }) {
  if (!dimensoes) return null;

  return (
    <p className={styles.dimensoes}>
      Dimensões: {dimensoes.largura} × {dimensoes.altura} px
    </p>
  );
}

export default function Conteudo({
  dados,
  onChange,
  irParaProximaEtapa,
  voltarEtapa,
}) {


  const [manuscritoFile, setmanuscritoFile] = useState("");

useEffect(() => {

     if(dados.manuscrito != null){
      const file = dataURItoBlob(dados.manuscrito);
      setmanuscritoFile(file);
    }

}, [])


  const atualizarCampo = async (chave, e) => {
    const input = e.target;
    const arquivo = input.files?.[0];
    const blob = await fileToDataUri(arquivo);

    if (!arquivo) return;
    if (chave === "manuscrito") {
      if (
        arquivo.type !== "application/pdf" &&
        !arquivo.name.toLowerCase().endsWith(".pdf")
      ) {
        window.alert("Formato inválido. Envie o manuscrito em PDF.");
        input.value = "";
        return;
      }

      if (arquivo.size <= 0 || arquivo.size > TAMANHO_MAXIMO_MANUSCRITO) {
        window.alert(
          arquivo.size <= 0
            ? "O arquivo está vazio."
            : "O manuscrito deve ter no máximo 50 MB.",
        );
        input.value = "";
        return;
      }

      try {
        const buffer = await arquivo.arrayBuffer();

        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(buffer),
        });

        const pdfDocument = await loadingTask.promise;
        const numeroPaginas = pdfDocument.numPages;

        
        if (!numeroPaginas || numeroPaginas < 1) {
          throw new Error("O PDF não possui páginas válidas.");
        }

        const file = dataURItoBlob(blob);
        setmanuscritoFile(file);

        onChange({
          ...dados,
          manuscrito: blob,
          numeroPaginas,
        });

        await pdfDocument.destroy();
      } catch (erro) {
        console.error("Erro ao calcular páginas do PDF:", erro);

        window.alert(
          "Não foi possível calcular as páginas do manuscrito. Verifique se o PDF é válido.",
        );

        input.value = "";
      }

      return;
    }

    

    onChange({
      ...dados,
      [chave]: blob,
    });
  };

  console.log(dados);

  const atualizarCapa = async (parte, e) => {
    const input = e.target;
    const arquivo = input.files?.[0];
    const blob = await fileToDataUri(arquivo);

    if (!arquivo) return;

    const erro = validarCapa(arquivo);

    if (erro) {
      window.alert(erro);
      input.value = "";
      return;
    }

    try {
      const dimensoes = await obterDimensoesImagem(arquivo);

      if (
        dimensoes.largura < LARGURA_MINIMA_A5_PX ||
        dimensoes.altura < ALTURA_MINIMA_A5_PX
      ) {
        window.alert(
          `A imagem da ${parte} da capa tem ${dimensoes.largura} × ${dimensoes.altura} px. ` +
            `Para o padrão A5, recomendamos no mínimo ${LARGURA_MINIMA_A5_PX} × ${ALTURA_MINIMA_A5_PX} px (300 DPI, sem sangria).`,
        );

        input.value = "";
        return;
      }

      console.log(blob);

      onChange({
        ...dados,
        capa: {
          ...dados.capa,
          [parte]: blob,
        },
        dimensoesCapa: {
          ...dados.dimensoesCapa,
          [parte]: dimensoes,
        },
      });
    } catch (erroLeitura) {
      window.alert(erroLeitura.message);
      input.value = "";
    }
  };

  console.log(manuscritoFile);

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
                Aceitamos apenas arquivos .pdf (máximo 50 MB)
              </span>
            </span>

            <input
              type="file"
              hidden
              accept=".pdf,application/pdf"
              onChange={(e) => atualizarCampo("manuscrito", e)}
            />
          </label>

          {dados?.manuscrito && (

                <div className={styles.manuscrito}>
                  <p className={styles.pmanuscrito}>
                    ✓ Manuscrito carregado{" "}
                    {dados.orcamento?.numeroPaginas &&
                      `(${dados.orcamento.numeroPaginas} páginas)`}
                  </p>

                  <a
                    href={dados.manuscrito}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.btnmanus}
                  >
                    Abrir manuscrito (PDF)
                  </a>

                  <div className={styles.embed}>
                    <embed src={dados.manuscrito} type="application/pdf" />
                  </div>
                </div>
          )}
        </div>

        <div className={styles.card}>
          <legend>Capa do Livro</legend>

          <div className={styles.especificacoes}>
            <h2>Especificações das capas — formato A5</h2>

            <ul>
              <li>Formato final do livro: 14,8 × 21 cm (A5).</li>
              <li>
                Frente e verso: recomendamos no mínimo 1748 × 2480 px,
                equivalente a 300 DPI para o formato A5, sem incluir sangria.
              </li>
              <li>Formatos aceitos: JPG, JPEG e PNG.</li>
              <li>Tamanho máximo: 10 MB por imagem.</li>
              <li>As dimensões reais serão exibidas após o carregamento.</li>
            </ul>

            <p>
              A medida de 14,8 × 21 cm corresponde ao tamanho final após o
              corte. A gráfica pode exigir sangria adicional; confirme essa
              especificação antes de preparar os arquivos finais para impressão.
            </p>
          </div>

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
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(e) => atualizarCapa("frente", e)}
              />
            </label>

            {dados?.capa?.frente && (
              <PreviewArquivo arquivo={dados.capa.frente} tipo="imagem">
                {(preview) => (
                  <div className={styles.preview}>
                    <img
                      src={preview}
                      alt="Prévia da frente da capa"
                      width="150"
                    />
                  </div>
                )}
              </PreviewArquivo>
            )}

            <DimensoesCapa dimensoes={dados.dimensoesCapa?.frente} />
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
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                onChange={(e) => atualizarCapa("verso", e)}
              />
            </label>

            {dados?.capa?.verso && (
              <PreviewArquivo arquivo={dados.capa.verso} tipo="imagem">
                {(preview) => (
                  <div className={styles.preview}>
                    <img
                      src={preview}
                      alt="Prévia do verso da capa"
                      width="150"
                    />
                  </div>
                )}
              </PreviewArquivo>
            )}

            <DimensoesCapa dimensoes={dados.dimensoesCapa?.verso} />
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
