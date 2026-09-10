import { useEffect, useState } from "react";
import { useUsuarios } from "../../hooks/useUsuarios"
import { FaSearch } from "react-icons/fa";
import Carregando from "../../../../../clients/components/Carregando/Carregando";
import styles from "../../../../../clients/features/livros/pages/Livros/Livros.module.css";
import { Link } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";


export default function GerenciarUsuarios(){
 
  const {BuscarUsuarios, usuarios, carregando, meta} = useUsuarios();
  
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("");
  const [funcao, setFuncao] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [dropdownAberto, setDropdownAberto] = useState(null);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      await BuscarUsuarios(paginaAtual, 3, busca, funcao, ordem);
    }

    carregarDados();
  }, [paginaAtual, funcao, ordem, busca, BuscarUsuarios]);

  useEffect(() => {

  }, [usuarios]);

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    BuscarUsuarios(1, 3, busca, funcao, ordem);
    setUsuarioSelecionado(null)
  };

  const handleFiltro = (filtro, funcao) => {
    if(funcao == true){
      setFuncao(filtro);
    }
    else{
      setOrdem(filtro);
    }
    setPaginaAtual(1);
    setDropdownAberto(null);
    setUsuarioSelecionado(null)
  }

  const handleDetalhes = (id) => {
    if(id == usuarioSelecionado){
      setUsuarioSelecionado(null)
    }else{
      setUsuarioSelecionado(id)  
      }
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
                    handleFiltro("", true)
                  }}
                >
                  <span>Ordenar por</span>
                </div>

                <div
                  onClick={() => {
                    handleFiltro("cliente", true)
                  }}
                >
                  <span>cliente</span>
                </div>

                <div
                  onClick={() => {
                    handleFiltro("autor", true)
                  }}
                >

                  
                  <span>autor</span>
                </div>

                <div
                  onClick={() => {
                    handleFiltro("funcionario", true)
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
          <table>

             <tr>
                    <td >nome</td>
                    <td >funcao</td>
                    <td >autor</td>
             </tr>

            {usuarios.map((usuario, c) => {
              return (
 
                <>
                  

                  <tr>
                    <td >{usuario.nome}</td>
                    <td >{usuario.funcao || "Cliente"}</td>
                    <td >{usuario.autor == true ? "sim" : "não"}</td>
                  </tr>

                  <button onClick={() => handleDetalhes(c)}></button>
                </>

              );
            })}
          </table>
        )}

       {console.log(usuarioSelecionado)}

        {usuarioSelecionado != null ? <div>
        {usuarios[usuarioSelecionado]?.imagem  ? <img src={usuarios[usuarioSelecionado].imagem}></img> : <div>sem imagem</div> }
        <div>{usuarios[usuarioSelecionado].nome}</div>
        <div>{usuarios[usuarioSelecionado].telefone}</div>
        <div>{usuarios[usuarioSelecionado].descricao}</div>
        <div>{usuarios[usuarioSelecionado].nome}</div>
        <div>{usuarios[usuarioSelecionado].funcao}</div>
        <div>{usuarios[usuarioSelecionado].redes_sociais?.email}</div>

        {usuarios[usuarioSelecionado].autor == true ? <div>
          {usuarios[usuarioSelecionado].livros.map(livro => {
            if(livro.ativo == true && livro.estado == "publicado"){
             return(  <>
                    <div>
                      {console.log(livro?.capa)}
                      {console.log(JSON.parse(livro?.capa) )}
                      {livro?.capa ?  JSON.parse(livro?.capa).frente != undefined ?  
                      <img src={JSON.parse(livro?.capa).frente}></img>  
                      : <div>sem capa</div>
                      : <div>sem capa</div>} 
                      
                      
                      <p>{livro.titulo}</p></div>
                        <Link to={"../livros/detalhes/"+livro.id}>ver detalhes</Link>
                      </> )
            }
            
          })
          }
      </div> : <></>}

      {usuarios[usuarioSelecionado].revisoes[0] != undefined  ? <div>{usuarios[usuarioSelecionado].revisoes.map(revisao => {

        let livroRevisado = usuarios.map(usuario => {
          let detalhes =  usuario.livros.filter(livro =>{if(livro.id == revisao.fk_livro_id){return true}} )
          
          if(detalhes != []){
            return detalhes
          }else{
            return
          }
         
          }
        )

        console.log(livroRevisado)

        livroRevisado = livroRevisado.filter(livro => {if(livro[0] != undefined){return true}})

        livroRevisado = livroRevisado[0][0]

        console.log(livroRevisado)

        return(
        <div>
        <div>{revisao.data_criacao}</div>
        <div>{revisao.apontamento}</div>
        <div>{revisao.nome}</div>
        {livroRevisado?.capa != undefined ? JSON.parse(livroRevisado.capa).frente != undefined ? <img src={JSON.parse(livroRevisado?.capa).frente}></img> : <div>sem capa</div> : <div>sem capa</div>}
        <div>{livroRevisado.titulo}</div>
        </div>
        )
      })}</div> : <></>}

      

      </div> : <></>}


        {!carregando && meta && meta.totalPages > 1 && (
          <div className={styles.paginacao}>
            <button
              onClick={() => {setPaginaAtual((prev) => Math.max(prev - 1, 1)); setUsuarioSelecionado(null)}}
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
                setPaginaAtual((prev) => {Math.min(prev + 1, meta.totalPages); setUsuarioSelecionado(null)})
              }
              disabled={paginaAtual === meta.totalPages}
            >
              Próximo
            </button>
          </div>
        )}

        {funcao === "" ? <button>promover</button> : funcao === "funcionario" ? <button>deletar</button> : <></>}

      </div>
    </main>
  );
}