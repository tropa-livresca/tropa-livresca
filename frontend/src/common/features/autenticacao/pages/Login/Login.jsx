import Input from "../../../../components/Input/Input";
import SubmitButton from "../../../../components/Submit/SubmitButton";
import styles from "./Login.module.css";

import useAuth from "../../../../hooks/useAuth";

import logo from "../../images/login.jpg";
import logo2 from "../../../../images/logo.png";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const { signin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    const res = await signin(email, senha);

    if (res) {
      setError(res);
      return;
    }

    navigate(from, { replace: true });
  };

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const loginGoogle = () => {
    // aaa
  };

  return (
    <div className={styles.container}>
      <div className={styles.lesquerdo}>
        <div className={styles.formulario}>
          <button
            type="button"
            className={styles.voltar}
            onClick={() => navigate("/")}
          >
            <IoChevronBack size={28} />
          </button>

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

            <div className={styles.inputSenha}>
              <Input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Digite sua senha"
                handleOnChange={(e) => setSenha(e.target.value)}
                value={senha}
              />

              <button
                type="button"
                className={styles.olho}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <div id={styles.checkbox}>
              <input type="checkbox" />
              <label>Lembrar por 30 dias</label>
            </div>

            <SubmitButton text="ENTRAR" id={styles.btn} />

            <div className={styles.divisor}>
              <span></span>
              <p>ou</p>
              <span></span>
            </div>

            <button
              type="button"
              className={styles.google}
              onClick={loginGoogle}
            >
              <FaGoogle />
              Entrar com Google
            </button>

            <div className={styles.errinho}>
              {error.length > 0 && <p>{error}</p>}
            </div>

            <p>
              <Link to="/auth/cadastro">Esqueceu a senha?</Link>
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
