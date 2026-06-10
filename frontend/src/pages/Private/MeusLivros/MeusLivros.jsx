/**
 * Barra de pesquisa
 * Botão de novo livro
 * Livros particulares
 */

import { useState, useEffect } from "react";
import useLivros from "../../../hooks/useLivros";
import useAuth from "../../../hooks/useAuth";

export default function MeusLivros() {

      console.log("Componente MeusLivros montou com sucesso!");

   const {
      livros,
      setLivros,
      GetLivrosByAutor
   } = useLivros();

   const { user } = useAuth();
   const [carregando, setCarregando] = useState(true);

   useEffect(() => {
      let ignore = false;

      const StartLivros = async () => {
         setCarregando(true);
         // Usando o ID do usuário logado se existir, ou o ID de teste como fallback
         const idAutor = user?.id || "d411fa2d-a163-4dcb-ada4-3ed2c6e937d5";
         
         console.log("Iniciando busca para o autor:", idAutor);
         const data = await GetLivrosByAutor(idAutor);

         if (!ignore) {
            console.log("Dados brutos que vieram da API:", data);
            
            // CORREÇÃO: Se 'data' for uma string ("error"), joga um array vazio para não quebrar o .length
            if (typeof data === "string" || !data) {
               setLivros([]);
            } else {
               setLivros(data);
            }
            setCarregando(false);
         }
      }

      StartLivros();

      return () => { ignore = true; };
   }, [user, setLivros]);

   const possuiLivros = Array.isArray(livros) && livros.length > 0;

   if (carregando) {
      return <div>Carregando seus livros...</div>;
   }

   return (
      <table>
         <tbody>
            {possuiLivros ? (
               livros.map(livro => (
                  <tr key={livro.id}>
                     <td>
                        {livro.capa && <img src={livro.capa} alt={livro.titulo} style={{ width: "50px" }} />}
                        <br /> 
                        {livro.titulo}
                     </td>
                     <td>
                        <h3>editar</h3> 
                        <h3>visualizar</h3> 
                        <h3>{livro.ativo === true ? <span>desativar</span> : <span>ativar</span>}</h3>
                     </td>
                  </tr>
               ))
            ) : (
               <tr>
                  <td>Nenhum livro encontrado</td>
               </tr>
            )}
         </tbody>
      </table>
   );
}
