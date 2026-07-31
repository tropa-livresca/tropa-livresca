import { useEffect } from "react";
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
                <button
                  onClick={() => {
                    window.location.href = `/editar-livro/${livro.id}`;
                  }}
                  className={`${styles.btn} ${styles.btnEditar}`}
                >
                  Editar
                </button>
                <button className={`${styles.btn} ${styles.btnVisualizar}`}>
                  Visualizar
                </button>

                {livro.estado === "rascunho" ? (
                  <button
                    onClick={() => UpdateEstado(livro.id, false)}
                    className={`${styles.btn} ${styles.btnPublicar}`}
                  >
                    Publicar Livro
                  </button>
                ) : (
                  <span>Publicado</span>
                )}

                <button
                  onClick={() => InativarLivro(livro.id)}
                  className={`${styles.btn} ${styles.btnInativar}`}
                >
                  Inativar Livro Permanentemente
                </button>
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

      <button
        onClick={() => {
          window.location.href = "/novo-livro";
        }}
        className={styles.btn}
      >
        Novo Livro
      </button>
    </main>
  );
}
