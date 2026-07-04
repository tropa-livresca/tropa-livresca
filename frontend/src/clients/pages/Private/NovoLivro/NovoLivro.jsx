import { useState, useEffect } from "react";

import styles from "./NovoLivro.module.css";

import useLivros from "../../../hooks/useLivros";
import Formato from "./Formato/Formato";
import Detalhes from "./Detalhes/Detalhes";
import Conteudo from "./Conteudo/Conteudo";
import Orcamento from "./Orcamento/Orcamento";
import Confirmacao from "./Confirmacao/Confirmacao";

export default function NovoLivro() {
  const {InsertLivro, livro} = useLivros();
  const [etapa, setEtapa] = useState(1);

  const HandleCriarLivro = async (e, tdp) => {
    e.preventDefault();
    await InsertLivro(tdp);
    HandleMudarEtapa(true);
  }

  const HandleMudarEtapa = (posterior) => {
    posterior ? setEtapa(etapa + 1) : setEtapa(etapa - 1);
  }
 
  return(
    <>
      {etapa === 1 && <Formato HandleCriarLivro={HandleCriarLivro}/>}
      {etapa === 2 && <Detalhes/>}
      {etapa === 3 && <Conteudo/>}
      {etapa === 4 && <Orcamento/>}
      {etapa === 5 && <Confirmacao/>}
    </>
    
  )

}