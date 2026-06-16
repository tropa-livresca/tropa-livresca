import { useState, useEffect } from "react";
import useLivros from "../../../hooks/useLivros";
import Formato from "./Formato/Formato"



export default function NovoLivro() {
  const {InsertLivro} = useLivros();
  const [livroId, setLivroId] = useState(null);

  const HandleCriarLivro = async (e) => {
    e.preventDefault();
    console.log("bc");
    await InsertLivro();
    console.log("dc");
  }
 
  return(
    <>
      <Formato HandleCriarLivro={HandleCriarLivro}/>
    </>
    
  )

}