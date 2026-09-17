import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../../clients/components/Carregando/Carregando";
import styles from "../../../../../clients/features/livros/pages/Livros/Livros.module.css";
import { FiChevronDown } from "react-icons/fi";
import { useFuncionario } from "../../hooks/useFuncionario";

export default function Gerenciarfuncionarios() {
  const {
    buscarFuncionarios,
    funcionarios,
    carregando,
    meta,
    alterarIsAdminFuncionario,
  } = useFuncionario();

  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("");
  const [funcao, setFuncao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [estadoDeInativar, setEstadoDeInativar] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      await buscarFuncionarios(paginaAtual, 3, busca, funcao, ordem);
    };
    carregarDados();
  }, [paginaAtual, funcao, ordem, buscarFuncionarios]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarFuncionarios(1, 3, busca, funcao, ordem);
    setFuncionarioSelecionado(null);
  };

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

  const handleSelecao = (id) => {
    if (id == funcionarioSelecionado) {
      setFuncionarioSelecionado(null);
      setEstadoDeInativar("");
    } else {
      setFuncionarioSelecionado(id);
      setEstadoDeInativar("");
    }
  };

  const handleInativar = async (id) => {
    setEstadoDeInativar("");
    await alterarIsAdminFuncionario(id);
    await buscarFuncionarios(1, 3, busca, "funcionario", ordem);
  };

  return (
    <main>
      <div className={styles.topo}>
        <h1 className={styles.titulo}>funcionarios</h1>
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
                <div
                  onClick={() => {
                    handleFiltro("ascendente", false);
                  }}
                >
                  Mais Antigos
                </div>

                <div
                  onClick={() => {
                    handleFiltro("descendente", false);
                  }}
                >
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
            <Carregando mensagem="Carregando funcionarios..." />
          </div>
        ) : !funcionarios || funcionarios.length === 0 ? (
          <p className={styles.semLivros}>Nenhum livro encontrado</p>
        ) : (
          <div>
            <div>nome</div>
            <br></br>

            {funcionarios.map((usuario, c) => {
              return (
                <>
                  <div>{usuario.nome}</div>

                  <button onClick={() => handleSelecao(c)}>selecionar</button>
                </>
              );
            })}
          </div>
        )}

        {!carregando && meta && meta.totalPages > 1 && (
          <div className={styles.paginacao}>
            <button
              onClick={() => {
                setPaginaAtual((prev) => {
                  return prev - 1;
                });
                setFuncionarioSelecionado(null);
              }}
              disabled={paginaAtual === 1}
            >
              Anterior
            </button>

            <span>
              Página {paginaAtual} de {meta.totalPages} (Total:{" "}
              {meta.totalItems})
            </span>

            <button
              onClick={() => {
                setPaginaAtual((prev) => {
                  return prev + 1;
                });
                setFuncionarioSelecionado(null);
              }}
              disabled={paginaAtual === meta.totalPages}
            >
              Próximo
            </button>
          </div>
        )}

        {estadoDeInativar == "confirmando" ? (
          <div>
            deseja mesmo inativar?{" "}
            <button
              onClick={() => {
                handleInativar(funcionarios[funcionarioSelecionado].id);
              }}
            >
              sim
            </button>{" "}
            <button
              onClick={() => {
                setEstadoDeInativar("");
              }}
            >
              não
            </button>{" "}
          </div>
        ) : (
          <button
            disabled={funcionarioSelecionado == null}
            onClick={() => {
              setEstadoDeInativar("confirmando");
            }}
          >
            inativar
          </button>
        )}
      </div>
    </main>
  );
}
