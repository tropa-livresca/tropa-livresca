import { useState, useEffect } from "react";
import {GetLivros, GetLivrosDeAutor} from "../../../services/Livros.js";
import useAuth from "../../../hooks/useAuth.js";

export default function MeusLivros(){
   const [livros, setLivros] = useState([]);
   const { user } = useAuth();

   useEffect(() =>{
      let ignore = false;
      const StartLivros = async() =>{
         const data = await GetLivrosDeAutor("d411fa2d-a163-4dcb-ada4-3ed2c6e937d5");
         console.log(ignore);
         if(ignore == false){
            console.log(user);
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
