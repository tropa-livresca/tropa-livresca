import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useMeusLivros } from "../../hooks/useMeusLivros";

export default function MeusLivros() {
  const { Livros, carregando, BuscarLivrosById, UpdateEstado, InativarLivro } =
    useMeusLivros();

  useEffect(() => {
    BuscarLivrosById();
  }, [BuscarLivrosById]);

  const possuiLivros = Array.isArray(Livros) && Livros.length > 0;

  if (carregando) return <div>Carregando seus livros...</div>;

  return (
    <div>
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
                <strong>{livro.titulo || "Sem título"}</strong> —{" "}
                <span>{livro.estado}</span>
              </div>
              <div>
                <Link to={`/editar-livro/${livro.id}`}>Editar</Link>

                {livro.estado === "rascunho" && (
                  <button
                    onClick={() => UpdateEstado(livro.id, "em_revisao")}
                  >
                    Enviar para Revisão
                  </button>
                )}

                {livro.estado === "em_revisao" && (
                  <button onClick={() => UpdateEstado(livro.id, "rascunho")}>
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
                  >
                    Inativar Livro Permanentemente
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Nenhum livro encontrado</div>
      )}

      <Link to="/novo-livro" style={{ marginTop: "20px" }}>
        Novo Livro
      </Link>
    </div>
  );
}
