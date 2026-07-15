import { useEffect } from "react";
//import useLivros from "../../../hooks/useLivros";

export default function MeusLivros() {
   /*const {
      Livros,
      carregando,
      BuscarLivrosById,
      UpdateStatusAtivo,
   } = useLivros();

   useEffect(() => {
      const carregarDados = async () => {
         await BuscarLivrosById();
      };
      carregarDados();
   }, [BuscarLivrosById]);

   const HandleStatusAtivo = async (id) => {
      await UpdateStatusAtivo(id);
      await BuscarLivrosById();
   };

   const possuiLivros = Array.isArray(Livros) && Livros.length > 0;

   if (carregando) return <div>Carregando seus livros...</div>;
   
   return (
      <div>
         {possuiLivros ? (
            <div>
               {Livros.map(livro => (
                  <div key={livro.id} style={{ display: "flex", alignItems: "center", marginBottom: "15px", gap: "20px" }}>
                     <div>
                        {livro.capa && <img src={livro.capa} alt={livro.titulo} style={{ width: "50px" }} />}
                        <br />
                        {livro.titulo}
                     </div>
                     <div>
                        <button>Editar</button>
                        <button>Visualizar</button>
                        <button onClick={() => HandleStatusAtivo(livro.id)}>Desativar</button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div>Nenhum livro encontrado</div>
         )}
         
         <button onClick={() => { window.location.href = "/novo-livro"; }}>Novo Livro</button>
      </div>
   );*/
   return(
   <><button onClick={() => { window.location.href = "/novo-livro"; }}>Novo Livro</button></>);
}
