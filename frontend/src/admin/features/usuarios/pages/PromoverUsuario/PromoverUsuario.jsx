import { useEffect, useState } from "react";
import { useUsuarios } from "../../hooks/useUsuarios"
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../../clients/components/Carregando/Carregando";
import styles from "../../../../../clients/features/livros/pages/Livros/Livros.module.css";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";


export default function GerenciarUsuarios(){
 
  const {BuscarUsuarios, usuarios, carregando, meta, alterarFuncao} = useUsuarios();
  
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      await BuscarUsuarios(paginaAtual, 3, busca, "cliente", ordem);
    }

    carregarDados();
  }, [paginaAtual, ordem, busca, BuscarUsuarios]);

  useEffect(() => {

  }, [usuarios]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    BuscarUsuarios(1, 3, busca, "cliente", ordem);
    setUsuarioSelecionado(null)
  };

  const handleFiltro = (filtro) => {
      setOrdem(filtro);
    
    setPaginaAtual(1);
    setDropdownAberto(null);
    setUsuarioSelecionado(null)
  }

  const handleSelecao = (id) => {
    if(id == usuarioSelecionado){
      setUsuarioSelecionado(null)
    }else{
      setUsuarioSelecionado(id)  
      }
  }

  const handlePromover = async (id, funcao) => {

      setConfirmado(false)
      await alterarFuncao(id, funcao)
      await BuscarUsuarios(1, 3, busca, "cliente", ordem);
  
  }

  console.log(usuarios)

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
            onChange={(e) => {setBusca(e.target.value); setUsuarioSelecionado(null) }}
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
                    handleFiltro("ascendente", false)
                  }}
                >
                  Mais Antigos
                </div>

                <div
                  onClick={() => {
                    handleFiltro("descendente", false)
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
                  
                  <div >{usuario.nome}</div>

                  <button onClick={() => handleSelecao(c)}>selecionar</button>
                </>

              );
            })}
          </div>
        )}

       {console.log(usuarioSelecionado)}


        {!carregando && meta && meta.totalPages > 1 && (
          <div className={styles.paginacao}>
            <button
              onClick={() => {setPaginaAtual((prev) => {return prev - 1}); 
              setUsuarioSelecionado(null)}}
              disabled={paginaAtual === 1}
            >
              Anterior
            </button>

            <span>
              Página {paginaAtual} de {meta.totalPages} (Total:{" "}
              {meta.totalItems})
            </span>

            <button
              onClick={() =>{
                setPaginaAtual((prev) => {return prev + 1})
                setUsuarioSelecionado(null)
              }
              }
              disabled={paginaAtual === meta.totalPages}
            >
              Próximo
            </button>
          </div>
        )}

        {confirmado == true ? <div>deseja mesmo promover? <button onClick={() => {handlePromover(usuarios[usuarioSelecionado].id, "funcionario")}}>sim</button> <button onClick={() => {setConfirmado(false)}}>não</button> </div> : <button disabled={usuarioSelecionado == null} onClick={() => {setConfirmado(true)}}>promover</button>}

        

      </div>
    </main>
  );
}