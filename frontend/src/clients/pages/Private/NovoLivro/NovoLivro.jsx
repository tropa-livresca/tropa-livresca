import { useState, useEffect } from "react";
import useLivros from "../../../hooks/useLivros";
import Formato from "./Formato/Formato"
import Detalhes from "./Detalhes/Detalhes"


export default function NovoLivro() {
  const {InsertLivro, livro} = useLivros();
  const [etapa, setEtapa] = useState(1);

  const HandleCriarLivro = async (e, tdp) => {
    e.preventDefault();
    console.log("bc");
    await InsertLivro(tdp);
    console.log("dc");
    HandleMudarEtapa(true);
  }

  const HandleMudarEtapa = (posterior) => {
    if(posterior == true){
      setEtapa(etapa + 1);
    }else{
      setEtapa(etapa - 1);
    }
  }
 
  return(
    <>
      
      {etapa == 1 && <Formato HandleCriarLivro={HandleCriarLivro}/>}
      {etapa == 2 && <Detalhes/>}

      

    </>
    
  )

}