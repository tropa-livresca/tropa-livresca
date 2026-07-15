import { useState } from "react";
import Input from "../../../../common/components/Input/Input";
import SubmitButton from "../../../../common/components/Submit/SubmitButton";

import {useNavigate} from "react-router-dom";
 
export default function ConfirmacaoForm({text}) {
  
    const [codigo, setCodigo] = useState("");

    const handleonSubmit = () =>{
        
    }

    return (
    <>
    <h1>Digite o seu cÃ³digo de verificaÃ§Ã£o mandado no seu {text}</h1>
      <form onSubmit={handleonSubmit}>
        <Input
        type = "text"
        text = "CÃ³digo de verificaÃ§Ã£o"
        name = "CÃ³digo"
        placeholder = "Digite o cÃ³digo de verificaÃ§Ã£o"
        handleOnChange={(e)=> setCodigo(e.target.value)}
        value = {codigo}
        />

        <SubmitButton text = "Submeter CÃ³digo"/>

      </form>
    </>
  );
}






