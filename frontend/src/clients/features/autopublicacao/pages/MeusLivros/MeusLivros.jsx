import { useEffect } from "react";
import { useMeusLivros } from "../../hooks/useMeusLivros";

export default function MeusLivros() {
   const {
      Livros,
      carregando,
      BuscarLivrosById,
      UpdateEstado,
      InativarLivro,
   } = useMeusLivros();

   useEffect(() => {
      BuscarLivrosById();
   }, [BuscarLivrosById]);

   const possuiLivros = Array.isArray(Livros) && Livros.length > 0;

   if (carregando) return <div>Carregando seus livros...</div>;

   return (
      <div>
         {possuiLivros ? (
            <div>
               {Livros.map(livro => (
                  <div key={livro.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                     <div>
                        {livro.capa?.frente && (
                           <img src={livro.capa.frente} alt={livro.titulo} style={{ width: "50px" }} />
                        )}
                        <br />
                        <strong>{livro.titulo}</strong> — <span>{livro.estado}</span>
                     </div>
                     <div>
                        <button onClick={() => { window.location.href = `/editar-livro/${livro.id}`; }}>
                           Editar
                        </button>
                        <button>Visualizar</button>

                        {livro.estado === "rascunho" ? (
                           <button onClick={() => UpdateEstado(livro.id, false)}>
                              Publicar Livro
                           </button>
                        ) : (
                           <span>Publicado</span>
                        )}

                        <button onClick={() => InativarLivro(livro.id)}>
                           Inativar Livro Permanentemente
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div>Nenhum livro encontrado</div>
         )}

         <button onClick={() => { window.location.href = "/novo-livro"; }} style={{ marginTop: "20px" }}>
            Novo Livro
         </button>
      </div>
   );
}
