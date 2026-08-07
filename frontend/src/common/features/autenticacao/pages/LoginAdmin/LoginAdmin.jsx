import Input from "../../../../components/Input/Input";
import SubmitButton from "../../../../components/Submit/SubmitButton";
import styles from "./LoginAdmin.module.css";

import logo from "../../images/login.jpg";
import logo2 from "../../../../images/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";

import { useLoginAdmin } from "../../hooks/useLoginAdmin";

export default function LoginAdmin() {
  const {
    username,
    setUsername,
    senha,
    setSenha,
    error,
    handleLoginAdmin,
    navigate,
  } = useLoginAdmin();
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
          <form onSubmit={handleLoginAdmin}>
            <h1>LOGIN ADMINISTRADOR</h1>
            <h2>Bem-vindo de volta</h2>
            <h3>Insira seus dados para acessar sua conta</h3>
            
            <label>Usuário</label>
            <Input
              type="text"
              placeholder="Digite seu usuário"
              handleOnChange={(e) => setUsername(e.target.value)}
              value={username}
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
              
            <SubmitButton text="ENTRAR" id={styles.btn} />

            <div className={styles.errinho}>
              {error.length > 0 && <p>{error}</p>}
            </div>

            <div className={styles.informacoes}>
              <div className={styles.para}>
                <p>
                  Não é funcionário? <Link to="/auth/login"> Clique aqui.</Link>
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
