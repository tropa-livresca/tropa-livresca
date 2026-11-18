import { useEffect, useState } from "react";
import styles from "./Confirmacao.module.css";
import { FaPen, FaFilePdf } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { LIVRO_ESTADO } from "../../../../../common/config/livroEstados";

function criarUrlPreview(arquivo, urlsTemporarias) {
  if (!arquivo) return "";

  // Arquivos já enviados ao PocketBase.
  if (typeof arquivo === "string") return arquivo;

  // Arquivos selecionados no navegador.
  if (arquivo instanceof Blob) {
    const url = URL.createObjectURL(arquivo);
    urlsTemporarias.push(url);
    return url;
  }

  return "";
}

function mapearIdioma(idioma) {
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
}

function exibirValor(valor) {
  return valor !== null && valor !== undefined && valor !== ""
    ? valor
    : "Não informado";
}

export default function Confirmacao({
  dados,
  irParaEtapaEspecifica,
  publicarLivro,
  erro,
}) {
  const navigate = useNavigate();

  const [previews, setPreviews] = useState({
    manuscrito: "",
    frente: "",
    verso: "",
  });

  const [salvando, setSalvando] = useState(false);
  const [erroLocal, setErroLocal] = useState(null);

  const detalhes = dados?.detalhes || {};
  const conteudo = dados?.conteudo || {};
  const capa = conteudo.capa || {};
  const orcamento = dados?.orcamento || {};

  const manuscrito = conteudo.manuscrito;
  const capaFrente = capa.frente;
  const capaVerso = capa.verso;

  // Gera URLs temporárias para arquivos locais e preserva URLs do PocketBase.
  useEffect(() => {
    const urlsTemporarias = [];

    setPreviews({
      manuscrito: criarUrlPreview(manuscrito, urlsTemporarias),
      frente: criarUrlPreview(capaFrente, urlsTemporarias),
      verso: criarUrlPreview(capaVerso, urlsTemporarias),
    });

    return () => {
      urlsTemporarias.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [manuscrito, capaFrente, capaVerso]);

  const salvarLivroERedirecionar = async (estado) => {
    if (salvando) return;

    setSalvando(true);
    setErroLocal(null);

    try {
      await publicarLivro(estado);
      navigate("/meuslivros");
    } catch (error) {
      console.error("Erro ao salvar o livro:", error);
      setErroLocal(
        error?.message || "Não foi possível salvar o livro. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  };

  const mensagemErro = erroLocal || erro;

  const capas = [
    {
      titulo: "Frente",
      preview: previews.frente,
      mensagem: "Imagem da frente não adicionada.",
      alt: "Frente da capa",
    },
    {
      titulo: "Verso",
      preview: previews.verso,
      mensagem: "Imagem do verso não adicionada.",
      alt: "Verso da capa",
    },
  ];

  return (
    <main>
      {/* Detalhes do livro */}
      <div className={styles.form}>
        <div className={styles.tituloContainer}>
          <h1 className={styles.titulo}>Confirmação</h1>

          <button
            type="button"
            onClick={() => irParaEtapaEspecifica(1)}
            className={styles.btnEditarDescricao}
            title="Editar informações"
            aria-label="Editar informações"
            disabled={salvando}
          >
            <FaPen />
            <span>Editar</span>
          </button>
        </div>

        <div className={styles.detalhesContainer}>
          <div className={styles.card}>
            <legend>Título e Subtítulo</legend>

            <div className={styles.containergrid}>
              <div>
                <label>Título:</label>
                <div className={styles.liinput}>
                  {exibirValor(detalhes.titulo)}
                </div>
              </div>

              <div>
                <label>Subtítulo:</label>
                <div className={styles.liinput}>
                  {exibirValor(detalhes.subtitulo)}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <legend>Edição</legend>

            <div className={styles.containergrid}>
              <div className={styles.colunaCompleta}>
                <label>ISBN do livro:</label>

                <div className={styles.liinput}>
                  <span className={styles.numero}>
                    {exibirValor(detalhes.ISBN)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardInformacoes}`}>
            <legend>Informações do Livro</legend>

            <div className={styles.containergrid}>
              <div>
                <label>Idioma:</label>
                <div className={styles.liinput}>
                  {mapearIdioma(detalhes.idioma)}
                </div>
              </div>

              <div>
                <label>Direitos de Publicação e Uso de IA:</label>
                <div className={styles.liinput}>
                  {exibirValor(detalhes.direitoPublicacao)}
                </div>
              </div>

              <div>
                <label>Categoria:</label>
                <div className={styles.liinput}>
                  {exibirValor(detalhes.categoria)}
                </div>
              </div>

              <div>
                <label>Colaboradores:</label>

                <div className={styles.liinput}>
                  {detalhes.colaboradores?.length
                    ? detalhes.colaboradores
                        .map(
                          (colaborador) =>
                            `${colaborador.nome || ""} ${
                              colaborador.sobrenome || ""
                            } (${colaborador.funcao || "Função não informada"})`,
                        )
                        .join(", ")
                    : "Nenhum"}
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.card} ${styles.cardDescricao}`}>
            <legend>Descrição</legend>

            <div>
              <label>Descrição do livro:</label>

              <div className={styles.liinput2}>
                {exibirValor(detalhes.descricao)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manuscrito */}
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
                previews.manuscrito
                  ? styles.statusCarregado
                  : styles.statusNaoEnviado
              }`}
            >
              <span className={styles.statusPonto}></span>

              {previews.manuscrito ? "Arquivo carregado" : "Não enviado"}
            </div>
          </div>

          {previews.manuscrito ? (
            <div className={styles.previewContainer}>
              <div className={styles.previewspan}>
                <span>Documento PDF</span>
              </div>

              <iframe
                src={previews.manuscrito}
                title="Pré-visualização do manuscrito"
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

      {/* Capas */}
      <div className={styles.form}>
        <div className={styles.tituloContainer}>
          <h1 className={styles.titulo}>Imagens da Capa</h1>

          <button
            type="button"
            onClick={() => irParaEtapaEspecifica(2)}
            className={styles.btnEditarDescricao}
            title="Editar imagens da capa"
            aria-label="Editar imagens da capa"
            disabled={salvando}
          >
            <FaPen />
            <span>Editar</span>
          </button>
        </div>

        <div className={styles.capa}>
          {capas.map((item) => (
            <div
              key={item.titulo}
              className={`${styles.capas} ${styles.card2}`}
            >
              <p className={styles.fvo}>
                <small>{item.titulo}:</small>
              </p>

              <div className={styles.imagemContainer}>
                {item.preview ? (
                  <img
                    src={item.preview}
                    alt={item.alt}
                    className={styles.fvoimg}
                  />
                ) : (
                  <span className={styles.imgerro}>{item.mensagem}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orçamento */}
      <div className={`${styles.form} ${styles.formOrcamento}`}>
        <div className={styles.tituloContainer}>
          <h1 className={styles.titulo}>Orçamento</h1>

          <button
            type="button"
            onClick={() => irParaEtapaEspecifica(3)}
            className={styles.btnEditarDescricao}
            title="Editar orçamento"
            aria-label="Editar orçamento"
            disabled={salvando}
          >
            <FaPen />
            <span>Editar</span>
          </button>
        </div>

        <div className={styles.orcamentoCapa}>
          <div className={styles.orcamentoCard}>
            <p className={styles.orcamentoTitulo}>
              <small>Valor do Livro Físico:</small>
            </p>

            <div className={styles.orcamentoConteudo}>
              <span className={styles.numero}>
                {exibirValor(orcamento.valorLivroFisico)}
              </span>
            </div>
          </div>

          <div className={styles.orcamentoCard}>
            <p className={styles.orcamentoTitulo}>
              <small>Valor do Livro Digital:</small>
            </p>

            <div className={styles.orcamentoConteudo}>
              <span className={styles.numero}>
                {exibirValor(orcamento.valorLivroDigital)}
              </span>
            </div>
          </div>

          <div className={styles.paginasCard}>
            <span>Número de páginas</span>

            <strong className={styles.numero}>
              {exibirValor(orcamento.numeroPaginas)}
            </strong>
          </div>
        </div>

        {mensagemErro && (
          <div className={styles.erro} role="alert">
            {mensagemErro}
          </div>
        )}
      </div>

      {/* Ações */}
      <div className={styles.botoes}>
        <Link
          to="/meuslivros"
          className={styles.btn}
          aria-disabled={salvando}
          onClick={(event) => {
            if (salvando) event.preventDefault();
          }}
        >
          Voltar a Meus Livros
        </Link>

        <button
          type="button"
          onClick={() => salvarLivroERedirecionar(LIVRO_ESTADO.EM_REVISAO)}
          className={styles.btnenviar}
          disabled={salvando}
        >
          {salvando ? "Enviando..." : "Enviar para Revisão"}
        </button>

        <button
          type="button"
          onClick={() => salvarLivroERedirecionar(LIVRO_ESTADO.RASCUNHO)}
          className={styles.btnsalvar}
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Salvar como Rascunho"}
        </button>
      </div>
    </main>
  );
}
