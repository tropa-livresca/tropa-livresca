import styles from "./Loja.module.css";
import Carregando from "../../../../components/Carregando/Carregando";
import CardProduto from "../../components/CardProduto/CardProduto";
import { useLivrosLoja } from "../../hooks/useLivrosLoja";
import { useCarrinho } from "../../hooks/useCarrinho";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao";
import { FaSearch } from "react-icons/fa";
import { FiChevronDown, FiShoppingCart } from "react-icons/fi";
import DescricaoTela from "../../../../components/DescricaoTela/DescricaoTela";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Loja() {
  const { livros = [], meta, carregando, buscarLivros } = useLivrosLoja();
  const { adicionarItem } = useCarrinho();
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("");
  const [busca, setBusca] = useState("");
  const [buscaEnviada, setBuscaEnviada] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [categoria, setCategoria] = useState("");

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

  useEffect(() => {
    buscarLivros(paginaAtual, 12, buscaEnviada, filtro, ordem, categoria);
  }, [paginaAtual, buscaEnviada, filtro, ordem, categoria]);

  const handleCategoria = (novaCategoria) => {
    setCategoria(categoria === novaCategoria ? "" : novaCategoria);
    setBusca("");
    setBuscaEnviada("");
    setPaginaAtual(1);
  };

  const handleFiltro = (novoFiltro) => {
    setFiltro(novoFiltro);
    setOrdem(novoFiltro === "data" ? "descendente" : "ascendente");
    setPaginaAtual(1);
    setDropdownAberto(false);
  };

  const handleBusca = (e) => {
    e.preventDefault();
    setCategoria("");
    setPaginaAtual(1);
    setBuscaEnviada(busca.trim());
  };

  const handleOrdem = (novaOrdem) => {
    setOrdem(novaOrdem);
    setPaginaAtual(1);
    setDropdownAberto(false);
  };

  return (
    <main>
      <DescricaoTela
        titulo="Loja"
        descricao="Nosso site é feito por quem respira livros, pensando na melhor experiência para você."
      />
      <div className={styles.container}>
        <div className={styles.containerlivros}>
          <div className={styles.filtros}>
            <div className={styles.oi}>
              <h1>Gênero</h1>
            </div>
            <ul>
              <li onClick = {()=> handleCategoria("")}>Todos</li>
              {generos.map((gen) => (
                <li
                  key={gen}
                  onClick={() => handleCategoria(gen)}
                  className={categoria === gen ? styles.categoriaAtiva : ""}
                  style={{
                    cursor: "pointer",
                    fontWeight: categoria === gen ? "bold" : "normal",
                  }}
                >
                  {gen}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.form}>
            <form onSubmit={handleBusca} className={styles.busca}>
              <span className={styles.iconebusca}>
                <FaSearch />
              </span>
              <input
                className={styles.inputBusca}
                type="text"
                placeholder="Buscar livro"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              <div className={styles.selectContainer}>
                <div
                  className={styles.select}
                  onClick={() => setDropdownAberto(!dropdownAberto)}
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
                </div>
                {dropdownAberto && (
                  <div className={styles.options}>
                    <div
                      onClick={() => {
                        handleFiltro("");
                        setOrdem("");
                      }}
                    >
                      <span>Ordenar por</span>
                    </div>
                    <div onClick={() => handleFiltro("alfabetico")}>
                      <span>Ordem Alfabética</span>
                    </div>
                    <div onClick={() => handleFiltro("data")}>
                      <span>Data de Publicação</span>
                    </div>
                    {filtro && (
                      <>
                        <div onClick={() => handleOrdem("ascendente")}>
                          <span>Ascendente</span>
                        </div>
                        <div onClick={() => handleOrdem("descendente")}>
                          <span>Descendente</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button type="submit" className={styles.btnbuscar}>
                Buscar
              </button>
            </form>
          </div>
          <div className={styles.carrinho}>
            <Link to="/carrinho">
              <FiShoppingCart />
            </Link>
          </div>


          <div className={styles.livros}>
            {carregando ? (
              <Carregando mensagem="Carregando loja..." />
            ) : livros.length === 0 ? (
              <p>Nenhum livro encontrado.</p>
            ) : (
              livros.map((livro) => (
                <CardProduto
                  key={livro.id}
                  livro={livro}
                  aoAdicionar={adicionarItem}
                />
              ))
            )}
          </div>

          {!carregando && meta && meta.totalPages > 1 && (
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={meta.totalPages}
              totalItems={meta.totalItems}
              onMudarPagina={(novaPagina) => setPaginaAtual(novaPagina)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
