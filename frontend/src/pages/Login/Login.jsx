import Input from "../../components/form/Input/Input";
import SubmitButton from "../../components/form/Submit/SubmitButton";

import useAuth from "../../hooks/useAuth";

import { useState, useEffect } from "react";
import {Link, useNavigate} from "react-router-dom";

export default function Login() {

  const {signin} = useAuth();

  const navigate = useNavigate();
  const handleSignin = async(e) =>{
        e.preventDefault();

    if(!email || !senha){
      setError("Preencha todos os campos.");
      return;
    }
    
    const res = await signin(email, senha);

    if(res){
      setError(res);
      return;
    }
    navigate("/");

  }
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  return (
    <form onSubmit={handleSignin}>
      <Input
        type="email"
        text="E-mail"
        placeholder="Digite seu e-mail"
        handleOnChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
      />
      <Input
        type="password"
        text="Senha"
        placeholder="Digite sua senha"
        handleOnChange={(e) => {
          setSenha(e.target.value);
        }}
        value={senha}
      />
      <SubmitButton text="Entrar" />

       <span>
              Não tem cadastro? <Link to = "/cadastro">Clique aqui.</Link>
        </span>

        
    </form>
  );
}
