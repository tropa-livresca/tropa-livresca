import Input from "../../../../components/Input/Input";
import SubmitButton from "../../../../components/Submit/SubmitButton";
import BotaoGoogle from "../../components/BotaoGoogle/BotaoGoogle";
import styles from "./Login.module.css";

import {useLogin} from "../../hooks/useLogin";

import logo from "../../images/login.jpg";
import logo2 from "../../../../images/logo.png";

import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash} from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

export default function Login() {
  const {senha, setSenha, error, email, setEmail, handleSignin, navigate} = useLogin();

  const [mostrarSenha, setMostrarSenha] = useState(false);

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

            

            <SubmitButton text="Entrar" id={styles.btn} />

            <div className={styles.divisor}>
              <span></span>
              <p>ou</p>
              <span></span>
            </div>

            <BotaoGoogle/>

            <div className={styles.errinho}>
              {error.length > 0 && <p>{error}</p>}
            </div>

            <p>
              <Link to="/auth/esqueceu-senha">Esqueceu a senha?</Link>
            </p>

            <div className={styles.informacoes}>
              <div className={styles.para}>
                <p>
                  Não tem uma conta? <Link to="/auth/cadastro">Crie uma.</Link>
                </p>
                <p>
                  É funcionário? <Link to="/auth/admin">Clique aqui.</Link>
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
