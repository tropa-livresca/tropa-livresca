import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLivros } from "../../hooks/useLivros";
import styles from "./VisualizarLivro.module.css";
import { FiArrowLeft, FiExternalLink } from "react-icons/fi";
import Carregando from "../../../../components/Carregando/Carregando";

const ROTULO_ESTADO = {
  rascunho: "Rascunho",
  em_revisao: "Em revisão",
  publicado: "Publicado",
  negado: "Negado",
  recall: "Recall",
};

const formatarPreco = (valor) =>
  Number(valor) > 0
    ? `R$ ${Number(valor).toFixed(2).replace(".", ",")}`
    : "Não vendido";

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

export default function VisualizarLivro() {
  const { id } = useParams();
  const { buscarLivroById, carregando, livro, alterarAtivo } = useLivros();
  const [salvando, setSalvando] = useState(false);
  const [erroAtivo, setErroAtivo] = useState(null);

  useEffect(() => {
    if (id) {
      buscarLivroById(id);
    }
  }, [id, buscarLivroById]);

  if (carregando) {
    return <Carregando mensagem="Carregando livro..." />;
  }

  if (!livro) {
    return (
      <main className={styles.mainContainer}>
        <div className={styles.container}>
          <p className={styles.semDados}>Livro não encontrado.</p>
          <Link to="/admin/livros/painel" className={styles.btnVoltar}>
            <FiArrowLeft /> Voltar ao painel
          </Link>
        </div>
      </main>
    );
  }

  const {
    titulo,
    estado,
    subtitulo,
    capa,
    manuscrito,
    users_profile,
    descricao,
    idioma,
    categoria,
    preco_digital,
    preco_fisico,
    colaboradores,
    direitos_de_publicacao,
    ativo,
  } = livro;

  const handleAlterarAtivo = async () => {
    const mensagem = ativo
      ? `Tirar "${titulo}" da loja? Ele deixa de aparecer para os leitores, mas vendas e revisões são mantidas.`
      : `Colocar "${titulo}" de volta na loja?`;
    if (!window.confirm(mensagem)) return;

    setSalvando(true);
    setErroAtivo(await alterarAtivo(id, !ativo));
    setSalvando(false);
  };

  let capaObjeto = null;
  try {
    capaObjeto = typeof capa === "string" ? JSON.parse(capa) : capa;
  } catch (e) {
    console.error("Erro ao converter capa JSONB:", e);
  }

  const temCapa = Boolean(capaObjeto?.frente || capaObjeto?.verso);

  return (
    <main className={styles.mainContainer}>
      <header className={styles.topo}>
        <div className={styles.topoConteudo}>
          <div className={styles.topoTexto}>
            <h1 className={styles.titulo}>{titulo}</h1>
            {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
          </div>

          <div className={styles.acoes}>
            <Link to="/admin/livros/painel" className={styles.btnVoltar}>
              <FiArrowLeft /> Voltar ao painel
            </Link>

            <button
              type="button"
              onClick={handleAlterarAtivo}
              disabled={salvando}
              className={ativo ? styles.btnInativar : styles.btnAtivar}
            >
              {salvando
                ? "Salvando..."
                : ativo
                  ? "Tirar da loja"
                  : "Colocar de volta na loja"}
            </button>
            {erroAtivo && <p className={styles.erroAtivo}>{erroAtivo}</p>}
          </div>
        </div>
      </header>

      <section className={`${styles.container} ${styles.layoutGrid}`}>
        <div className={styles.mainContent}>
          <div className={styles.cartao}>
            <h2 className={styles.secaoTitulo}>Sinopse / Descrição</h2>
            <p className={styles.desc1}>
              Conheça a história e o universo da obra.
            </p>
            <p className={styles.descricao}>
              {descricao || "Nenhuma descrição informada."}
            </p>
          </div>

          <div className={styles.cartao}>
            <h2 className={styles.secaoTitulo}>Capas</h2>
            <p className={styles.desc}>
              Confira as capas do livro, incluindo a frente e o verso.
            </p>
            {temCapa ? (
              <div className={styles.capasContainer}>
                {capaObjeto.frente && (
                  <div className={styles.capaBox}>
                    <img src={capaObjeto.frente} alt="Capa Frente" />
                  </div>
                )}
                {capaObjeto.verso && (
                  <div className={styles.capaBox}>
                    <img src={capaObjeto.verso} alt="Capa Verso" />
                  </div>
                )}
              </div>
            ) : (
              <p className={styles.capasVazio}>Nenhuma capa enviada.</p>
            )}
          </div>

          {manuscrito && (
            <div className={styles.cartao}>
              <div className={styles.cabecalhoSecao}>
                <div className={styles.manusInfo}>
                  <h2 className={styles.manus}>Manuscrito</h2>
                  <p className={styles.manup}>
                    Visualize o arquivo enviado pelo autor.
                  </p>
                </div>

                <a
                  href={manuscrito}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.linkExterno}
                >
                  Abrir em nova aba <FiExternalLink />
                </a>
              </div>
              <div className={styles.pdfWrapper}>
                <object
                  data={manuscrito}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                >
                  <p className={styles.vazio}>
                    Seu navegador não suporta a exibição de PDFs.{" "}
                    <a
                      href={manuscrito}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className={styles.btnlivro}
                    >
                      Clique aqui para baixar o arquivo.
                    </a>
                  </p>
                </object>
              </div>
            </div>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.cartao}>
            <h2 className={styles.inf}>Informações</h2>
            <p className={styles.infp}>Analise as informações do livro.</p>
            <ul className={styles.metaList}>
              <li>
                <span>Autor</span>
                <strong>
                  {users_profile?.nome} {users_profile?.sobrenome}
                </strong>
              </li>
              <li>
                <span>Status</span>
                <div>
                  <strong>{ROTULO_ESTADO[estado] || estado}</strong>
                  {!ativo && <strong>Fora da loja</strong>}
                </div>
              </li>
              <li>
                <span>Idioma</span>{" "}
                <strong>{mapearIdioma(idioma) || "Não informado"}</strong>
              </li>

              <li>
                <span>Categoria</span>{" "}
                <strong>{categoria || "Não informado"}</strong>
              </li>
              <li>
                <span>Direitos de autopublicação</span>{" "}
                <strong>{direitos_de_publicacao ? "Sim" : "Não"}</strong>
              </li>
              <li>
                <span>Colaboradores</span>
                <div>
                  {Array.isArray(colaboradores) && colaboradores.length > 0 ? (
                    colaboradores.map((colab, index) => (
                      <div key={index} className={styles.colabItem}>
                        {colab.nome} {colab.sobrenome} ({colab.funcao})
                      </div>
                    ))
                  ) : (
                    <strong>Nenhum informado</strong>
                  )}
                </div>
              </li>
            </ul>
          </div>

          <div className={styles.cartao}>
            <h2 className={styles.secaoTitulo}>Preços de venda</h2>
            <p className={styles.desc}>
              Consulte os preços de venda dos livros.
            </p>
            <div className={styles.precosGrid}>
              <div className={styles.precoItem}>
                <span>Físico</span>
                <strong className={styles.numero}>
                  {formatarPreco(preco_fisico)}
                </strong>
              </div>
              <div className={styles.precoItem}>
                <span>E-book</span>
                <strong className={styles.numero}>
                  {formatarPreco(preco_digital)}
                </strong>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
