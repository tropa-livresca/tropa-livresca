/**
 * Página de cadastro 
 */
import { useState, useEffect } from "react";
import Input from "../../components/form/Input/Input";
import SubmitButton from "../../components/form/Submit/SubmitButton";
import logo from "../../components/images/cad.png";
import styles from "./Cadastro.module.css";
import useAuth from "../../hooks/useAuth";
import {Link, useNavigate} from "react-router-dom";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {signup} = useAuth();

  const handleSignup = async(e) =>{

    e.preventDefault();

    if(!email || !senha || !confSenha || !telefone || !nome){
      setError("Preencha todos os campos.");
      return;
    }
    
    if(senha){}

    if(senha !== confSenha){
      setError("As senhas não são iguais.");
      return;
    }

    const res = await signup(email, senha, telefone, nome);

    if(res){
      setError(res);
      return;
    }

    alert("Usuário cadastrado com sucesso!");
    navigate("/login");
  }

  return (
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
        <img src={logo} alt="Tropa Livresca" width="100" />
      </div>

      <div className={styles.ldireito}>
        <div className={styles.formulario}>
          <form onSubmit={handleSignup} method="POST">
            <h1>CADASTRO</h1>

            <label>Usuário</label>
            <Input
              type="text"
              name="nome"
              placeholder="Digite o usuário"
              handleOnChange={(e) => setNome(e.target.value)}
              value={nome}
            />

            <label>E-mail</label>
            <Input
              type="email"
              name="email"
              placeholder="Digite o e-mail"
              handleOnChange={(e) => setEmail(e.target.value)}
              value={email}
            />

            <label>Senha</label>
            <Input
              type="password"
              name="senha"
              placeholder="Digite a senha"
              handleOnChange={(e) => setSenha(e.target.value)}
              value={senha}
            />

            <label>Confirmar Senha</label>
            <Input
              type="password"
              name="confSenha"
              placeholder="Confirme a senha"
              handleOnChange={(e) => setConfSenha(e.target.value)}
              value={confSenha}
            />
            
            <label>Telefone</label>
            <Input
              type="phone"
              name="tel"
              placeholder="Digite o telefone"
              handleOnChange={(e) => setTelefone(e.target.value)}
              value={telefone}
            />


            <span>{error}</span>

            <SubmitButton text="Realizar Cadastro" />

            <span>
              Já tem cadastro? <Link to = "/login">Clique aqui.</Link>
            </span>
            
            <SubmitButton text="Realizar Cadastro" />
        
          </form>
        </div>
      </div>
    </div>
  );
}
