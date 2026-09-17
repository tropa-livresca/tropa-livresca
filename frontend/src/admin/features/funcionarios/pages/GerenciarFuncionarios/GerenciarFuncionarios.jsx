import { useEffect, useState } from "react";
import { useFuncionario } from "../../hooks/useFuncionario";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./GerenciarFuncionarios.module.css";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";

export default function GerenciarFuncionarios() {
  const {
    buscarFuncionarios,
    funcionarios,
    carregando,
    meta,
    isMaster,
    verificarMaster,
  } = useFuncionario();

  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("");
  const [funcao, setFuncao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);

  console.log(meta);

  useEffect(() => {
    const checarMaster = async () => {
      await verificarMaster();
    };

    checarMaster();
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      await buscarFuncionarios(paginaAtual, 3, busca, funcao, ordem);
    };

    carregarDados();
  }, [paginaAtual, funcao, ordem, busca, buscarFuncionarios]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarFuncionarios(1, 3, busca, funcao, ordem);
    setFuncionarioSelecionado(null);
  };

  console.log(funcionarios);

  const handleFiltro = (filtro, funcao) => {
    if (funcao == true) {
      setFuncao(filtro);
    } else {
      setOrdem(filtro);
    }
    setPaginaAtual(1);
    setDropdownAberto(null);
    setFuncionarioSelecionado(null);
  };

  const handleDetalhes = (id) => {
    if (id == funcionarioSelecionado) {
      setFuncionarioSelecionado(null);
    } else {
      setFuncionarioSelecionado(id);
    }
  };

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>usuarios</h1>
      </div>

      <div className={styles.container}>
        <form onSubmit={handleBuscar} className={styles.busca}>
          <span className={styles.iconebusca}>
            <FaSearch />
          </span>

          <input
            className={styles.inputBusca}
            type="text"
            placeholder="Buscar usuario"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setFuncionarioSelecionado(null);
            }}
          />

          <div className={styles.selectContainer}>
            <div
              className={styles.select}
              onClick={() =>
                setDropdownAberto(dropdownAberto === "filtro" ? null : "filtro")
              }
            >
              <span>
                {funcao === "funcionario"
                  ? "funcionarios"
                  : funcao === "Master"
                    ? "Masters"
                    : ""}
              </span>

              <FiChevronDown
                className={dropdownAberto === "filtro" ? styles.setaAberta : ""}
              />
            </div>

            {dropdownAberto === "filtro" && (
              <div className={styles.options}>
                <div onClick={() => handleFiltro("", true)}>
                  <span>Ordenar por</span>
                </div>

                <div onClick={() => handleFiltro("funcionario", true)}>
                  <span>funcionario</span>
                </div>

                <div onClick={() => handleFiltro("Master", true)}>
                  <span>Master</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.selectContainer}>
            <div
              className={styles.select1}
              onClick={() =>
                setDropdownAberto(dropdownAberto === "ordem" ? null : "ordem")
              }
            >
              <span>
                {ordem === "ascendente" ? "Mais Antigos" : "Mais Recentes"}
              </span>

              <FiChevronDown
                className={dropdownAberto === "filtro" ? styles.setaAberta : ""}
              />
            </div>

            {dropdownAberto === "ordem" && (
              <div className={styles.options}>
                <div onClick={() => handleFiltro("ascendente", false)}>
                  Mais Antigos
                </div>

                <div onClick={() => handleFiltro("descendente", false)}>
                  Mais Recentes
                </div>
              </div>
            )}
          </div>

          <button type="submit" className={styles.btnbuscar}>
            Buscar
          </button>
        </form>

        {carregando ? (
          <div className={styles.carregando}>
            <Carregando mensagem="Carregando usuarios..." />
          </div>
        ) : !funcionarios || funcionarios.length === 0 ? (
          <p className={styles.semUsuarios}>Nenhum usuário encontrado</p>
        ) : (
          <div>
            {funcionarios.map((usuario, c) => (
              <div key={c}>
                <div>{usuario.nome}</div>
                <div>{usuario.isAutor ? "sim" : "não"}</div>
                <div>{usuario.redes_sociais?.email}</div>

                <button onClick={() => handleDetalhes(c)}>Detalhes</button>
              </div>
            ))}
          </div>
        )}

        {funcionarioSelecionado != null &&
          funcionarios[funcionarioSelecionado] && (
            <div>
              {funcionarios[funcionarioSelecionado].imagem ? (
                <img
                  src={funcionarios[funcionarioSelecionado].imagem}
                  alt="Perfil"
                ></img>
              ) : (
                <div>sem imagem</div>
              )}
              <div>{funcionarios[funcionarioSelecionado].nome}</div>
              <div>{funcionarios[funcionarioSelecionado].telefone}</div>
              <div>{funcionarios[funcionarioSelecionado].descricao}</div>
              <div>{funcionarios[funcionarioSelecionado].nome}</div>
              <div>
                {funcionarios[funcionarioSelecionado].isAdmin
                  ? "Funcionário"
                  : "Cliente"}
              </div>
              <div>
                {funcionarios[funcionarioSelecionado].redes_sociais?.email}
              </div>

              {funcionarios[funcionarioSelecionado].isAutor && (
                <div>
                  {funcionarios[funcionarioSelecionado].livros?.map(
                    (livro, index) => {
                      if (livro.ativo && livro.estado === "publicado") {
                        const capaObj = livro.capa
                          ? JSON.parse(livro.capa)
                          : null;
                        return (
                          <div key={index}>
                            <div>
                              {capaObj?.frente ? (
                                <img src={capaObj.frente} alt="Capa"></img>
                              ) : (
                                <div>sem capa</div>
                              )}
                              <p>{livro.titulo}</p>
                            </div>
                            <Link to={`../livros/detalhes/${livro.id}`}>
                              ver detalhes
                            </Link>
                          </div>
                        );
                      }
                      return null;
                    },
                  )}
                </div>
              )}

              {funcionarios[funcionarioSelecionado].revisoes && (
                <div>
                  {funcionarios[funcionarioSelecionado].revisoes.map(
                    (revisao, rIndex) => {
                      const livroRevisado = funcionarios[
                        funcionarioSelecionado
                      ].livros?.find(
                        (livro) => livro.id === revisao.fk_livro_id,
                      );
                      const capaRevisadaObj = livroRevisado?.capa
                        ? JSON.parse(livroRevisado.capa)
                        : null;

                      return (
                        <div key={rIndex}>
                          <div>{revisao.data}</div>
                          <div>{revisao.apontamento}</div>
                          <div>{revisao.nome}</div>
                          {capaRevisadaObj?.frente ? (
                            <img
                              src={capaRevisadaObj.frente}
                              alt="Capa do Livro"
                            ></img>
                          ) : (
                            <div>sem capa</div>
                          )}
                          <div>
                            {livroRevisado?.titulo || "Título não encontrado"}
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          )}
      </div>

      {!carregando && meta && meta.totalPages > 1 && (
        <div className={styles.paginacao}>
          <button
            onClick={() => {
              setPaginaAtual((prev) => prev - 1);
              funcionarios[funcionarioSelecionado](null);
            }}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>

          <span>
            Página {paginaAtual} de {meta.totalPages} (Total: {meta.totalItems})
          </span>

          <button
            onClick={() => {
              setPaginaAtual((prev) => prev + 1);
              funcionarios[funcionarioSelecionado](null);
            }}
            disabled={paginaAtual === meta.totalPages}
          >
            Próximo
          </button>
        </div>
      )}

      {isMaster == true && (
        <div>
          <Link to="/admin/funcionarios/promover">promover</Link>
          <Link to="/admin/funcionarios/inativar">inativar</Link>
        </div>
      )}
    </main>
  );
}
