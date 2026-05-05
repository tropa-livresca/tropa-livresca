import { useState } from "react";
import Input from "../../form/Input/Input";
import SubmitButton from "../../form/Submit/SubmitButton";

export default function ConfirmacaoForm() {
  
    const [codigo, setCodigo] = useState("");

    return (
    <>
      <form onSubmit={onSubmit}>
        <Input
        type = "text"
        text = "Código de verificação"
        name = "Código"
        placeholder = "Digite o código de verificação"
        handleOnChange={(e)=> setCodigo(e.target.value)}
        value = {codigo}
        />

        <SubmitButton text = "Submeter Código"/>
        
      </form>
    </>
  );
}
