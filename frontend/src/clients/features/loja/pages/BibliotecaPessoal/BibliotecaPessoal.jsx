import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import Carregando from "../../../../components/Carregando/Carregando";
import Popup from "../../../../components/PopUp/Popup";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao";
import { useCompra } from "../../hooks/useCompra";
import { useBibliotecaPessoal } from "../../hooks/useBibliotecaPessoal";
import styles from "./BibliotecaPessoal.module.css";

const generos = [
  "Romance",
  "Fantasia",
  "Ficção Científica",
  "Mistério",
  "Terror",
  "Aventura",
  "Drama",
  "Suspense",
  "História",
  "Adulto",
];

const idiomas = [
  { valor: "português", rotulo: "Português" },
  { valor: "inglês", rotulo: "Inglês" },
  { valor: "espanhol", rotulo: "Espanhol" },
];

const formatarData = (data) =>
  data ? new Date(data).toLocaleDateString("pt-BR") : "";

export default function BibliotecaPessoal() {
  const { livros, meta, buscarMeusLivros, carregando, erro } =
    useBibliotecaPessoal();
  const {
    reenviarEmailLivrosDigitais,
    carregando: reenviando,
  } = useCompra();
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaEnviada, setBuscaEnviada] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [categoria, setCategoria] = useState("");
  const [idioma, setIdioma] = useState("");
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    buscarMeusLivros(
      paginaAtual,
      12,
      buscaEnviada,
      filtro,
      ordem,
      categoria,
      idioma,
    );
  }, [
    paginaAtual,
    buscaEnviada,
    filtro,
    ordem,
    categoria,
    idioma,
    buscarMeusLivros,
  ]);

  const handleCategoria = (novaCategoria) => {
    setCategoria(categoria === novaCategoria ? "" : novaCategoria);
    setBusca("");
    setBuscaEnviada("");
    setPaginaAtual(1);
  };

  const handleIdioma = (novoIdioma) => {
    setIdioma(novoIdioma);
    setPaginaAtual(1);
  };

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    setOrdem(novoFiltro === "data" ? "descendente" : "ascendente");
    setPaginaAtual(1);
    setDropdownAberto(false);
  };

  const handleOrdem = (novaOrdem) => {
    setOrdem(novaOrdem);
    setPaginaAtual(1);
    setDropdownAberto(false);
  };

  const handleBusca = (event) => {
    event.preventDefault();
    setCategoria("");
    setPaginaAtual(1);
    setBuscaEnviada(busca.trim());
  };

  const handleReenviar = async (compraId) => {
    const resultado = await reenviarEmailLivrosDigitais(compraId);
    setPopup({
      tipo: resultado.sucesso ? "sucesso" : "erro",
      mensagem: resultado.sucesso
        ? `${resultado.mensagem} Enviado para o e-mail cadastrado na sua conta.`
        : `Não foi possível enviar os livros digitais para o e-mail cadastrado na sua conta. ${resultado.mensagem}`,
    });
  };

  return (
    <main>
      <DescricaoTela
        titulo="Biblioteca Pessoal"
        descricao="Aqui você pode acessar os livros digitais que comprou e reenviar o e-mail de acesso."
      />

      <div className={styles.container}>
        {erro && (
          <p className={styles.erro} role="alert">
            {erro}
          </p>
        )}

        <div className={styles.containerLivros}>
          <aside className={styles.filtros}>
            <section>
              <h2>Gênero</h2>
              <ul>
                <li
                  className={categoria === "" ? styles.filtroAtivo : ""}
                  onClick={() => handleCategoria("")}
                >
                  Todos
                </li>
                {generos.map((genero) => (
                  <li
                    key={genero}
                    className={categoria === genero ? styles.filtroAtivo : ""}
                    onClick={() => handleCategoria(genero)}
                  >
                    {genero}
                  </li>
                ))}
              </ul>
            </section>

            <section className={styles.filtroIdioma}>
              <h2>Idioma</h2>
              <ul>
                <li
                  className={idioma === "" ? styles.filtroAtivo : ""}
                  onClick={() => handleIdioma("")}
                >
                  Todos
                </li>
                {idiomas.map((item) => (
                  <li
                    key={item.valor}
                    className={idioma === item.valor ? styles.filtroAtivo : ""}
                    onClick={() => handleIdioma(item.valor)}
                  >
                    {item.rotulo}
                  </li>
                ))}
              </ul>
            </section>

            <button
              type="button"
              className={styles.limparFiltros}
              onClick={() => {
                setCategoria("");
                setIdioma("");
                setFiltro("");
                setOrdem("");
                setBusca("");
                setBuscaEnviada("");
                setPaginaAtual(1);
              }}
            >
              Limpar Filtros
            </button>
          </aside>

          <form onSubmit={handleBusca} className={styles.busca} role="search">
            <span className={styles.iconeBusca}>
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar livro"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
            <div className={styles.selectContainer}>
              <button
                type="button"
                className={styles.select}
                onClick={() => setDropdownAberto(!dropdownAberto)}
                aria-expanded={dropdownAberto}
              >
                <span>
                  {filtro === "alfabetico"
                    ? "Ordem Alfabética"
                    : filtro === "data"
                      ? "Data de Publicação"
                      : "Ordenar por"}
                </span>
                <FiChevronDown
                  className={dropdownAberto ? styles.setaAberta : ""}
                />
              </button>
              {dropdownAberto && (
                <div className={styles.options}>
                  <button
                    type="button"
                    onClick={() => {
                      setFiltro("");
                      setOrdem("");
                      setPaginaAtual(1);
                      setDropdownAberto(false);
                    }}
                  >
                    Ordenar por
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFiltro("alfabetico")}
                  >
                    Ordem Alfabética
                  </button>
                  <button type="button" onClick={() => handleFiltro("data")}>
                    Data de Publicação
                  </button>
                  {filtro && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOrdem("ascendente")}
                      >
                        Ascendente
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOrdem("descendente")}
                      >
                        Descendente
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <button type="submit" className={styles.botaoBuscar}>
              Buscar
            </button>
          </form>

          <div className={styles.livros}>
            {carregando ? (
              <Carregando mensagem="Carregando biblioteca..." />
            ) : livros.length === 0 ? (
              <p className={styles.semResultados}>
                Nenhum livro digital encontrado.
              </p>
            ) : (
              livros.map((livro) => {
                const capa =
                  livro.capa?.frente ||
                  (typeof livro.capa === "string" ? livro.capa : null);
                const autor = livro.users_profile
                  ? `${livro.users_profile.nome} ${livro.users_profile.sobrenome || ""}`.trim()
                  : "Autor desconhecido";

                return (
                  <article
                    className={styles.cardLivro}
                    key={`${livro.compraId}-${livro.id}`}
                  >
                    <Link
                      to={`/loja/livro/${livro.id}`}
                      className={styles.linkCapa}
                    >
                      {capa ? (
                        <img
                          src={capa}
                          alt={`Capa de ${livro.titulo}`}
                          className={styles.capa}
                        />
                      ) : (
                        <div className={styles.semCapa}>Sem imagem</div>
                      )}
                    </Link>
                    <div className={styles.infoLivro}>
                      <Link
                        to={`/loja/livro/${livro.id}`}
                        className={styles.linkLivro}
                      >
                        <h2>{livro.titulo}</h2>
                      </Link>
                      <p className={styles.autor}>{autor}</p>
                      <small>
                        Comprado em {formatarData(livro.dataCompra)}
                      </small>
                      <button
                        type="button"
                        className={styles.botaoReenviar}
                        onClick={() => handleReenviar(livro.compraId)}
                        disabled={reenviando}
                      >
                        {reenviando ? "Reenviando..." : "Reenviar e-mail"}
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {!carregando && meta && meta.totalPages > 1 && (
            <div className={styles.paginacao}>
              <Paginacao
                paginaAtual={paginaAtual}
                totalPaginas={meta.totalPages}
                totalItems={meta.totalItems}
                onMudarPagina={setPaginaAtual}
              />
            </div>
          )}
        </div>
      </div>
      {popup && (
        <Popup
          tipo={popup.tipo}
          mensagem={popup.mensagem}
          fechar={() => setPopup(null)}
        />
      )}
    </main>
  );
}
