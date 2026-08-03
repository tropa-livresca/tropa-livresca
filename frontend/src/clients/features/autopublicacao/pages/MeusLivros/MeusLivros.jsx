import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMeusLivros } from "../../hooks/useMeusLivros";
import styles from "./MeusLivros.module.css";
import { IoLibraryOutline } from "react-icons/io5";

export default function MeusLivros() {
  const { Livros, carregando, BuscarLivrosById, UpdateEstado, InativarLivro } =
    useMeusLivros();

  useEffect(() => {
    BuscarLivrosById();
  }, [BuscarLivrosById]);

  const possuiLivros = Array.isArray(Livros) && Livros.length > 0;

  if (carregando) return <div>Carregando seus livros...</div>;

  return (
    <main className={styles.container}>
      {possuiLivros ? (
        <div>
          {Livros.map((livro) => (
            <div
              key={livro.id}
              style={{
                marginBottom: "20px",
                borderBottom: "1px solid #ccc",
                paddingBottom: "10px",
              }}
            >
              <div>
                {livro.capa?.frente && (
                  <img
                    src={livro.capa.frente}
                    alt={livro.titulo}
                    style={{ width: "50px" }}
                  />
                )}
                <br />
                <strong>{livro.titulo}</strong> — <span>{livro.estado}</span>
              </div>

              <div>
                <button className={`${styles.btn} ${styles.btnVisualizar}`}>
                  Visualizar
                </button>

                <Link
                  to={`/editar-livro/${livro.id}`}
                  className={`${styles.btn} ${styles.btnEditar}`}
                >
                  Editar
                </Link>

                {livro.estado === "rascunho" && (
                  <button
                    onClick={() => UpdateEstado(livro.id, "em_revisao")}
                    className={`${styles.btn} ${styles.btnPublicar}`}
                  >
                    Enviar para Revisão
                  </button>
                )}

                {livro.estado === "em_revisao" && (
                  <button
                    onClick={() => UpdateEstado(livro.id, "rascunho")}
                    className={`${styles.btn} ${styles.btnPublicar}`}
                  >
                    Cancelar Revisão (Voltar para Rascunho)
                  </button>
                )}

                {livro.estado === "publicado" && (
                  <span
                    style={{
                      color: "green",
                      fontWeight: "bold",
                      marginLeft: "8px",
                    }}
                  >
                    Publicado
                  </span>
                )}

                {livro.estado !== "em_revisao" && (
                  <button
                    onClick={() => {
                      if (confirm("Deseja inativar este livro?"))
                        InativarLivro(livro.id);
                    }}
                    className={`${styles.btn} ${styles.btnInativar}`}
                  >
                    Inativar Livro Permanentemente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.cardnenhumlivro}>
          <IoLibraryOutline size={60} />
          <h1 className={styles.titulon}>
            Sua estante está esperando por você.
          </h1>
          <span className={styles.sub}>
            Dê o primeiro passo na sua carreira de escritor. Autopublique seu
            livro e compartilhe sua obra com novos leitores.
          </span>
        </div>
      )}

      <Link to="/novo-livro" className={styles.btn}>
        Novo Livro
      </Link>
    </main>
  );
}
