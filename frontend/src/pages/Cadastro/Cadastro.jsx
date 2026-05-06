import { useState, useEffect } from "react";
import Input from "../../components/form/Input/Input";
import SubmitButton from "../../components/form/Submit/SubmitButton";
import logo from "../../components/images/cad.png";
import styles from "./Cadastro.module.css";
import useAuth from "../../hooks/useAuth";
import {Link, useNavigate} from "react-router-dom";

/**
 * Página de Cadastro de Usuários
 * Gerencia o estado do formulário, validações básicas de senha e integração com o hook de autenticação
 * 
 * @component
 * @returns {JSX.element}
 */
export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {signup} = useAuth();

  /**
   * Trata o envio de formulário de cadastro
   * Realiza validações de campos vazios e igualdade de senhas antes de chamar o servidor
   * 
   * @param {React.FormEvent<HTMLFormElement>} e 
   * @returns {Promise<void>}
   */
  const handleSignup = async(e) =>{
    e.preventDefault();
    setError("");//Limpa erros prévios

    if(!email || !senha || !confSenha || !telefone || !nome){
      setError("Preencha todos os campos.");
      return;
    }
    
    if(senha){}//Aguardando outras verificações de senha para tratamento de erros

    if(senha !== confSenha){
      setError("As senhas não são iguais.");
      return;
    }

    const res = await signup(email, senha, telefone, nome);

    if(res){
      //Assume que 'res' contém a mensagem de erro vinda do Supabase/AuthContext

      setError(res);
      return;
    }

    alert("Usuário cadastrado com sucesso!");

    navigate("/confirmacaoemail");//Envia o usuário à tela de login caso funcione até que a tela de confirmação de e-mail ser criada
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

            <SubmitButton text="Realizar Cadastro" />

            <span>
              Já tem cadastro? <Link to = "/login">Clique aqui.</Link>
            </span>
            
          </form>
        </div>
      </div>
    </div>
  );
}
