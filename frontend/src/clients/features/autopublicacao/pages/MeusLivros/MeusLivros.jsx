import { useEffect } from "react";
import {useMeusLivros} from "../../hooks/useMeusLivros";

export default function MeusLivros() {
   const {
      Livros,
      carregando,
      BuscarLivrosById,
      UpdateEstado,
   } = useMeusLivros();
   
   useEffect(() => {
      const carregarDados = async () => {
         await BuscarLivrosById();
      };
      carregarDados();
   }, [BuscarLivrosById]);

   const possuiLivros = Array.isArray(Livros) && Livros.length > 0;

   if (carregando) return <div>Carregando seus livros...</div>;
   
   return (
      <div>
         {possuiLivros ? (
            <div>
               {Livros.map(livro => (
                  <div key={livro.id}>
                     <div>
                        {livro.capa?.[0] && <img src={livro.capa[0]} alt={livro.titulo} style={{ width: "50px" }} />}
                        <br />
                        {livro.titulo}
                     </div>
                     <div>
                        <button>Editar</button>
                        <button>Visualizar</button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div>Nenhum livro encontrado</div>
         )}
         
         <button onClick={() => { window.location.href = "/novo-livro"; }}>Novo Livro</button>
      </div>
   );

   return(
   <><button onClick={() => { window.location.href = "/novo-livro"; }}>Novo Livro</button></>);
}
