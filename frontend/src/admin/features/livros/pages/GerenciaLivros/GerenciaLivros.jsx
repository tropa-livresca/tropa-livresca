import { useLivros } from "../../hooks/useLivros";
import { FaSearch, FaBookOpen, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "./GerenciaLivros.module.css";
import Carregando from "../../../../components/Carregando/Carregando";
import Paginacao from "../../../../../common/components/Paginacao/Paginacao";

export default function GerenciaLivros() {
  const { livros, carregando, count, buscarLivros, alterarAtivo } = useLivros();

  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState("ascendente");
  const [estado, setEstado] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [executandoAcao, setExecutandoAcao] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(null);

  const dropdownRef = useRef(null);

  const itensPorPagina = 8;
  const totalPages = count ? Math.ceil(count / itensPorPagina) : 1;

  useEffect(() => {
    buscarLivros(
      paginaAtual,
      itensPorPagina,
      busca,
      filtro,
      ordem,
      "",
      estado
    );
  }, [paginaAtual, buscarLivros, filtro, ordem, estado]);

  useEffect(() => {
    const fecharDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownAberto(null);
      }
    };

    document.addEventListener("mousedown", fecharDropdown);

    return () => {
      document.removeEventListener("mousedown", fecharDropdown);
    };
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();

    setPaginaAtual(1);

    buscarLivros(
      1,
      itensPorPagina,
      busca,
      filtro,
      ordem,
      "",
      estado
    );
  };

  const selecionarFiltro = (valor) => {
    setFiltro(valor);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const selecionarOrdem = (valor) => {
    setOrdem(valor);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const selecionarEstado = (valor) => {
    setEstado(valor);
    setPaginaAtual(1);
    setDropdownAberto(null);
  };

  const handleInativar = async (livro) => {
    console.log(livro);

    let mensagem = null;

    if (livro.ativo == true) {
      mensagem = `Tem certeza que deseja INATIVAR o livro ${livro.titulo}? Ele ficara indisponivel para compra.`;
    } else {
      mensagem = `Tem certeza que deseja ATIVAR o livro ${livro.titulo}? Ele ficara disponivel para compra.`;
    }

    if (!window.confirm(mensagem)) return;

    setExecutandoAcao(true);

    try {
      await alterarAtivo(livro.id, !livro.ativo);

      await buscarLivros(
        1,
        itensPorPagina,
        busca,
        filtro,
        ordem,
        "",
        estado
      );
    } catch (erro) {
      alert(erro.message || "Erro ao inativar livro.");
    } finally {
      setExecutandoAcao(false);
    }
  };

  const textoFiltro =
    filtro === "alfabetico"
      ? "Ordem Alfabética"
      : filtro === "data"
        ? "Data de Publicação"
        : "Ordenar por";

  const textoOrdem =
    filtro === "data"
      ? ordem === "descendente"
        ? "Mais Recentes"
        : "Antigos"
      : ordem === "descendente"
        ? "Decrescente"
        : "Crescente";

  const textoEstado =
    estado === "publicado"
      ? "Publicados"
      : estado === "em_revisao"
        ? "Para revisão"
        : "Todos";

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>Livros publicados pela editora</h1>

        <p>
          Acompanhe os livros da editora, seus autores e o estado de revisão.
        </p>
      </div>

      <div className={styles.container}>
        <form className={styles.filtroForm} onSubmit={handleBuscar}>
          <div className={styles.buscaWrapper}>
            <FaSearch className={styles.buscaIcon} />

            <input
              type="text"
              className={styles.inputBusca}
              placeholder="Buscar livro"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          <div className={styles.selectWrapper}>
            <div
              className={styles.selectDiv}
              onClick={() =>
                setDropdownAberto(dropdownAberto === "filtro" ? null : "filtro")
              }
            >
              <span>{textoFiltro}</span>

              <FaChevronDown
                className={`${styles.selectIcon} ${
                  dropdownAberto === "filtro" ? styles.selectIconAberto : ""
                }`}
              />
            </div>

            {dropdownAberto === "filtro" && (
              <div className={styles.opcoes}>
                <div
                  className={`${styles.opcao} ${
                    filtro === "" ? styles.opcaoSelecionada : ""
                  }`}
                  onClick={() => selecionarFiltro("")}
                >
                  Ordenar por
                </div>

                <div
                  className={`${styles.opcao} ${
                    filtro === "alfabetico" ? styles.opcaoSelecionada : ""
                  }`}
                  onClick={() => selecionarFiltro("alfabetico")}
                >
                  Ordem Alfabética
                </div>

                <div
                  className={`${styles.opcao} ${
                    filtro === "data" ? styles.opcaoSelecionada : ""
                  }`}
                  onClick={() => selecionarFiltro("data")}
                >
                  Data de Publicação
                </div>
              </div>
            )}
          </div>

          <div className={styles.selectWrapper}>
            <div
              className={styles.selectDiv}
              onClick={() =>
                setDropdownAberto(dropdownAberto === "ordem" ? null : "ordem")
              }
            >
              <span>{textoOrdem}</span>

              <FaChevronDown
                className={`${styles.selectIcon} ${
                  dropdownAberto === "ordem" ? styles.selectIconAberto : ""
                }`}
              />
            </div>

            {dropdownAberto === "ordem" && (
              <div className={styles.opcoes}>
                <div
                  className={`${styles.opcao} ${
                    ordem === "ascendente" ? styles.opcaoSelecionada : ""
                  }`}
                  onClick={() => selecionarOrdem("ascendente")}
                >
                  {filtro === "data" ? "Antigos" : "Crescente"}
                </div>

                <div
                  className={`${styles.opcao} ${
                    ordem === "descendente" ? styles.opcaoSelecionada : ""
                  }`}
                  onClick={() => selecionarOrdem("descendente")}
                >
                  {filtro === "data" ? "Mais Recentes" : "Decrescente"}
                </div>
              </div>
            )}
          </div>

          <div className={styles.selectWrapper}>
            <div
              className={styles.selectDiv}
              onClick={() =>
                setDropdownAberto(dropdownAberto === "estado" ? null : "estado")
              }
            >
              <span>{textoEstado}</span>

              <FaChevronDown
                className={`${styles.selectIcon} ${
                  dropdownAberto === "estado" ? styles.selectIconAberto : ""
                }`}
              />
            </div>

            {dropdownAberto === "estado" && (
              <div className={styles.opcoes}>
                <div
                  className={`${styles.opcao} ${
                    estado === "" ? styles.opcaoSelecionada : ""
                  }`}
                  onClick={() => selecionarEstado("")}
                >
                  Todos
                </div>

                <div
                  className={`${styles.opcao} ${
                    estado === "publicado" ? styles.opcaoSelecionada : ""
                  }`}
                  onClick={() => selecionarEstado("publicado")}
                >
                  Publicados
                </div>

                <div
                  className={`${styles.opcao} ${
                    estado === "em_revisao" ? styles.opcaoSelecionada : ""
                  }`}
                  onClick={() => selecionarEstado("em_revisao")}
                >
                  Para revisão
                </div>
              </div>
            )}
          </div>

          <button type="submit" className={styles.btn}>
            <FaSearch />
            <span>Buscar</span>
          </button>
        </form>

        {carregando ? (
          <Carregando mensagem="Carregando livros..." />
        ) : !livros || livros.length === 0 ? (
          <div className={styles.cardnenhumlivro}>
            <FaSearch size={40} />

            <h3 className={styles.titulon}>Nenhum livro encontrado</h3>

            <p className={styles.sub}>
              Tente mudar os termos da busca ou os filtros aplicados.
            </p>
          </div>
        ) : (
          <div className={styles.tabelaContainer}>
            <table className={styles.tabelaLivros}>
              <thead>
                <tr>
                  <th>Capa</th>
                  <th>Título e Autor</th>
                  <th>Data de Publicação</th>
                  <th>Estado</th>
                  <th>Revisão</th>
                  <th>Ativo</th>
                  <th style={{ textAlign: "center" }}>Ações</th>
                </tr>
              </thead>

              <tbody>
                {livros.map((livro) => {
                  let capaObjeto = null;

                  try {
                    capaObjeto =
                      typeof livro.capa === "string"
                        ? JSON.parse(livro.capa)
                        : livro.capa;
                  } catch (e) {
                    console.error("Erro ao converter capa JSONB:", e);
                  }

                  return (
                    <tr key={livro.id}>
                      <td>
                        <div className={styles.capaContainer}>
                          {capaObjeto ? (
                            <img
                              src={capaObjeto.frente}
                              alt={livro.titulo}
                              className={styles.capaMini}
                            />
                          ) : (
                            <div className={styles.semCapaMini}>
                              <FaBookOpen color="#67170c" />
                            </div>
                          )}
                        </div>
                      </td>

                      <td>
                        <div className={styles.detalhesTexto}>
                          <h3 className={styles.livroTitulo}>
                            {livro.titulo || "Sem título"}
                          </h3>

                          <span className={styles.sub}>
                            {livro.autor_nome} {livro.autor_sobrenome}
                          </span>
                        </div>
                      </td>

                      <td className={styles.numero}>
                        {livro.data_de_publicacao}
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${livro.estado === "publicado" ? styles.badgeOn : styles.badgeOff}`}
                        >
                          {livro.estado === "publicado"
                            ? "Publicado"
                            : "Não publicado"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${livro.estado === "em_revisao" ? styles.badgeOn : styles.badgeOff}`}
                        >
                          {livro.estado === "em_revisao"
                            ? "Em revisão"
                            : "Revisto"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${livro.ativo == true ? styles.badgeOn : styles.badgeOff}`}
                        >
                          {livro.ativo == true ? "Sim" : "Não"}
                        </span>
                      </td>

                      <td>
                        <div className={styles.acoesColuna}>
                          <Link
                            to={`/admin/livros/detalhes/${livro.id}`}
                            className={`${styles.btnAcao} ${styles.btnVisualizar}`}
                          >
                            Ver Livro{" "}
                            <span className={styles.numero2}>{livro.id}</span>
                          </Link>

                          {livro.estado === "em_revisao" && (
                            <Link
                              to={`/admin/livros/revisoes/nova-revisao/${livro.id}`}
                              className={styles.inativar}
                            >
                              Revisar
                            </Link>
                          )}

                          {livro.estado === "publicado" && (
                            <button
                              onClick={() => handleInativar(livro)}
                              className={styles.inativar}
                              disabled={executandoAcao}
                            >
                              {livro.ativo == true ? "Inativar" : "Ativar"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!carregando && totalPages > 1 && (
          <Paginacao
            totalPaginas={totalPages}
            totalItems={count}
            paginaAtual={paginaAtual}
            onMudarPagina={setPaginaAtual}
          />
        )}
      </div>
    </main>
  );
}