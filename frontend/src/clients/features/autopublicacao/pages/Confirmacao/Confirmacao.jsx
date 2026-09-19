﻿import { useEffect, useMemo } from "react";
import styles from "./Confirmacao.module.css";
import { FaPen } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Confirmacao({
  dados,
  irParaEtapaEspecifica,
  publicarLivro,
}) {
  const extrairArquivo = (dado) => {
    if (!dado) return null;
    if (dado instanceof File) return dado;
    if (dado instanceof FileList && dado.length > 0) return dado[0];
    if (Array.isArray(dado) && dado.length > 0) return dado[0];
    return null;
  };

  const previews = useMemo(() => {
    const urlsCriadas = [];

    const obterUrl = (campo) => {
      const arquivo = extrairArquivo(campo);
      if (arquivo) {
        const url = URL.createObjectURL(arquivo);
        urlsCriadas.push(url);
        return url;
      }
      if (typeof campo === "string") return campo;
      return null;
    };

    return {
      manga: obterUrl(dados?.conteudo?.manuscrito),
      frente: obterUrl(dados?.conteudo?.capa?.frente),
      verso: obterUrl(dados?.conteudo?.capa?.verso),
      orelhas: obterUrl(dados?.conteudo?.capa?.orelhas),
      _urlsCriadas: urlsCriadas,
    };
  }, [dados?.conteudo]);

  useEffect(() => {
    return () => {
      previews._urlsCriadas.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <main>
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
                  <div className={styles.liinput}>{dados.detalhes.Isbn}</div>
                </div>

                <div>
                  <label>Número da edição:</label>
                  <div className={styles.liinput}>{dados.detalhes.edicao}</div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <legend>Informações do Livro</legend>

              <div className={styles.containergrid}>
                <div>
                  <label>Idioma:</label>
                  <div className={styles.liinput}>{dados.detalhes.idioma}</div>
                </div>

                <div>
                  <label>Direito de Publicação e Uso de IA:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.direitoPublicacao}
                  </div>
                </div>

                <div>
                  <label>Autor:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.autor?.nome}{" "}
                    {dados.detalhes.autor?.sobrenome}
                  </div>
                </div>

                <div>
                  <label>Restrição de Conteúdo:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.restricaoConteudo}
                  </div>
                </div>

                <div>
                  <label>Categoria:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.categorias?.join(", ")}
                  </div>
                </div>

                <div>
                  <label>Palavras-chave:</label>
                  <div className={styles.liinput}>
                    <div className={styles.chips}>
                      {dados.detalhes.palavrasChave?.map((palavra, i) => (
                        <span key={i} className={styles.chip}>
                          {palavra}
                        </span>
                      ))}
                    </div>
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

                {previews ? (
                  <div className={styles.previewContainer}>
                    <div className={styles.previewspan}>
                      <span>Documento PDF</span>
                    </div>

                    <iframe
                      src={previews.manga}
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
              {previews.frente ? (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Frente:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <img
                      src={previews.frente}
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

              {previews.verso ? (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Verso:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <img
                      src={previews.verso}
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

              {previews.orelhas ? (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Orelhas:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <img
                      src={previews.orelhas}
                      alt="Orelhas da Capa"
                      className={styles.fvoimg}
                    />
                  </div>
                </div>
              ) : (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Orelhas:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <span className={styles.imgerro}>
                      Imagem das orelhas não adicionada.
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
          </div>
        )}
      </div>
      <div>
        <div className={styles.botoes}>
          <Link to="/meuslivros" className={styles.btn}>
            Voltar a Meus Livros
          </Link>

          <button
            type="button"
            onClick={() => publicarLivro("em_revisao")}
            className={styles.btnenviar}
          >
            Enviar para Revisão
          </button>

          <button
            type="button"
            onClick={() => publicarLivro("rascunho")}
            className={styles.btnsalvar}
          >
            Salvar como Rascunho
          </button>
        </div>
      </div>
    </main>
  );
}
