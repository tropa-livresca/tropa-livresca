import { useState } from "react";
import Input from "../../form/Input/Input";
import SubmitButton from "../../form/Submit/SubmitButton";
import Auth from "../../../context/auth/Auth";
import { useNavigate } from "react-router-dom";

export default function ConfirmacaoEmail() {
  const { confirmsignup } = Auth();
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const handleonSubmit = async() => {
    
  };

  return (
    <>
      <h1>Digite o seu código de verificação mandado no seu {text}</h1>
      <form onSubmit={handleonSubmit}>
        <Input
          type="text"
          text="Código de verificação"
          name="Código"
          placeholder="Digite o código de verificação"
          handleOnChange={(e) => setToken(e.target.value)}
          value={token}
        />

        <SubmitButton text="Submeter Código" />
      </form>
    </>
  );
}
