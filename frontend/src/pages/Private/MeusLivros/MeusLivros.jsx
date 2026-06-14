/**
 * Barra de pesquisa
 * Botão de novo livro
 * Livros particulares
 */

import { useState, useEffect } from "react";
import useLivros from "../../../hooks/useLivros";

export default function MeusLivros() {

   const {
      Livros,
      carregando,
      setLivros,
      setCarregando,
      BuscarLivrosById,
      UpdateStatusAtivo,
   } = useLivros();

   useEffect(() => {
      const carregarDados = async() =>{
         await BuscarLivrosById();
      }
      carregarDados();
   }, []);

   const HandleStatusAtivo = async (id,ativo) => {
      await UpdateStatusAtivo(id,ativo);
      await BuscarLivrosById();
   }

   const possuiLivros = Array.isArray(Livros) && Livros.length > 0;

   if (carregando) return <div>Carregando seus livros...</div>;
   
   return (
      <table>
         <tbody>
            {possuiLivros ? (
               Livros.map(livro => (
                  <tr key={livro.id}>
                     <td>
                        {livro.capa && <img src={livro.capa} alt={livro.titulo} style={{ width: "50px" }} />}
                        <br />
                        {livro.titulo}
                     </td>
                     <td>
                        <h3>editar</h3>
                        <h3>visualizar</h3>
                        <h3> <button onClick={() => {HandleStatusAtivo(livro.id,!livro.ativo)}}>{livro.ativo === true ? "desativar" : "ativar"}</button> </h3>
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
