import { useEffect, useState } from "react";
import { useUsuarios } from "../../../../hooks/useUsuarios";
import { useFuncionario } from "../../hooks/useFuncionario";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../../clients/components/Carregando/Carregando";
import styles from "../../../../../clients/features/livros/pages/Livros/Livros.module.css";
import { FiChevronDown } from "react-icons/fi";

export default function PromoverUsuario() {
  const { buscarUsuarios, usuarios, carregando, meta } = useUsuarios();
  const { alterarFuncao } = useFuncionario();

  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("");
  const [funcao, setFuncao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [estadoDePromover, setEstadoDePromover] = useState("");

  useEffect(() => {
    const carregarDados = async () => {
      await buscarUsuarios(paginaAtual, 3, busca, "", ordem);
    };

    carregarDados();
  }, [paginaAtual, ordem, busca, buscarUsuarios]);

  useEffect(() => {}, [usuarios]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarUsuarios(1, 3, busca, "", ordem);
    setUsuarioSelecionado(null);
  };

  const handleFiltro = (filtro) => {
    setOrdem(filtro);

    setPaginaAtual(1);
    setDropdownAberto(null);
    setUsuarioSelecionado(null);
  };

  const handleSelecao = (id) => {
    if (id == usuarioSelecionado) {
      setUsuarioSelecionado(null);
      setEstadoDePromover("");
    } else {
      setUsuarioSelecionado(id);
      setEstadoDePromover("");
    }
  };

  const handleOpcoes = async (funcao) => {
    setEstadoDePromover("confirmando");
    setFuncao(funcao);
  };

  const handlePromover = async (id) => {
    setEstadoDePromover("");
    await alterarFuncao(id, funcao);
    await buscarUsuarios(1, 3, busca, "", ordem);
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
              setUsuarioSelecionado(null);
            }}
          />

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
                    handleFiltro("ascendente");
                  }}
                >
                  Mais Antigos
                </div>

                <div
                  onClick={() => {
                    handleFiltro("descendente");
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
            <Carregando mensagem="Carregando usuarios..." />
          </div>
        ) : !usuarios || usuarios.length === 0 ? (
          <p className={styles.semLivros}>Nenhum livro encontrado</p>
        ) : (
          <div>
            <div>nome</div>
            <br></br>

            {usuarios.map((usuario, c) => {
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
                setUsuarioSelecionado(null);
                setPaginaAtual((prev) => {
                  return prev - 1;
                });
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
                setUsuarioSelecionado(null);
                setPaginaAtual((prev) => {
                  return prev + 1;
                });
              }}
              disabled={paginaAtual === meta.totalPages}
            >
              Próximo
            </button>
          </div>
        )}

        {estadoDePromover == "confirmando" && usuarioSelecionado != null ? (
          <div>
            deseja mesmo promover?{" "}
            <button
              onClick={() => {
                handlePromover(usuarios[usuarioSelecionado].id);
              }}
            >
              sim
            </button>{" "}
            <button
              onClick={() => {
                setEstadoDePromover("false");
              }}
            >
              não
            </button>{" "}
          </div>
        ) : estadoDePromover == "opcoes" && usuarioSelecionado != null ? (
          <div>
            <button
              onClick={() => {
                handleOpcoes("funcionario");
              }}
              disabled={usuarios[usuarioSelecionado].funcao == "funcionario"}
            >
              funcionario
            </button>{" "}
            <button
              onClick={() => {
                handleOpcoes("Master");
              }}
              disabled={usuarios[usuarioSelecionado].funcao == "Master"}
            >
              Master
            </button>
          </div>
        ) : (
          <button
            disabled={usuarioSelecionado == null}
            onClick={() => {
              setEstadoDePromover("opcoes");
            }}
          >
            promover
          </button>
        )}
      </div>
    </main>
  );
}
