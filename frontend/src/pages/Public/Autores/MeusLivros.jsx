import { useState, useEffect } from "react";
import {Livros} from "../../../components/Livros.jsx";

export default function MeusLivros(){
   const [livros, setLivros] = useState("");

   useEffect(() =>{
      const StartLivros = async() =>{
         console.log("a");
         const data = Livros();
         setLivros(data);
      }

      

   })

   return <h1>{livros}</h1>;
}