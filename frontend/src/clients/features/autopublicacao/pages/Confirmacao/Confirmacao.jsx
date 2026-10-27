import { useEffect, useState } from "react";
import styles from "./Confirmacao.module.css";
import { FaPen } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LIVRO_ESTADO } from "../../../../../common/config/livroEstados";

const dataURItoBlob = (dataURI) => {
  let byteString = atob(dataURI.split(",")[1]);

  let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

export default function Confirmacao({
  dados,
  irParaEtapaEspecifica,
  publicarLivro,
}) {
  const navigate = useNavigate();

  const salvarLivroERedirecionar = async (estado) => {
    try {
      await publicarLivro(estado);
      navigate("/meuslivros");
    } catch (erro) {
      console.error("Erro ao salvar o livro:", erro);
    }
  };

  const mapearIdioma = (idioma) => {
    if (!idioma) return "Não informado";

    const dicionario = {
      ingles: "Inglês",
      portugues: "Português",
      espanhol: "Espanhol",
    };

    return (
      dicionario[idioma.toLowerCase()] ||
      idioma.charAt(0).toUpperCase() + idioma.slice(1)
    );
  };

  const [manuscritoFile, setManuscritoFile] = useState(null);

  useEffect(() => {
    if (dados.conteudo.manuscrito != null) {
      const file = dataURItoBlob(dados.conteudo.manuscrito);
      setManuscritoFile(file);
    }
  }, []);

  return (
    <main>
      {manuscritoFile != null ? (
        <>
          <div className={styles.embed}>
            <embed src={manuscritoFile} type="application/pdf" />
          </div>
          <a
            href={manuscritoFile}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.btnmanus}
          >
            Abrir manuscrito (PDF)
          </a>
        </>
      ) : (
        <></>
      )}

      <div className={styles.form}>
        <div className={styles.tituloContainer}>
          <h1 className={styles.titulo}>Confirmação</h1>

          <button
            type="button"
            onClick={() => irParaEtapaEspecifica(1)}
            className={styles.btnEditarDescricao}
            title="Editar"
            aria-label="Editar"
          >
            <FaPen />
            <span>Editar</span>
          </button>
        </div>

        {dados.detalhes && (
          <div>
            <div className={styles.card}>
              <legend>Título e Subtítulo</legend>

              <div className={styles.containergrid}>
                <div>
                  <label>Título:</label>
                  <div className={styles.liinput}>{dados.detalhes.titulo}</div>
                </div>

                <div>
                  <label>Subtítulo:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.subtitulo}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <legend>Edição</legend>

              <div className={styles.containergrid}>
                <div>
                  <label>ISBN do livro:</label>
                  <div className={styles.liinput}>{dados.detalhes.ISBN}</div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <legend>Informações do Livro</legend>

              <div className={styles.containergrid}>
                <div>
                  <label>Idioma:</label>
                  <div className={styles.liinput}>
                    {mapearIdioma(dados.detalhes.idioma)}
                  </div>
                </div>

                <div>
                  <label>Direitos de Publicação e Uso de IA:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.direitoPublicacao}
                  </div>
                </div>

                <div>
                  <label>Categoria:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.categoria}
                  </div>
                </div>

                <div className={styles.colunaCompleta}>
                  <label>Colaboradores:</label>

                  <div className={styles.liinput}>
                    {dados.detalhes.colaboradores
                      ?.map((c) => `${c.nome} ${c.sobrenome} (${c.funcao})`)
                      .join(", ") || "Nenhum"}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <legend>Descrição</legend>

              <div>
                <label>Descrição do livro:</label>

                <div className={styles.liinput2}>
                  {dados.detalhes.descricao}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div>
        <div>
          <div>
            <div className={styles.containerManuscrito}>
              <div className={styles.form}>
                <div className={styles.manuscritoHeader}>
                  <div>
                    <h1 className={styles.titulo}>Manuscrito</h1>

                    <p className={styles.manuscritoDescricao}>
                      Pré-visualização do arquivo enviado
                    </p>
                  </div>

                  <div
                    className={`${styles.statusArquivo} ${
                      dados.conteudo?.manuscrito
                        ? styles.statusCarregado
                        : styles.statusNaoEnviado
                    }`}
                  >
                    <span className={styles.statusPonto}></span>

                    {dados.conteudo?.manuscrito
                      ? "Arquivo carregado"
                      : "Não enviado"}
                  </div>
                </div>

                {dados.conteudo.manuscrito ? (
                  <div className={styles.previewContainer}>
                    <div className={styles.previewspan}>
                      <span>Documento PDF</span>
                    </div>

                    <iframe
                      src={dados.conteudo.manuscrito}
                      title="Pré-visualização do Manuscrito"
                      type="application/pdf"
                      className={styles.iframe}
                    />
                  </div>
                ) : (
                  <div className={styles.semArquivo}>
                    <span className={styles.semArquivoIcon}>
                      <FaFilePdf />
                    </span>

                    <strong>Nenhum manuscrito enviado</strong>

                    <p>O arquivo do manuscrito não foi encontrado.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.form}>
            <div className={styles.tituloContainer}>
              <h1 className={styles.titulo}>Imagens da Capa</h1>
              <button
                onClick={() => irParaEtapaEspecifica(2)}
                className={styles.btnEditarDescricao}
              >
                <FaPen />
                <span>Editar</span>
              </button>
            </div>
            <div className={styles.capa}>
              {dados.conteudo.capa.frente ? (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Frente:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <img
                      src={dados.conteudo.capa.frente}
                      alt="Frente da Capa"
                      className={styles.fvoimg}
                    />
                  </div>
                </div>
              ) : (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Frente:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <span className={styles.imgerro}>
                      Imagem da frente não adicionada.
                    </span>
                  </div>
                </div>
              )}

              {dados.conteudo.capa.verso ? (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Verso:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <img
                      src={dados.conteudo.capa.verso}
                      alt="Verso da Capa"
                      className={styles.fvoimg}
                    />
                  </div>
                </div>
              ) : (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Verso:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <span className={styles.imgerro}>
                      Imagem do verso não adicionada.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.form} ${styles.formOrcamento}`}>
        <div className={styles.tituloContainer}>
          <h1 className={styles.titulo}>Orçamento</h1>

          <button
            type="button"
            onClick={() => irParaEtapaEspecifica(3)}
            className={styles.btnEditarDescricao}
            title="Editar"
            aria-label="Editar"
          >
            <FaPen />
            <span>Editar</span>
          </button>
        </div>

        {dados.orcamento && (
          <div className={styles.orcamentoCapa}>
            <div className={styles.orcamentoCard}>
              <p className={styles.orcamentoTitulo}>
                <small>Valor do Livro Físico:</small>
              </p>

              <div className={styles.orcamentoConteudo}>
                <span className={styles.numero}>
                  {dados.orcamento.valorLivroFisico}
                </span>
              </div>
            </div>

            <div className={styles.orcamentoCard}>
              <p className={styles.orcamentoTitulo}>
                <small>Valor do Livro Digital:</small>
              </p>

              <div className={styles.orcamentoConteudo}>
                <span className={styles.numero}>
                  {dados.orcamento.valorLivroDigital}
                </span>
              </div>
            </div>

            <div>Número de páginas: {dados.orcamento.numeroPaginas}</div>
          </div>
        )}
      </div>

      <div className={styles.botoes}>
        <Link to="/meuslivros" className={styles.btn}>
          Voltar a Meus Livros
        </Link>

        <button
          type="button"
          onClick={() => salvarLivroERedirecionar(LIVRO_ESTADO.EM_REVISAO)}
          className={styles.btnenviar}
        >
          Enviar para Revisão
        </button>

        <button
          type="button"
          onClick={() => salvarLivroERedirecionar(LIVRO_ESTADO.RASCUNHO)}
          className={styles.btnsalvar}
        >
          Salvar como Rascunho
        </button>
      </div>
    </main>
  );
}
