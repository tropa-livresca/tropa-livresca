﻿import { useState, useEffect } from "react";
import styles from "./Confirmacao.module.css";
import { FaPen } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Confirmacao({
  dados,
  irParaEtapaEspecifica,
  publicarLivro,
  isBloqueadoParaEdicao,
}) {
  const [urlPreviewManga, setUrlPreviewManga] = useState(null);
  const [urlPreviewFrente, setUrlPreviewFrente] = useState(null);
  const [urlPreviewVerso, setUrlPreviewVerso] = useState(null);
  const [urlPreviewOrelhas, setUrlPreviewOrelhas] = useState(null);

  useEffect(() => {
    let urlManga = null;
    let urlFrente = null;
    let urlVerso = null;
    let urlOrelhas = null;

    const extrairArquivo = (dado) => {
      if (!dado) return null;
      if (dado instanceof File) return dado;
      if (dado instanceof FileList && dado.length > 0) return dado[0];
      if (Array.isArray(dado) && dado.length > 0) return dado[0];
      if (dado[0] instanceof File) return dado[0];
      return null;
    };

    const arquivoManuscrito = extrairArquivo(dados.conteudo?.manuscrito);
    const arquivoFrente = extrairArquivo(dados.conteudo?.capa?.frente);
    const arquivoVerso = extrairArquivo(dados.conteudo?.capa?.verso);
    const arquivoOrelhas = extrairArquivo(dados.conteudo?.capa?.orelhas);

    if (arquivoManuscrito) {
      urlManga = URL.createObjectURL(arquivoManuscrito);
      setUrlPreviewManga(urlManga);
    } else if (typeof dados.conteudo?.manuscrito === "string") {
      setUrlPreviewManga(dados.conteudo.manuscrito);
    } else {
      setUrlPreviewManga(null);
    }

    if (arquivoFrente) {
      urlFrente = URL.createObjectURL(arquivoFrente);
      setUrlPreviewFrente(urlFrente);
    } else if (typeof dados.conteudo?.capa?.frente === "string") {
      setUrlPreviewFrente(dados.conteudo.capa.frente);
    } else {
      setUrlPreviewFrente(null);
    }

    if (arquivoVerso) {
      urlVerso = URL.createObjectURL(arquivoVerso);
      setUrlPreviewVerso(urlVerso);
    } else if (typeof dados.conteudo?.capa?.verso === "string") {
      setUrlPreviewVerso(dados.conteudo.capa.verso);
    } else {
      setUrlPreviewVerso(null);
    }

    if (arquivoOrelhas) {
      urlOrelhas = URL.createObjectURL(arquivoOrelhas);
      setUrlPreviewOrelhas(urlOrelhas);
    } else if (typeof dados.conteudo?.capa?.orelhas === "string") {
      setUrlPreviewOrelhas(dados.conteudo.capa.orelhas);
    } else {
      setUrlPreviewOrelhas(null);
    }

    return () => {
      if (urlManga) URL.revokeObjectURL(urlManga);
      if (urlFrente) URL.revokeObjectURL(urlFrente);
      if (urlVerso) URL.revokeObjectURL(urlVerso);
      if (urlOrelhas) URL.revokeObjectURL(urlOrelhas);
    };
  }, [dados.conteudo]);

  return (
    <main>
      <div className={styles.form}>
        <div className={styles.tituloContainer}>
          <h1 className={styles.titulo}>Confirmação</h1>

          {!isBloqueadoParaEdicao && (
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
          )}
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

                {urlPreviewManga ? (
                  <div className={styles.previewContainer}>
                    <div className={styles.previewspan}>
                      <span>Documento PDF</span>
                    </div>

                    <iframe
                      src={urlPreviewManga}
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
              {!isBloqueadoParaEdicao && (
                <button
                  onClick={() => irParaEtapaEspecifica(2)}
                  className={styles.btnEditarDescricao}
                >
                  <FaPen />
                  <span>Editar</span>
                </button>
              )}
            </div>
            <div className={styles.capa}>
              {urlPreviewFrente ? (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Frente:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <img
                      src={urlPreviewFrente}
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

              {urlPreviewVerso ? (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Verso:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <img
                      src={urlPreviewVerso}
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

              {urlPreviewOrelhas ? (
                <div className={`${styles.capas} ${styles.card2}`}>
                  <p className={styles.fvo}>
                    <small>Orelhas:</small>
                  </p>
                  <div className={styles.imagemContainer}>
                    <img
                      src={urlPreviewOrelhas}
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

          {!isBloqueadoParaEdicao && (
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
          )}
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
        {!isBloqueadoParaEdicao ? (
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
        ) : (
          <p style={{ color: "orange", fontWeight: "bold" }}>
            Este livro está em modo de leitura e não pode receber ações de
            envio.
          </p>
        )}
      </div>
    </main>
  );
}
