import Input from "../../../components/form/Input/Input";
import SubmitButton from "../../../components/form/Submit/SubmitButton";
import styles from "./Login.module.css";
<<<<<<< HEAD
=======
import logo from "../../../components/images/image 1.png";

>>>>>>> 65cd21b (att)
import useAuth from "../../../hooks/useAuth";
import logo from "../../../components/images/image 1.png";
import logo2 from "../../../components/images/logo.png";
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
<<<<<<< HEAD
     <div className={styles.container}>
      <div className={styles.lesquerdo}>
      <div className={styles.formulario}>
         <img src={logo2} alt="Tropa Livresca" width="100" />
    <form onSubmit={handleSignin}>
      <h1>LOGIN</h1>
      <h2>Bem-vindo de volta</h2>
      <h3>Insira seus dados para acessar sua conta</h3>
=======
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
      <div className={styles.formulario}>
    <form onSubmit={handleSignin}>
      <h1>Login</h1>
>>>>>>> 65cd21b (att)
      <label>E-mail</label>
      <Input
        type="email"
        placeholder="Digite seu e-mail"
        handleOnChange={(e) => {
          setEmail(e.target.value);
        }}
        value={email}
      />
<<<<<<< HEAD

=======
>>>>>>> 65cd21b (att)
      <label>Senha</label>
      <Input
        type="password"
        placeholder="Digite sua senha"
        handleOnChange={(e) => {
          setSenha(e.target.value);
        }}
        value={senha}
      />
<<<<<<< HEAD
      
      <div id={styles.checkbox}>
        <input type="checkbox"/>
        <label>Lembrar por 30 dias</label>
      </div>
      
      <SubmitButton text="Entrar" />

      {error.length > 0 && <p>{error}</p>}

      <p>
        <Link to="/cadastro">Esqueceu a senha?</Link>
      </p>

      <div className={styles.informacoes}>
        <div className={styles.para}>
        <p>
        Não tem uma conta? <Link to="/cadastro">Crie uma.</Link>
        </p>
        <p>
        É funcionário? <Link to="/cadastro">Clique aqui.</Link>
        </p>
        </div>
      </div>

=======
      <SubmitButton text="Login" />

      {error.length > 0 && <p>{error}</p>}
      
      <span>
        <Link to="/cadastro">Esqueceu a Senha?</Link>
      </span>

      <span id={styles.oi}>
      Já tem cadastro? <Link to="/login">Clique aqui.</Link><br />
      É funcionário? <Link to="/login">Clique aqui.</Link>
      </span>
     
>>>>>>> 65cd21b (att)
    </form>
    </div>
    </div>
    <div className={styles.ldireito}>
<<<<<<< HEAD
            <img src={logo} alt="Tropa Livresca" width="100" />
    </div>
=======
        <img src={logo} alt="Tropa Livresca" width="100" />
      </div>
>>>>>>> 65cd21b (att)
    </div>
  );
}
