import { useEffect, useState } from "react";
import { useFuncionario } from "../../hooks/useFuncionario";
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../components/Carregando/Carregando";
import styles from "./GerenciarFuncionarios.module.css";
import { useNavigate, Link } from "react-router-dom";
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

  const navigate = useNavigate();

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
  };

  const handleDetalhes = (id) => {
    navigate("/admin/usuarios/" + id);
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
            {funcionarios.map((funcionario, c) => (
              <div key={c}>
                <div>{funcionario.nome}</div>
                <div>{funcionario.isAutor ? "sim" : "não"}</div>
                <div>{funcionario.redes_sociais?.email}</div>

                <button onClick={() => handleDetalhes(funcionario.id)}>
                  Detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {!carregando && meta && meta.totalPages > 1 && (
        <div className={styles.paginacao}>
          <button
            onClick={() => {
              setPaginaAtual((prev) => prev - 1);
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
