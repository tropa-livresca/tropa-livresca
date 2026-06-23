import Input from "../../../components/form/Input/Input";
import SubmitButton from "../../../components/form/Submit/SubmitButton";
import styles from "./Login.module.css";
import useAuth from "../../../hooks/useAuth";
import logo from "../../../components/images/log.jpg";
import logo2 from "../../../components/images/logo.png";
import { useState } from "react";
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
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
        <div className={styles.formulario}>
          <img src={logo2} alt="Tropa Livresca" width="100" />
          <form onSubmit={handleSignin}>
            <h1>LOGIN</h1>
            <h2>Bem-vindo de volta</h2>
            <h3>Insira seus dados para acessar sua conta</h3>
            <label>E-mail</label>
            <Input
              type="email"
              placeholder="Digite seu e-mail"
              handleOnChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
            <label>Senha</label>
            <Input
              type="password"
              placeholder="Digite sua senha"
              handleOnChange={(e) => {
                setSenha(e.target.value);
              }}
              value={senha}
            />

            <div id={styles.checkbox}>
              <input type="checkbox" />
              <label>Lembrar por 30 dias</label>
            </div>

            <SubmitButton text="ENTRAR" id={styles.btn}/>

            <div className={styles.errinho}>
            {error.length > 0 && <p>{error}</p>}
            </div>

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
          </form>
        </div>
      </div>
      <div className={styles.ldireito}>
        <img src={logo} alt="Tropa Livresca" width="100" />
      </div>
    </div>
  );
}
