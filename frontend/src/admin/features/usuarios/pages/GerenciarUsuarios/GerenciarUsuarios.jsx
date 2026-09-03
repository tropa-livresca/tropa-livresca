import { useEffect, useState } from "react";
import { useUsuarios } from "../../hooks/useUsuarios"
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../../clients/components/Carregando/Carregando";
import styles from "../../../../../clients/features/livros/pages/Livros/Livros.module.css";
import { FiChevronDown } from "react-icons/fi";


export default function GerenciarUsuarios(){
 
  const {BuscarUsuarios, usuarios, carregando, meta} = useUsuarios();
  
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("");
  const [funcao, setFuncao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      await BuscarUsuarios(paginaAtual, 12, busca, funcao, ordem);
    };

    carregarDados();
  }, [paginaAtual, funcao, ordem, busca, BuscarUsuarios]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    BuscarUsuarios(1, 12, busca, funcao, ordem);
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
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className={styles.selectContainer}>
            <div
              className={styles.select}
              onClick={() =>
                setDropdownAberto(dropdownAberto === "filtro" ? null : "filtro")
              }
            >
              <span>
                {funcao === "cliente"
                  ? "clientes"
                  : funcao === "autor"
                    ? "autores"
                    : funcao === "funcionario"
                    ? "funcionarios"
                    : ""}
              </span>

              <FiChevronDown
                className={dropdownAberto === "filtro" ? styles.setaAberta : ""}
              />
            </div>

            {dropdownAberto === "filtro" && (
              <div className={styles.options}>
                <div
                  onClick={() => {
                    setFuncao("");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  <span>Ordenar por</span>
                </div>

                <div
                  onClick={() => {
                    setFuncao("cliente");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  <span>cliente</span>
                </div>

                <div
                  onClick={() => {
                    setFuncao("autor");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >

                  
                  <span>autor</span>
                </div>

                <div
                  onClick={() => {
                    setFuncao("funcionario");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >

                  
                  <span>funcionario</span>
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
                    setOrdem("ascendente");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
                  }}
                >
                  Mais Antigos
                </div>

                <div
                  onClick={() => {
                    setOrdem("descendente");
                    setPaginaAtual(1);
                    setDropdownAberto(null);
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
          <div className={styles.livros}>
            {usuarios.map((usuario) => {
              return (
                <div key={usuario.id} className={styles.cardLivro}>

                  <div className={styles.infoLivro}>

                      <h3>{usuario.nome || "Sem título"}</h3>

                      <p className={styles.autor}>
                        {usuario.funcao || "Cliente"}
                      </p>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!carregando && meta && meta.totalPages > 1 && (
          <div className={styles.paginacao}>
            <button
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaAtual === 1}
            >
              Anterior
            </button>

            <span>
              Página {paginaAtual} de {meta.totalPages} (Total:{" "}
              {meta.totalItems})
            </span>

            <button
              onClick={() =>
                setPaginaAtual((prev) => Math.min(prev + 1, meta.totalPages))
              }
              disabled={paginaAtual === meta.totalPages}
            >
              Próximo
            </button>
          </div>
        )}

        {funcao === "" ? <button>promover</button> : funcao === "funcionario" ? <button>deletarr</button> : <></>}

      </div>
    </main>
  );
}