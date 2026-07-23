import styles from "./Autores.module.css";

import { Link } from "react-router-dom";

import { useAutores } from "../../../../hooks/useAutores";

import { FaSearch } from "react-icons/fa";

import { useEffect, useState } from "react";

import { FaUserCircle } from "react-icons/fa";

import Paginacao from "../../../../../common/components/Paginacao/Paginacao";

export default function Autores() {
  const { autores, carregando, erro, buscarAutores, meta } = useAutores();
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    buscarAutores(paginaAtual, 12, busca);
  }, [paginaAtual]);

  if (carregando) return <p>Carregando...</p>;

  if (erro) return <p>{erro}</p>;

  const handleBuscar = (e) => {
    e.preventDefault();
    setPaginaAtual(1);
    buscarAutores(1, 12, busca);
  };

  return (
    <div>
      <main className={styles.container}>
        <div className={styles.topo}>
          <h1 className={styles.titulo}>Autores</h1>

          <p className={styles.descricao}>
            A editora Tropa Livresca reúne autores independentes de todo o
            Brasil. Descubra escritores que compartilham histórias únicas,
            cheias de emoção e originalidade em suas obras.
          </p>

          <form className={styles.busca} onSubmit={handleBuscar}>
            <span className={styles.iconebusca}>
              <FaSearch />
            </span>

            <input
              type="text"
              placeholder="Buscar autor"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />

            <button className={styles.btnbuscar} type="submit">
              Buscar
            </button>
          </form>
        </div>

        <div className={styles.autorescontainer}>
          {!autores || autores.length === 0 ? (
            <p>Nenhum autor encontrado</p>
          ) : (
            autores.map((autor) => {
              return (
                <div className={styles.autorinf} key={autor.id}>
                  {autor.imagem ? (
                    <img src={autor.imagem} alt={autor.nome} />
                  ) : (
                    <div className={styles.semfoto}>
                      <FaUserCircle />
                    </div>
                  )}
                  <h3>{autor.nome || "Autor anônimo"}</h3>
                  <p>{autor.descricao || "Sem descrição"}</p>
                  <Link
                    to={`/autores/${autor.id}`}
                    className={styles.btndetalhes}
                  >
                    Ver perfil
                  </Link>
                </div>
              );
            })
          )}

          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={meta?.totalPages}
            totalItems={meta?.totalItems}
            onMudarPagina={setPaginaAtual}
          />
        </div>
      </main>
    </div>
  );
}
