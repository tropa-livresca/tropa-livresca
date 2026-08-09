﻿import { useState, useEffect } from "react";
import styles from "./Confirmacao.module.css";

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
        <h1 className={styles.titulo}>Confirmação</h1>

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
                  <label>Categorias:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.categorias?.join(", ")}
                  </div>
                </div>

                <div>
                  <label>Palavras-chave:</label>
                  <div className={styles.liinput}>
                    {dados.detalhes.palavrasChave?.join(", ")}
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
                <div className={styles.liinput}>{dados.detalhes.descricao}</div>
              </div>
            </div>
          </div>
        )}
        {!isBloqueadoParaEdicao && (
          <button
            onClick={() => irParaEtapaEspecifica(1)}
            className={styles.btn}
          >
            Editar
          </button>
        )}
      </div>

      <div>
        <div>
          <div>
            <p>
              <strong>Manuscrito:</strong>{" "}
              {dados.conteudo?.manuscrito ? "Arquivo carregado" : "Não enviado"}
            </p>
            {urlPreviewManga && (
              <iframe
                src={urlPreviewManga}
                title="Pré-visualização do Manuscrito"
                type="application/pdf"
                width="100%"
                height="200px"
              />
            )}
          </div>
          <p>
            <strong>Imagens da Capa:</strong>
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {urlPreviewFrente && (
              <div>
                <p>
                  <small>Frente:</small>
                </p>
                <img src={urlPreviewFrente} alt="Frente da Capa" width="150" />
              </div>
            )}
            {urlPreviewVerso && (
              <div>
                <p>
                  <small>Verso:</small>
                </p>
                <img src={urlPreviewVerso} alt="Verso da Capa" width="150" />
              </div>
            )}
            {urlPreviewOrelhas && (
              <div>
                <p>
                  <small>Orelhas:</small>
                </p>
                <img
                  src={urlPreviewOrelhas}
                  alt="Orelhas da Capa"
                  width="150"
                />
              </div>
            )}
          </div>
          {!isBloqueadoParaEdicao && (
            <button onClick={() => irParaEtapaEspecifica(2)}>Editar</button>
          )}
        </div>
      </div>
      <div>
        Orçamento:
        {dados.orcamento && (
          <ul>
            <li>Tipo de Formatação: {dados.orcamento.tipoFormatacao}</li>
            <li>Valor do Livro Físico: {dados.orcamento.valorLivroFisico}</li>
            <li>Valor do Livro Digital: {dados.orcamento.valorLivroDigital}</li>
          </ul>
        )}
        {!isBloqueadoParaEdicao && (
          <button onClick={() => irParaEtapaEspecifica(3)}>Editar</button>
        )}
      </div>
      <div>
        {!isBloqueadoParaEdicao ? (
          <>
            <button type="button" onClick={() => publicarLivro("em_revisao")}>
              Enviar para Revisão
            </button>
            <button type="button" onClick={() => publicarLivro("rascunho")}>
              Salvar como Rascunho
            </button>
          </>
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