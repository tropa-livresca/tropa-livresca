import { useState, useEffect } from "react";
import {Livros} from "../../../services/Livros.js";

export default function MeusLivros(){
   const [livros, setLivros] = useState("");

   useEffect(() =>{
      const StartLivros = async() =>{
         console.log("a");
         const data = await Livros();
         setLivros(data);
      }
   }, []);

   return <h1>{livros != "" ? livros[0].titulo : ""}</h1>;
}