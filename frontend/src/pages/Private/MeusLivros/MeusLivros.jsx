import { useState, useEffect } from "react";
import {GetLivros} from "../../../services/Livros.js";

export default function MeusLivros(){
   const [livros, setLivros] = useState("");

   useEffect(() =>{
      const StartLivros = async() =>{
         const data = await GetLivros();
         setLivros(data);
      }

      StartLivros();

      return(setLivros(""));

   }, [])

   return <table><tbody>{livros != "" ? livros.map(livro => {

    
        return <tr key={livro.id}>
            <td><img src={livro.capa}></img> <br></br> {livro.titulo}</td>
            <td><h3>editar</h3> <h3>visualizar</h3> <h3>{livro.ativo == true ? <span>desativar</span> : <span>ativar</span>}</h3></td>
         </tr>
    

         
   }) : ""}</tbody></table>;
}