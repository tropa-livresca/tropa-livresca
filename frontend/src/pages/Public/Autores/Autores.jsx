import styles from "./Autores.module.css";

import { Link } from "react-router-dom";

import { useAutor } from "../../../hooks/useAutor";
import logo from "../../../components/images/cad.png";
import { FaSearch } from "react-icons/fa";

import { useEffect, useState } from "react";
import Cabecalho from "../../../components/layout/Cabecalho/Cabecalho";

export default function Autores() {
  const { autores, carregando, erro, buscarAutores, meta } = useAutor();
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    buscarAutores(paginaAtual, 12, busca);
  }, []);

  if (carregando) return <p>Carregando...</p>

  if (erro) return <p>{erro}</p>

  if (autores.length === 0) return <p>Nenhum autor cadastrado</p>

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarAutores(1, 12, busca);
  }

  const autoresFiltrados = autores.filter((autor) => {
    return autor.nome?.toLowerCase().includes(busca.toLowerCase());
  });

  return (
    <div>
      <main className={styles.container}>
        <div className={styles.topo}>
          <h1 className={styles.titulo}>Autores</h1>

          <p className={styles.descricao}>
            A editora Tropa Livresca reúne autores independentes de todo o Brasil.
            Descubra escritores que compartilham histórias únicas, cheias de
            emoção e originalidade em suas obras.
          </p>

          <form className={styles.busca}>
            <span className={styles.iconebusca}>
              <FaSearch />
            </span>

            <input
              type="text"
              placeholder="Buscar autor"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <button className={styles.btnbuscar} type="submit">Buscar</button>
          </form>
        </div>

        <div className={styles.autorescontainer}>
          {!autores || autores.length === 0 ? (<p>Nenhum autor encontrado</p>) : (
            autores.map((autor) => {
              return (
                <div className={styles.autorinf} key={autor.id}>
                  {autor.imagem ? (<img src={autor.imagem} alt={autor.nome} width="100" />) : (<div>Sem foto</div>)}
                  <h3>{autor.nome || "Autor anônimo"}</h3>
                  <p>{autor.descricao || "Sem descrição"}</p>
                  <Link to={`/autores/${autor.id}`} className={styles.btndetalhes}>Ver Perfil</Link>
                </div>
              );
            })
          )}

          {meta && meta.totalPage > 1 && (
            <div>
              <button
                onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaAtual === 1}
              >
                Anterior
              </button>

              <span>Página {paginaAtual} de {meta.totalPages} (Total: {meta.totalItems})</span>

              <button
                onClick={() => setPaginaAtual((prev) => Math.min(prev + 1, meta.totalPages))}
                disabled={paginaAtual === meta.totalPages}
              >
                Próximo
              </button>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}