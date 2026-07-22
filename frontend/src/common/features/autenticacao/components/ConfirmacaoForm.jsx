import { useState } from "react";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/Submit/SubmitButton";

import {useNavigate} from "react-router-dom";
 
export default function ConfirmacaoForm({text}) {
  
    const [codigo, setCodigo] = useState("");

    const handleonSubmit = () =>{
        
    }

    return (
    <>
    <h1>Digite o seu código de verificação mandado no seu {text}</h1>
      <form onSubmit={handleonSubmit}>
        <Input
        type = "text"
        text = "Código de verificação"
        name = "Código"
        placeholder = "Digite o código de verificaÃ§Ã£o"
        handleOnChange={(e)=> setCodigo(e.target.value)}
        value = {codigo}
        />

        <SubmitButton text = "Submeter Código"/>

      </form>
    </>
  );
}