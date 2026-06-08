import { useState, useEffect } from "react";
import {GetLivros} from "../../../services/Livros.js";

export default function MeusLivros(){
   const [livros, setLivros] = useState([]);

   useEffect(() =>{
      
      let ignore = false;
      const StartLivros = async() =>{
         const data = await GetLivros();
         console.log(ignore);
         if(ignore == false){
             console.log(data);
             setLivros(data);
         }
      }

      StartLivros();

      return(() => {ignore = true;});

   }, [])

   return <table><tbody>{livros != [] ? livros.map(livro => {

    
        return <tr key={livro.id}>
            <td><img src={livro.capa}></img> <br></br> {livro.titulo}</td>
            <td><h3>editar</h3> <h3>visualizar</h3> <h3>{livro.ativo == true ? <span>desativar</span> : <span>ativar</span>}</h3></td>
         </tr>
    

         
   }) : null}</tbody></table>;
}