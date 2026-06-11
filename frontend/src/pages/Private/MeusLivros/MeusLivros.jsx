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
      BuscarLivrosById
   } = useLivros();

   useEffect(() => {
      const carregarDados = async() =>{
         await BuscarLivrosById();
      }
      carregarDados();
   }, []);

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
