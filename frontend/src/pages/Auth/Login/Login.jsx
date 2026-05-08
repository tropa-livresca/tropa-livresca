import Input from "../../../components/form/Input/Input";
import SubmitButton from "../../../components/form/Submit/SubmitButton";

import useAuth from "../../../hooks/useAuth";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Página responsável pelo Login dos Usuários
 * Gerencia o estado do formulário, validações de e-mail e senha e integração com hook de autenticação
 *
 * @component
 * @returns {JSX.element}
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const { signin } = useAuth();

  const navigate = useNavigate();
  /**
   * Trata o envio do formulário de Login
   * Realiza validações de campos vazios, antes de chamar o servidor
   *
   * @param {React.FormEvent<HTMLFormElement>}
   * @returns {Promise<Void>}
   */
  const handleSignin = async (e) => {
    e.preventDefault();
    setError(""); //Limpa erros prévios

    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    const res = await signin(email, senha);

    /**
     * Assume que 'res' contem a mensagem de erro de Supabase/AuthContext
     */
    if (res) {
      setError("Senha ou e-mail não conferem");
      return;
    }

    navigate("/"); //Navega até a tela de Início
  };

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

      {error.length > 0 && <p>{error}</p>}
      
      <span>
        Não tem cadastro? <Link to="/cadastro">Clique aqui.</Link>
      </span>
    </form>
  );
}
